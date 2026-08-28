#!/bin/bash
# usage: bash build.sh "<presigned put url>"
set -e
UP="$1"
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ
cd "$(dirname "$0")"

echo "== frames"
python3 build.py

echo "== voice over"
declare -A VO=(
 [1]=hf_20260828_202120_7e6860fb-d9cb-4797-95b9-d7770714be7c
 [2]=hf_20260828_202120_87605a85-4b74-4fac-914f-6bbffc8f3354
 [3]=hf_20260828_202120_16c526c6-a5aa-4df8-b9e3-97d9f4cdfa52
 [4]=hf_20260828_202424_df993e99-949d-4bc8-a7f8-bd8ef86f114a
 [5]=hf_20260828_202424_9f028869-e3fe-444c-8d10-50852a9f44f0
 [6]=hf_20260828_202120_4a8d820f-d648-45aa-9db3-0f59914b4451
)
for i in 1 2 3 4 5 6; do
  curl -sf -o raw$i.wav "$CDN/${VO[$i]}.wav"
  ffmpeg -nostdin -v error -y -i raw$i.wav -af "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,loudnorm=I=-18:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo" vo$i.wav </dev/null
  printf "vo%s %s\n" $i $(ffprobe -v error -show_entries format=duration -of csv=p=0 vo$i.wav)
done

echo "== segments"
rm -f list.txt
while read n d; do
  p=$(printf "o%02d.png" $n); s=$(printf "g%02d.mp4" $n)
  ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $p -t $d \
    -c:v libx264 -preset veryfast -tune stillimage -crf 20 -pix_fmt yuv420p -r 25 -g 50 \
    -vf scale=1920:1080 $s </dev/null
  echo "file '$s'" >> list.txt
done < durs.txt

echo "== concat video"
ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy silent.mp4 </dev/null

echo "== audio bed, vo placed at measured marks"
ffmpeg -nostdin -y -loglevel error \
 -i vo1.wav -i vo2.wav -i vo3.wav -i vo4.wav -i vo5.wav -i vo6.wav \
 -filter_complex "[0]adelay=18000|18000[a];[1]adelay=65000|65000[b];[2]adelay=118000|118000[c];[3]adelay=162000|162000[d];[4]adelay=172000|172000[e];[5]adelay=199000|199000[f];[a][b][c][d][e][f]amix=inputs=6:normalize=0:duration=longest,apad,atrim=0:236,alimiter=limit=0.95[out]" \
 -map "[out]" -c:a aac -b:a 160k track.m4a </dev/null

echo "== mux"
ffmpeg -nostdin -y -loglevel error -i silent.mp4 -i track.m4a -c:v copy -c:a copy -shortest hashilush-v2-roughcut.mp4 </dev/null
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=nw=1 hashilush-v2-roughcut.mp4

echo "== upload"
curl -f -s -X PUT -H "Content-Type: video/mp4" --upload-file hashilush-v2-roughcut.mp4 "$UP" && echo UPLOAD_OK
