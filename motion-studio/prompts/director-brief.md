You are the director, animator, sound designer and render engineer for a [DURATION] film
made in code. Treat this as a multi-session production. Don't rush to a final render.
Follow CLAUDE.md and docs/brand-[brand].md.

## The film in one line
[LOGLINE. What the viewer should feel at the end.]

## References and inputs
- ./refs/ : [video / frames / image library]. Take the grammar, never the content.
- ./audio/track.wav : use it unchanged. Measure beats with tools/beats.py first. (Or: synthesize with tools/music.mjs.)
- Skills available: [/motion-reel | /remotion-best-practices | /hyperframes].
- APIs in .env: [ELEVENLABS_API_KEY, FAL_KEY]. Budget: [$X]. Be economical. Never print keys.

## Look
[3-5 lines: palette, type, texture, camera language. Banned looks.]

## Beat sheet
0:00-0:02 hook: [the single most striking image]
0:02-0:10 [act 1]
... a new visual payoff every 3-5 seconds
[END] logo + CTA (or: the last frame sets up the first frame for a loop)

## Workflow, with gates
1. Write docs/style_guide.md and docs/shotlist.md (every shot: time, camera, text, SFX).
   Show me the shot list. Continue without waiting if I don't answer in 10 minutes.
2. Build stills for every shot. Contact sheet. Critique (prompts/critique-pass.md).
3. Animatic: node render.mjs --draft with placeholder audio. Fix pacing before polish.
4. Full animation, polish pass, sound pass, final render, mix.
5. For long films: write docs/ANIMATION_GUIDE.md first, then split chapters across subagents
   (films/ch01.html ...) so every subagent codes in the same style.

## Critique loop (every shot, at least 3 rounds)
Render 3-5 stills, score 1-10 on: hook, readability at 360px wide, motion, composition,
depth, sound sync, polish. Log scores + 3 biggest problems in docs/review_log.md. Fix. Repeat
until all are 8+.

## Deliverables
out/final_9x16.mp4 (+ 1x1, 16x9 if asked) · out/critique/poster.png · out/contact.png · docs/review_log.md
