#!/bin/bash
# Salin sumber intro/outro YouTube Tanya Kai ke proyek Remotion plugin (studio/proj), daftarkan komposisinya,
# lalu buat audio campuran (musik + SFX studio_audio.py + VO) dengan norm_mix.py.
# Jalankan dari folder ini: bash pasang-ke-studio.sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../../.." && pwd)"; PROJ="$ROOT/studio/proj"
SA="$ROOT/.claude/skills/video-motion/scripts/studio_audio.py"
[ -d "$PROJ" ] || { echo "studio/proj belum ada: salin paket plugin studio-video-deny ke $ROOT/studio lalu npm install"; exit 1; }
cd "$HERE" && python3 make_cues_kai.py
mkdir -p "$PROJ/src/tanyakai" && cp kaiSvg.ts scenesKai.ts KaiYT.tsx cues_kai.json "$PROJ/src/tanyakai/" && cp stills-kai.mjs render-kai.mjs "$PROJ/"
# daftarkan komposisi (sekali saja)
if ! grep -q KaiComboYT "$PROJ/src/Root.tsx"; then
  python3 - "$PROJ/src/Root.tsx" <<'PY'
import sys; p = sys.argv[1]; s = open(p).read()
import json, os
s = s.replace("import {KaiIntroYT, KaiOutroYT} from './tanyakai/KaiYT';\n", "").replace('    <Composition id="KaiIntroYT"', '    <Composition id="__x"', 0)
s = '\n'.join(l for l in s.split('\n') if 'KaiIntroYT' not in l and 'KaiOutroYT' not in l and 'KaiComboYT' not in l)
dur = round(json.load(open(os.path.join(os.path.dirname(p), 'tanyakai', 'cues_kai.json')))['combo']['dur'] * 30)
s = s.replace("import {CarRekening} from './CarRekening';", "import {CarRekening} from './CarRekening';\nimport {KaiIntroYT, KaiOutroYT, KaiComboYT} from './tanyakai/KaiYT';")
s = s.replace("  </>\n);", "    <Composition id=\"KaiIntroYT\" component={KaiIntroYT} durationInFrames={150} fps={30} width={1920} height={1080} />\n    <Composition id=\"KaiOutroYT\" component={KaiOutroYT} durationInFrames={600} fps={30} width={1920} height={1080} />\n    <Composition id=\"KaiComboYT\" component={KaiComboYT} durationInFrames={%d} fps={30} width={1920} height={1080} />\n  </>\n);" % dur)
open(p, 'w').write(s)
PY
fi
# audio: musik+SFX → campur VO (VO di detik cues) → norm_mix -14.5 LUFS
TMP="$(mktemp -d)"
for k in intro outro combo; do
  python3 "$SA" "events_$k.json" "$TMP/bed_$k.wav"
  if [ "$k" = combo ]; then
    A=$(python3 -c "import json;print(int(json.load(open('cues_kai.json'))['combo']['voI']*1000))"); B=$(python3 -c "import json;print(int(json.load(open('cues_kai.json'))['combo']['voO']*1000))")
    ffmpeg -v error -y -i "../vo/intro-kai.mp3" -i "../vo/outro-kai.mp3" -filter_complex "[0:a]aresample=44100,aformat=channel_layouts=stereo,adelay=$A|$A[a];[1:a]aresample=44100,aformat=channel_layouts=stereo,adelay=$B|$B[b];[a][b]amix=inputs=2:duration=longest:normalize=0" "$TMP/vo_combo.wav"
    VOF="$TMP/vo_combo.wav"; OFF=0
  else VOF="../vo/$k-kai.mp3"; OFF=$(python3 -c "import json;print(int(json.load(open('cues_kai.json'))['$k']['vo']*1000))"); fi
  [ "$OFF" = 0 ] && OFF=1
  ffmpeg -v error -y -i "$TMP/bed_$k.wav" -i "$VOF" -filter_complex "[1:a]aresample=44100,aformat=channel_layouts=stereo,adelay=$OFF|$OFF,volume=2.2,asplit=2[v1][v2];[0:a][v1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=250[duck];[duck][v2]amix=inputs=2:duration=first:normalize=0[m]" -map "[m]" "$TMP/raw_$k.wav"
  (cd "$PROJ" && python3 norm_mix.py "$TMP/raw_$k.wav" "public/mix_kai_$k.wav" -14.5)
done
rm -rf "$TMP"; echo "siap: dari studio/proj jalankan  node render-kai.mjs   (cek cepat: node stills-kai.mjs KaiIntroYT 1,3 /tmp/x)"
