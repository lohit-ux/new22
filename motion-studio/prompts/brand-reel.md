Make a dynamic [DURATION]-second motion graphics video for [PRODUCT] ([URL]), with the energy
of a motion designer's showreel. Go all out. Follow CLAUDE.md and docs/brand-[brand].md.

Assets
- Visit the site. Use real screenshots (Playwright), the real logo, real colours and fonts.
  Save everything to ./assets and list what you found before you animate.
- Never redraw the product UI from imagination. Crop and animate the real thing.

Story (one beat each, 2 to 4 seconds)
1. Hook: the problem in 5 words of huge kinetic type.
2. The product appears, the UI assembles itself piece by piece.
3. Three features, each as a UI moment with a cursor doing a real action.
4. One proof point: [METRIC from the locked fact sheet — or skip].
5. Logo lockup + [CTA].

Sound
- Original music, 120 BPM, synthesized in code (tools/music.mjs) — or measure ./audio/track.wav with tools/beats.py.
- UI clicks and whooshes on the beat (cues.json → tools/sfx.mjs).

Format: 1080x1920 (9:16) first, then 1:1 and 16:9 from the same timeline.
Before the full render, show me a contact sheet of one frame per beat (node render.mjs --stills 0.5).
