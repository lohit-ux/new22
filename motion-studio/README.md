# Motion studio (Opus 5.5)

A repeatable pipeline for code-rendered motion videos, built from the "motion design studio with Opus 5.5" playbook:
**reference → spec → seek(t) engine → springs → beat-locked sound → critique loop → every format → skill.**
Pre-configured for **BluePixel**.

## Install (once)
```bash
cd motion-studio
bash setup.sh                     # node, ffmpeg, python audio libs, Playwright Chromium
claude --model claude-opus-5-5    # /model → set effort to xhigh for new films
```

## Make a video
In Claude Code, from this folder:
```
/motion-reel for https://bluepxl.com, 20s, vertical, reference ./refs/frame.png
```
Or paste one of the prompts in `prompts/` (brand reel · reference · UI-morph spec · overnight director's brief).

## Commands
| | |
|---|---|
| `node render.mjs --stills 0.5` | contact sheet (`out/contact.png`), seconds, for critique |
| `node render.mjs --draft` | fast animatic, 30 fps, half size |
| `node render.mjs --format 9x16` | final picture, 60 fps + motion blur (also `1x1`, `16x9`, `4x5`) |
| `node render.mjs --from 4 --to 6` | re-render just seconds 4–6 |
| `npm run audio` | synth score (`tools/music.mjs`) + SFX from `cues.json` (`tools/sfx.mjs`) |
| `python tools/beats.py audio/track.wav > beats.json` | measure a supplied track |
| `bash tools/mix.sh 9x16` | picture + music + SFX at -14 LUFS → `out/final_9x16.mp4` |
| `bash tools/critique.sh out/final_9x16.mp4 4` | contact / strip / phone / poster / loudness |
| open `index.html` via `npm run preview` | live preview (space = pause, ←/→ scrub) |

## What's where
- `CLAUDE.md`: house rules Claude reads every run (render contract, banned looks, sound, critique loop, brand)
- `lib/motion.js`: closed-form springs, `track()`, `indicator()`, `swapAlpha()`, seeded `rng()`, `loopT()`
- `index.html`: BluePixel demo film, the template for new films
- `render.mjs`: headless Chromium → ffmpeg renderer (built-in static server, stills mode, partial renders)
- `tools/`: music, SFX, beats, mix, critique
- `prompts/`: the four prompt patterns
- `docs/brand-bluepixel.md` · `docs/review_log.md`
- `.claude/skills/motion-reel/`: the project skill

## Optional framework routes
```bash
npx skills add remotion-dev/skills     # React/Remotion: series, templates, data-driven videos
npx skills add heygen-com/hyperframes  # HTML + GSAP
claude plugin marketplace add buildwithhanif/claude-animation-skill   # hand-drawn canvas look
```
Opus defaults to the plain seek(t) route, so name a framework explicitly if you want one.

## To do for BluePixel
- Drop the official SVG logo into `assets/logo.svg` (the demo draws an approximation).
- Add real product screenshots to `assets/`.
- Lock the brand fact sheet before putting any stats on screen.
