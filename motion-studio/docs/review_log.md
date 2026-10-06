# Review log

## BluePixel demo film (index.html) — 12s, 9:16

### Round 1 (stills every 0.5s)
Scores: hook 6 · readability 5 · motion 7 · variety 7 · composition 5 · brand 8 · sound n/a
1. 0.0–1.5s and 9.5s: headline and "THEN FILL IT." run off the right edge → added `fit()` to size type to the frame.
2. 10.5s: "BUY IT." still visible behind the flying logo pixels → `1 - spring()` overshot past 1, giving a negative alpha
   that canvas ignores. Clamped it (now a house rule).
3. 2.5–3.5s: kinetic words invisible exactly on the beat (window started on the beat) → they now land 50 ms early.
Also: chips too small at phone size (38→50px), navy section bottom-heavy (ring 300→360u, recentred), CTA pill enlarged.

### Round 2 (full render + strip at 2s)
Scores: hook 8 · readability 8 · motion 8 · variety 8 · composition 8 · brand 8 · sound 8
1. 1.8–2.1s: headline "IS SCATTERED." overlapped the first box word "SCATTERED." (repeat + overlap) → headline now
   exits before 1.95s and the box words became STALE. / SILOED. / SLOW.
2. Loudness measured -14.9 LUFS (one-pass loudnorm undershoots on short clips) → mix.sh now measures and applies exact gain.
Next ideas: real product screenshots for the Connect/Enrich beats, official SVG logo, a cursor-driven UI morph beat.
