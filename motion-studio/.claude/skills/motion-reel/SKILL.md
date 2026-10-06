---
name: motion-reel
description: Make a product or showreel motion video rendered from code (seek(t) + Playwright + ffmpeg) with springs, a beat grid, synthesized sound and a self-critique loop. Use when the user asks for a launch video, showreel, product reel, animated explainer, motion ad or Instagram/YouTube reel.
---

# Motion reel

Works inside the motion-studio kit (this folder: render.mjs, lib/motion.js, tools/, prompts/, CLAUDE.md).
Read CLAUDE.md first — it holds the render contract, banned looks and the brand.

## Inputs to collect first
Product + URL, duration, formats (9:16 / 1:1 / 16:9), brand (docs/brand-*.md, or colours + fonts),
a reference (frame, video or image folder — optional), music (file or "synthesize"), CTA.

## Pipeline
1. Gather assets from the URL with Playwright into ./assets. List them. Never invent product UI.
2. If a reference exists, follow prompts/reference.md → docs/style_guide.md.
3. Music: supplied track → `python tools/beats.py audio/track.wav > beats.json`;
   none → `node tools/music.mjs --bpm 120 --dur <D> --drop <s> --out audio/music.wav`.
4. Write docs/shotlist.md on the beat grid (time · visual · text · motion · SFX). Show it and wait for OK.
5. Build the film (index.html or films/<name>.html) with window.seek(t) + window.FILM, springs from lib/motion.js,
   layout in `u` units so every format works. Copy index.html as the starting template.
6. `node render.mjs --stills 0.5` → look at out/contact.png → prompts/critique-pass.md → fix. 2+ rounds, all scores 8+.
7. Write cues.json → `node tools/sfx.mjs cues.json audio/sfx.wav <D>`.
8. `node render.mjs --format 9x16` → `bash tools/mix.sh 9x16` → `bash tools/critique.sh out/final_9x16.mp4 <fast-second>`
   → look at strip.png + phone.png, fix anything found. Then other formats if asked.
9. Deliver out/final_*.mp4, out/critique/poster.png, out/contact.png. Say what you'd improve next.

## Hard rules
- Real product UI only. No Math.random, no timers, no CSS transitions in render mode.
- Banned: corner labels, frame borders, centred title on gradient, everything fading in, particle bursts.
- Brand words, URL and numbers come from docs/brand-*.md only.
- Effort: xhigh for new films, max for launch pieces, medium for fixes.
