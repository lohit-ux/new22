#!/usr/bin/env bash
# setup.sh — install the motion studio (macOS or Linux). Run once from this folder.
set -euo pipefail
if [[ "$OSTYPE" == darwin* ]]; then
  command -v brew >/dev/null || { echo "Install Homebrew first: https://brew.sh"; exit 1; }
  brew list node >/dev/null 2>&1 || brew install node
  brew list ffmpeg >/dev/null 2>&1 || brew install ffmpeg
  brew list python >/dev/null 2>&1 || brew install python
else
  sudo apt-get update -y && sudo apt-get install -y ffmpeg python3-pip nodejs npm
fi
npm install
npx playwright install chromium
python3 -m pip install --user numpy librosa soundfile 2>/dev/null || python3 -m pip install --break-system-packages numpy librosa soundfile
mkdir -p out audio refs assets films docs
[ -f .env ] || cp .env.example .env
echo
echo "Motion studio ready. Try:"
echo "  node render.mjs --stills 0.5     # contact sheet of the demo film"
echo "  npm run audio && node render.mjs --draft && bash tools/mix.sh"
echo "  claude --model claude-opus-5-5   # then: /motion-reel for <url>, 20s, vertical"
