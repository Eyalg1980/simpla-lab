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
  s=$(printf "g%03d.mp4" $n)
  # cache key is the URL, never the shot number: shot numbers move when a shot
  # is inserted and a number-keyed cache then serves the wrong clip.
  c="src_$(printf '%s' "$url" | md5sum | cut -c1-16).mp4"
  case "$k" in
    clip)
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null ;;
    punch)
      # a moving clip used as a fast flash: punched in so it still reads at 0.4s
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=iw*0.86:ih*0.86,scale=1920:1080,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null ;;
    slow)
      # source is shorter than the slot: stretch it instead of cutting the slot
      [ -f "$c" ] || curl -sf -o "$c" "$url"
      SRC=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c")
      F=$(python3 -c "print('%.4f' % (($d + 0.2) / ($SRC - $ss)))")
      ffmpeg -nostdin -y -loglevel error -ss $ss -i "$c" \
        -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=PTS*$F,fps=25,setsar=1" \
        -an -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 -g 50 $s </dev/null
      echo "  shot $n stretched x$F from ${SRC}s" ;;
    flash|card)
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%03d.png" $n) -t $d \
        -c:v libx264 -preset veryfast -tune stillimage -crf 20 -pix_fmt yuv420p -r 25 -g 50 \
        -vf "scale=1920:1080,setsar=1" $s </dev/null ;;
    dolly)
      FR=$(python3 -c "print(int(round($d*25)))")
      ffmpeg -nostdin -y -loglevel error -loop 1 -framerate 25 -i $(printf "o%03d.png" $n) -t $d \
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

echo "== sound design"
at () { python3 -c "
rows=[l.split() for l in open('plan.txt')]
t=0.0
for r in rows:
    if int(r[0])==$1: print('%.2f'%t); break
    t+=float(r[1])"; }
MEET=$(at 54)   # the room tone stops here and the film goes to absolute silence
echo "silence begins at $MEET"

# the bed: a very quiet room floor under everything up to the meeting. having a
# floor everywhere is what makes the digital silence of the ending land.
sox -n room.wav synth $MEET brownnoise vol 0.012 lowpass 260 fade t 3 $MEET 3
# an open flame: filtered noise with a tremolo doing the flicker
# two tremolos in series give the irregular flicker of a real flame.
# levels were MEASURED against the -46 dB room floor and the -21 dB voice, not guessed:
# an earlier pass had the fire at -48 dB, quieter than the floor, so it was inaudible.
sox -n fire.wav synth 9 pinknoise vol 0.22 highpass 200 lowpass 3200 tremolo 9 45 tremolo 23 30 fade t 0.5 9 1.2
# the chapter title hit: a falling sub, no pitch you could hum
sox -n sting.wav synth 1.8 sine 58:34 vol 0.14 fade t 0.02 1.8 1.5
# torn paper and tape, one per collage cut
sox -n rip.wav synth 0.13 whitenoise vol 0.26 highpass 1400 lowpass 7000 fade h 0 0.13 0.11
# a slow low pulse under the persecutor, meant to be felt rather than heard
sox -n pulse.wav synth 13 sine 46 vol 0.09 tremolo 50 92 fade t 1.5 13 2.5
# the rise into the throw
sox -n riser.wav synth 4.2 sine 62:210 vol 0.09 fade t 3 4.2 0.3
# wind under the dive
sox -n wind.wav synth 8 pinknoise vol 0.05 lowpass 1400 fade t 1.5 8 3
# the glass on the wall
sox -n shat.wav synth 0.6 whitenoise vol 0.45 highpass 2200 fade h 0 0.6 0.55

for f in room fire sting rip pulse riser wind shat; do
  echo -n "  bed $f "
  ffmpeg -nostdin -i $f.wav -af volumedetect -f null /dev/null 2>&1 | grep mean_volume | sed 's/.*mean_volume: //'
done
# the fire must sit ABOVE the room floor or it is not there at all
python3 -c "
import subprocess, sys, re
def lvl(f):
    o=subprocess.run(['ffmpeg','-nostdin','-i',f,'-af','volumedetect','-f','null','/dev/null'],
                     capture_output=True,text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)',o).group(1))
r,fi=lvl('room.wav'),lvl('fire.wav')
if fi <= r + 5: sys.exit('THE FIRE IS INAUDIBLE: room %.1f dB, fire %.1f dB' % (r,fi))
print('  fire sits %.1f dB above the room floor' % (fi-r))"

echo "== audio mix"
FC=""; IN=""; LBL=""; i=0
while read v ms; do
  IN="$IN -i hv$v.wav"; FC="$FC[$i]adelay=$ms|$ms[x$i];"; LBL="$LBL[x$i]"; i=$((i+1))
done < marks.txt
IN="$IN -i room.wav"; FC="$FC[$i]volume=1.0[bed];"; LBL="$LBL[bed]"; i=$((i+1))
# every remaining cue comes from sfx.txt, which build7.py derived from the shot
# table. no cue time is typed by hand anywhere.
while read name at; do
  MS=$(python3 -c "print(int($at*1000))")
  IN="$IN -i $name.wav"; FC="$FC[$i]adelay=$MS|$MS[s$i];"; LBL="$LBL[s$i]"; i=$((i+1))
done < sfx.txt
FC="$FC$LBL""amix=inputs=$i:normalize=0:duration=longest,apad,atrim=0:$TOT,alimiter=limit=0.95[out]"
ffmpeg -nostdin -y -loglevel error $IN -filter_complex "$FC" -map "[out]" -c:a aac -b:a 160k track.m4a </dev/null
echo "mixed $i sources"

# the ending must still be digital silence. measure it, do not assume it.
SIL=$(python3 -c "print('%.2f' % ($MEET + 4))")
LVL=$(ffmpeg -nostdin -ss $SIL -i track.m4a -af volumedetect -f null /dev/null 2>&1 | grep mean_volume | sed 's/.*mean_volume: //;s/ dB//')
echo "ending level from ${SIL}s: $LVL dB"
python3 -c "
import sys
v=float('$LVL')
if v > -85: sys.exit('THE SILENT ENDING WAS BROKEN: %.1f dB' % v)"

echo "== burn english subtitles"
ffmpeg -nostdin -y -loglevel error -i silent.mp4 \
  -vf "subtitles=subs.srt:force_style='FontName=DejaVu Sans,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=48'" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -r 25 subbed.mp4 </dev/null

echo "== mux"
ffmpeg -nostdin -y -loglevel error -i subbed.mp4 -i track.m4a -c:v copy -c:a copy -shortest hashilush-v7-final.mp4 </dev/null
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=nw=1 hashilush-v7-final.mp4

echo "== upload"
[ -n "$UP" ] && curl -f -s -X PUT -H "Content-Type: video/mp4" --upload-file hashilush-v7-final.mp4 "$UP" && echo UPLOAD_OK
