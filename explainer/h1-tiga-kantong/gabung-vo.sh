#!/usr/bin/env bash
# Gabung VO ElevenLabs (vo/vo1..vo6.mp3) ke versi untuk-vo, tiap kalimat di awal adegannya.
# Kalimat yang lebih panjang dari 3,3 dtk dipercepat (atempo) tanpa ubah nada.
set -euo pipefail
cd "$(dirname "$0")"
START=(0.2 3.6 7.1 10.6 14.1 17.6); MAX=3.3
IN=(-i h1-tiga-kantong-untuk-vo.mp4); FC=""; MIX="[0:a]"
for i in 1 2 3 4 5 6; do
  f=vo/vo$i.mp3; [ -f "$f" ] || { echo "lewati $f (belum ada)"; continue; }
  IN+=(-i "$f"); n=$(( ${#IN[@]} / 2 - 1 ))
  d=$(ffmpeg -nostats -i "$f" -af "silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse" -f null - 2>&1 | grep -o "time=[0-9:.]*" | tail -1 | cut -d= -f2 | awk -F: '{print $1*3600+$2*60+$3}')
  tempo=$(awk -v d="$d" -v m=$MAX 'BEGIN{t=d/m; if(t<1)t=1; printf "%.3f", t}')
  ms=$(awk -v s="${START[$((i-1))]}" 'BEGIN{printf "%d", s*1000}')
  echo "vo$i: ${d}s → tempo $tempo, mulai ${START[$((i-1))]}s"
  FC+="[$n:a]silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,atempo=$tempo,aresample=48000,adelay=${ms}|${ms}[v$i];"
  MIX+="[v$i]"
done
cnt=$(( ${#IN[@]} / 2 ))
FC+="${MIX}amix=inputs=$cnt:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[a]"
ffmpeg -v error -y "${IN[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k h1-tiga-kantong-dengan-vo.mp4
echo "selesai: h1-tiga-kantong-dengan-vo.mp4"
