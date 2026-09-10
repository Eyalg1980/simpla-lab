#!/bin/bash
# usage: bash build8.sh "<presigned put url>"
# The wool version. Same script and same voice as the main cut, one visual
# language, and no lip sync anywhere because nobody is on screen speaking.
set -e
UP="$1"
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ
cd "$(dirname "$0")"

echo "== narration"
python3 build8.py --he
declare -A HE=()
while read k v; do HE[$k]=$v; done < he.txt
for i in 1 2 3 4 5 6 7; do
  [ -f hv$i.wav ] || {
    curl -sf -o rh$i.mp3 "$CDN/${HE[$i]}.mp3"
    ffmpeg -nostdin -v error -y -i rh$i.mp3 -af "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB:detection=peak,areverse,loudnorm=I=-18:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo" hv$i.wav </dev/null
  }
  echo -n "  vo$i "; ffprobe -v error -show_entries format=duration -of csv=p=0 hv$i.wav
done

echo "== plan and subtitles"
python3 build8.py

echo "== segments"
rm -f list.txt
NEXP=$(wc -l < plan.txt)
while read n d k url ss; do
  s=$(printf "g%03d.mp4" $n)
  c="src_$(printf '%s' "$url" | md5sum | cut -c1-16).mp4"
  case "$k" in
    clip)
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null ;;
    card)
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%03d.png" $n) -t $d \
        -c:v libx264 -preset veryfast -tune stillimage -crf 20 -pix_fmt yuv420p -r 25 -g 50 \
        -vf "scale=1920:1080,setsar=1" $s </dev/null ;;
  esac
  # a source shorter than its slot silently shifts everything after it
  GOT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $s)
  python3 -c "
import sys
d,g=$d,$GOT
if abs(g-d)>0.06: sys.exit('SHOT $n SHORT: wanted %.2f got %.2f' % (d,g))"
  echo "file '$s'" >> list.txt
done < plan.txt
NGOT=$(wc -l < list.txt)
echo "segments $NGOT of $NEXP"
[ "$NGOT" = "$NEXP" ] || { echo "SEGMENT COUNT MISMATCH"; exit 1; }

echo "== concat"
ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy silent.mp4 </dev/null
TOT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 silent.mp4)
echo "video duration $TOT"

echo "== sound"
MEET=$(cat meet.txt)
# a projector-room floor rather than the cave's: this film is photographs
sox -n room.wav synth $MEET brownnoise vol 0.011 lowpass 240 fade t 3 $MEET 3
sox -n riser.wav synth 4.2 sine 62:210 vol 0.09 fade t 3 4.2 0.3
sox -n shat.wav synth 0.6 whitenoise vol 0.45 highpass 2200 fade h 0 0.6 0.55
sox -n pulse.wav synth 9 sine 46 vol 0.09 tremolo 50 92 fade t 1.5 9 2.5

FC=""; IN=""; LBL=""; i=0
while read v ms; do
  IN="$IN -i hv$v.wav"; FC="$FC[$i]adelay=$ms|$ms[x$i];"; LBL="$LBL[x$i]"; i=$((i+1))
done < marks.txt
IN="$IN -i room.wav"; FC="$FC[$i]volume=1.0[bed];"; LBL="$LBL[bed]"; i=$((i+1))
while read name at; do
  MS=$(python3 -c "print(int($at*1000))")
  IN="$IN -i $name.wav"; FC="$FC[$i]adelay=$MS|$MS[s$i];"; LBL="$LBL[s$i]"; i=$((i+1))
done < sfx.txt
FC="$FC$LBL""amix=inputs=$i:normalize=0:duration=longest,apad,atrim=0:$TOT,alimiter=limit=0.95[out]"
ffmpeg -nostdin -y -loglevel error $IN -filter_complex "$FC" -map "[out]" -c:a aac -b:a 160k track.m4a </dev/null
echo "mixed $i sources"

SIL=$(python3 -c "print('%.2f' % ($MEET + 2))")
LVL=$(ffmpeg -nostdin -ss $SIL -i track.m4a -af volumedetect -f null /dev/null 2>&1 | grep mean_volume | sed 's/.*mean_volume: //;s/ dB//')
echo "ending level from ${SIL}s: $LVL dB"
python3 -c "
import sys
if float('$LVL') > -85: sys.exit('THE SILENT ENDING WAS BROKEN: $LVL dB')"

echo "== subtitles and mux"
ffmpeg -nostdin -y -loglevel error -i silent.mp4 \
  -vf "subtitles=subs.srt:force_style='FontName=DejaVu Sans,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=48'" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 subbed.mp4 </dev/null
ffmpeg -nostdin -y -loglevel error -i subbed.mp4 -i track.m4a -c:v copy -c:a copy -shortest wool-final.mp4 </dev/null
ffprobe -v error -show_entries format=duration,size -of default=nw=1 wool-final.mp4

echo "== upload"
[ -n "$UP" ] && curl -f -s -X PUT -H "Content-Type: video/mp4" --upload-file wool-final.mp4 "$UP" && echo UPLOAD_OK
