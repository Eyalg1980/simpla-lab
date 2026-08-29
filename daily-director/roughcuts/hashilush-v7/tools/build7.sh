#!/bin/bash
# usage: bash build7.sh "<presigned put url>"
set -e
UP="$1"
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ
cd "$(dirname "$0")"

echo "== hebrew narration"
declare -A HE=(
 [1]=hf_20260829_062549_3f974055-5a8d-43a0-a9e9-1c536ae0ab6f
 [2]=hf_20260829_062548_42ad5d39-0f0c-4308-8966-579c82df765c
 [3]=hf_20260829_062548_764a69e5-82f7-4387-a9e5-3dd9f096d88f
 [4]=hf_20260829_062548_c2fa46e6-d4fc-47bd-8069-26c9713b98e8
 [5]=hf_20260829_062548_c3d7022f-4c9d-470f-a59c-4653249e10ba
 [6]=hf_20260829_062548_f8befee9-fee0-4fd9-bdfd-4624d54e405d
)
for i in 1 2 3 4 5 6; do
  [ -f hv$i.wav ] || {
    curl -sf -o rh$i.mp3 "$CDN/${HE[$i]}.mp3"
    ffmpeg -nostdin -v error -y -i rh$i.mp3 -af "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,loudnorm=I=-18:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo" hv$i.wav </dev/null
  }
  echo -n "  vo$i "; ffprobe -v error -show_entries format=duration -of csv=p=0 hv$i.wav
done

echo "== plan and subtitles"
python3 build7.py

echo "== segments"
rm -f list.txt
NEXP=$(wc -l < plan.txt)
while read n d k url ss; do
  s=$(printf "g%02d.mp4" $n)
  case "$k" in
    clip)
      c=$(printf "c%02d.mp4" $n)
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null ;;
    slow)
      # source is shorter than the slot: stretch it instead of cutting the slot
      c=$(printf "c%02d.mp4" $n)
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      SRC=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c")
      F=$(python3 -c "print('%.4f' % (($d + 0.2) / ($SRC - $ss)))")
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=PTS*$F,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null
      echo "  shot $n stretched x$F from ${SRC}s" ;;
    flash|card)
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%02d.png" $n) -t $d \
        -c:v libx264 -preset veryfast -tune stillimage -crf 20 -pix_fmt yuv420p -r 25 -g 50 \
        -vf "scale=1920:1080,setsar=1" $s </dev/null ;;
    dolly)
      FR=$(python3 -c "print(int(round($d*25)))")
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%02d.png" $n) -t $d \
        -vf "scale=3840:2160,zoompan=z='min(zoom+0.0006,1.10)':d=$FR:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,setsar=1" \
        -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null ;;
  esac
  # a source shorter than its slot would silently shift every later shot and
  # drag the narration out of sync. that is the v6 bug. fail here instead.
  GOT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $s)
  python3 -c "
import sys
d,g=$d,$GOT
if abs(g-d)>0.06:
    sys.exit('SHOT $n SHORT: wanted %.2f got %.2f' % (d,g))"
  echo "file '$s'" >> list.txt
done < plan.txt
NGOT=$(wc -l < list.txt)
echo "segments $NGOT of $NEXP"
[ "$NGOT" = "$NEXP" ] || { echo "SEGMENT COUNT MISMATCH"; exit 1; }

echo "== concat"
ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy silent.mp4 </dev/null
TOT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 silent.mp4)
PLAN=$(awk '{s+=$2} END{printf "%.2f", s}' plan.txt)
echo "video duration $TOT  (plan $PLAN)"

echo "== ambience beds"
at () { python3 -c "
rows=[l.split() for l in open('plan.txt')]
t=0.0
for r in rows:
    if int(r[0])==$1: print('%.2f'%t); break
    t+=float(r[1])"; }
MEET=$(at 54)   # room tone stops here, absolute silence to the end
EZ=$(at 8)      # wind under the earth zoom
BT=$(at 41)     # the shatter, inside the orbit
echo "meeting $MEET  earthzoom $EZ  shatter $BT"
sox -n room.wav synth $MEET brownnoise vol 0.012 lowpass 260 fade t 3 $MEET 3
sox -n wind.wav synth 8 pinknoise vol 0.05 lowpass 1400 fade t 1.5 8 3
sox -n shat.wav synth 0.6 whitenoise vol 0.45 highpass 2200 fade h 0 0.6 0.55

echo "== audio mix"
FC=""; IN=""; LBL=""; i=0
while read v ms; do
  IN="$IN -i hv$v.wav"; FC="$FC[$i]adelay=$ms|$ms[x$i];"; LBL="$LBL[x$i]"; i=$((i+1))
done < marks.txt
IN="$IN -i room.wav -i wind.wav -i shat.wav"
R=$i; W2=$((i+1)); SH=$((i+2))
FC="$FC[$R]volume=1.0[bed];"
FC="$FC[$W2]adelay=$(python3 -c "print(int($EZ*1000))")|$(python3 -c "print(int($EZ*1000))")[wnd];"
FC="$FC[$SH]adelay=$(python3 -c "print(int($BT*1000))")|$(python3 -c "print(int($BT*1000))")[sht];"
FC="$FC$LBL[bed][wnd][sht]amix=inputs=$((i+3)):normalize=0:duration=longest,apad,atrim=0:$TOT,alimiter=limit=0.95[out]"
ffmpeg -nostdin -y -loglevel error $IN -filter_complex "$FC" -map "[out]" -c:a aac -b:a 160k track.m4a </dev/null

echo "== burn english subtitles"
ffmpeg -nostdin -y -loglevel error -i silent.mp4 \
  -vf "subtitles=subs.srt:force_style='FontName=DejaVu Sans,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=48'" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 subbed.mp4 </dev/null

echo "== mux"
ffmpeg -nostdin -y -loglevel error -i subbed.mp4 -i track.m4a -c:v copy -c:a copy -shortest hashilush-v7-final.mp4 </dev/null
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=nw=1 hashilush-v7-final.mp4

echo "== upload"
[ -n "$UP" ] && curl -f -s -X PUT -H "Content-Type: video/mp4" --upload-file hashilush-v7-final.mp4 "$UP" && echo UPLOAD_OK
