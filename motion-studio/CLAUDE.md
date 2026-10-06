# Motion studio — house rules

Claude Code reads this on every run. These rules apply to every video made in this folder.
Run Claude Code on Opus 5.5: **medium** for small fixes/re-renders, **xhigh** for new films,
**max** when the first 3 seconds have to carry a launch.

## Render contract
- Every film is a pure function of time: `window.seek(t)` paints frame t. Define `window.FILM = { dur, bpm }`.
- No CSS transitions, no setTimeout, no requestAnimationFrame in render mode, no state carried
  between frames. Seeded noise only (`rng()` in lib/motion.js), never `Math.random`.
- One HTML file per film (`index.html` or `films/<name>.html`), one `<canvas>`, imports from `lib/motion.js`.
- Lay everything out in units of `u = min(W,H)/1080` so 9x16, 1x1 and 16x9 come from one timeline.
  Reframe per format; never crop a 16:9 render to vertical.
- Load fonts before the first frame (`window.ready`). Use local font files in `assets/fonts/`.
- Render: `node render.mjs` (60 fps, 4 subframes motion blur, H.264 yuv420p, CRF 16).
  Drafts: `node render.mjs --draft`. Partial re-render: `--from 4 --to 6`.

## Motion
- Closed-form springs only (`spring`, `track`, presets in lib/motion.js). No linear or CSS easing.
  - SNAPPY: buttons, toggles, leading edges · DEFAULT: cards, containers, camera
  - HEAVY: big type, logo lockups (no overshoot) · PLAYFUL: stickers, mascots (visible overshoot)
- A value with more than one target uses `track()` — never restart a spring.
- Text inside a morphing container enters after the morph starts and leaves before the next (`swapAlpha`).
- Clamp any `1 - spring()` used as alpha (springs overshoot past 1).
- Every 2 to 4 seconds something new must happen on screen. Hook lands in the first 2 seconds.

## Look
- **Banned defaults:** centered title on gradient, everything fading in, corner labels and frame
  borders, glow on UI chrome, generic particle bursts, bouncy easing on type, dead beats.
- One display face, one UI face. One accent colour unless the brief says otherwise.
- Real product UI only (Playwright screenshots in `assets/`). Never invent product screens.
- Keep captions inside the centre 80% on 9:16 (Instagram/TikTok UI covers the edges and bottom).

## Sound
- Score and SFX are synthesized in code (`tools/music.mjs`, `tools/sfx.mjs` + `cues.json`) unless a track is supplied.
- If a track is supplied: `python tools/beats.py audio/track.wav > beats.json` and place
  state changes on `beats`, big moments on `downbeats`, SFX on `hits`.
- Mix with `bash tools/mix.sh` → -14 LUFS, true peak ≤ -1 dB.

## Loop before you show me anything
1. `node render.mjs --stills 0.5` → open `out/contact.png` and LOOK at it.
2. Score 1-10: hook in first 2s · readability at phone size · motion quality · variety ·
   composition · brand accuracy · sound sync. Use `prompts/critique-pass.md`.
3. Fix the 3 worst problems (cite timestamps). Repeat until every score is 8+. Minimum 2 rounds.
4. Only then the full render → `bash tools/mix.sh` → `bash tools/critique.sh` → look at
   `out/critique/strip.png` around the fastest action and `phone.png`.
5. Log scores and fixes in `docs/review_log.md`.

## Brand: BluePixel (default for this studio)
Full sheet in `docs/brand-bluepixel.md`. Short version:
- Canvas warm off-white `#FAF7F2` with a faint blue pixel-dot grid. Navy `#1A1A2E`
  (`#0F1629`→`#121E2B`) only for transitions, taglines and AI beats.
- Primary electric blue `#0EA5E9`. Signature gradient `#0EA5E9`→`#5DAE50` (135°) on rings, bars, kinetic type.
- Amber `#F59E0B`→`#B86E00` for the single CTA only.
- Display: Barlow Semi Condensed 700/800, tight tracking. UI/body: Inter.
- Name is **BluePixel** in copy, **BLUE PIXEL** in the wordmark, URL **bluepxl.com** (never bluepixel.com).
- Voice: warm, founder-like, restrained. Never write "revolutionary", "game-changing", "seamless", "unlock".
- Numbers on screen only if they're in the locked brand fact sheet; otherwise use none or label illustrative.
  No real names, addresses or dollar figures from client data.
