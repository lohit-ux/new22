#!/usr/bin/env bash
# tools/mix.sh — mux picture + music + SFX and hit -14 LUFS (social standard), true peak <= -1 dB.
#   bash tools/mix.sh [format]     format = 9x16 (default) | 1x1 | 16x9
#   MUSIC=audio/track.wav bash tools/mix.sh    use a supplied track instead of the synth score
set -euo pipefail
FMT="${1:-9x16}"
VIDEO="out/silent_${FMT}.mp4"; MUSIC="${MUSIC:-audio/music.wav}"; SFX="${SFX:-audio/sfx.wav}"
[ -f "$VIDEO" ] || { echo "missing $VIDEO — run: node render.mjs --format $FMT"; exit 1; }
mkdir -p out/tmp
# 1) mix music + sfx
ffmpeg -y -loglevel error -i "$MUSIC" -i "$SFX" -filter_complex \
  "[0:a]volume=0.8[m];[1:a]volume=1.0[s];[m][s]amix=inputs=2:normalize=0:duration=longest" -ar 48000 out/tmp/mix.wav
# 2) measure → gain → limiter, twice (one-pass loudnorm undershoots on short clips; the limiter eats a little)
measure() { ffmpeg -i "$1" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
cp out/tmp/mix.wav out/tmp/pass0.wav
for PASS in 1 2; do
  I=$(measure out/tmp/pass$((PASS-1)).wav)
  GAIN=$(python3 -c "print(round(-14 - float('$I'), 2))")
  ffmpeg -y -loglevel error -i out/tmp/pass$((PASS-1)).wav -af "volume=${GAIN}dB,alimiter=limit=0.79:level=false" -ar 48000 out/tmp/pass$PASS.wav
done
cp out/tmp/pass2.wav out/tmp/mix_norm.wav
I=$(measure out/tmp/mix_norm.wav)
# 3) mux
ffmpeg -y -loglevel error -i "$VIDEO" -i out/tmp/mix_norm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k \
  -shortest -movflags +faststart "out/final_${FMT}.mp4"
echo "wrote out/final_${FMT}.mp4 (${I} LUFS)"
