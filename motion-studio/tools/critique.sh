#!/usr/bin/env bash
# tools/critique.sh — the images Claude must LOOK at before showing anyone a render.
#   bash tools/critique.sh [video] [fast-action-second]
set -euo pipefail
V="${1:-out/final_9x16.mp4}"; T="${2:-4}"
mkdir -p out/critique
ffmpeg -y -loglevel error -i "$V" -vf "fps=2,scale=270:-1,tile=6x5:padding=4" -frames:v 1 out/critique/contact.png      # 2 frames/sec
ffmpeg -y -loglevel error -ss "$(echo "$T - 0.1" | bc)" -i "$V" -vf "scale=320:-1,tile=12x1" -frames:v 1 out/critique/strip.png   # pops/overlaps
ffmpeg -y -loglevel error -i "$V" -vf "fps=1,scale=360:-1,tile=6x2:padding=4" -frames:v 1 out/critique/phone.png        # phone-size read
ffmpeg -y -loglevel error -sseof -0.05 -i "$V" -frames:v 1 -update 1 out/critique/last.png                               # end card / loop seam
ffmpeg -y -loglevel error -ss 0.6 -i "$V" -frames:v 1 out/critique/poster.png                                             # poster frame
ffmpeg -y -loglevel error -i "$V" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "I:|LRA:" | head -2 > out/critique/loudness.txt || true
echo "critique images in out/critique/  (contact, strip, phone, last, poster) + loudness.txt"
cat out/critique/loudness.txt
