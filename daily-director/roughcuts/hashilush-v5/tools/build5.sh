#!/bin/bash
# usage: bash build5.sh "<presigned put url>"
set -e
UP="$1"
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ
cd "$(dirname "$0")"

echo "== plan"
python3 build5.py

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
  [ -f vo$i.wav ] || {
    curl -sf -o raw$i.wav "$CDN/${VO[$i]}.wav"
    ffmpeg -nostdin -v error -y -i raw$i.wav -af "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,loudnorm=I=-18:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo" vo$i.wav </dev/null
  }
done

echo "== segments"
rm -f list.txt
NC=0; ND=0
while read n d k url; do
  s=$(printf "g%02d.mp4" $n)
  case "$k" in
    clip)
      c=$(printf "c%02d.mp4" $n)
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      ffmpeg -nostdin -y -loglevel error -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null
      NC=$((NC+1)) ;;
    burst|card)
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%02d.png" $n) -t $d \
        -c:v libx264 -preset veryfast -tune stillimage -crf 20 -pix_fmt yuv420p -r 25 -g 50 \
        -vf "scale=1920:1080,setsar=1" $s </dev/null ;;
    dolly)
      FR=$(python3 -c "print(int(round($d*25)))")
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%02d.png" $n) -t $d \
        -vf "scale=3840:2160,zoompan=z='min(zoom+0.0006,1.10)':d=$FR:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,setsar=1" \
        -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null
      ND=$((ND+1)) ;;
  esac
  echo "file '$s'" >> list.txt
done < plan.txt
echo "clips $NC dolly $ND"

echo "== concat"
ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy silent.mp4 </dev/null
TOT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 silent.mp4)
echo "video duration $TOT"

echo "== audio"
FC=""; IN=""; LBL=""; i=0
while read v ms; do
  IN="$IN -i vo$v.wav"
  FC="$FC[$i]adelay=$ms|$ms[x$i];"
  LBL="$LBL[x$i]"
  i=$((i+1))
done < marks.txt
FC="$FC$LBL""amix=inputs=$i:normalize=0:duration=longest,apad,atrim=0:$TOT,alimiter=limit=0.95[out]"
ffmpeg -nostdin -y -loglevel error $IN -filter_complex "$FC" -map "[out]" -c:a aac -b:a 160k track.m4a </dev/null

echo "== mux"
ffmpeg -nostdin -y -loglevel error -i silent.mp4 -i track.m4a -c:v copy -c:a copy -shortest hashilush-v5-final.mp4 </dev/null
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=nw=1 hashilush-v5-final.mp4

echo "== upload"
curl -f -s -X PUT -H "Content-Type: video/mp4" --upload-file hashilush-v5-final.mp4 "$UP" && echo UPLOAD_OK
