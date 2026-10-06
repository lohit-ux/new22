Open out/contact.png (and out/critique/strip.png + out/critique/phone.png if they exist) and look at them properly.
Be a harsh motion director, not a proud author.

Score 1-10:
- hook in first 2s
- readability at phone size (360px wide)
- motion quality (springs, no dead frames, nothing sliding linearly)
- variety (something new every 2-4s)
- composition (no big empty zones, nothing clipped at the edges)
- brand accuracy (docs/brand-*.md: colours, type, wording, URL)
- sound sync (hits on cues.json / beats.json)

List the 3 biggest problems with timestamps. Hunt specifically for:
text overlapping during swaps · text running off the edge · anything sliding instead of easing ·
corner labels and frame borders · centred-on-gradient shots · blurry scaled text · a dead beat with
nothing happening · alpha flicker from a spring overshooting · a stutter at the loop seam ·
banned words or wrong URL.

Fix them, re-render only the affected seconds (or re-run --stills), show me the new contact sheet and
new scores. Append scores + fixes to docs/review_log.md. Repeat until every score is 8+.
