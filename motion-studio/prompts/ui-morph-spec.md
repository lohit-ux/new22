<inputs>
Ask me for: my product + URL, 8 to 12 UI states that tell its story, the real data shown in
each state, brand colours + fonts + one accent, a royalty-free track near 120 BPM (or "synthesize"), formats.
</inputs>

<direction>
Product-film UI motion. One container never cuts: every state is the same element changing
size, radius and fill while its content swaps behind a short blur. A cursor drives every change.
Warm neutral canvas, one accent. Springs with at most a tiny overshoot.
Banned: bouncy easing, glows, gradients on UI chrome, particle bursts, dead time.
</direction>

<structure>
120 BPM, 8 bars, something happens on every beat.
Example (BluePixel): logo → "Paste a listing URL" field (typed) → loader → property card fills
(CAP, NOI, DSCR from "—" to values) → deal-grade bar sweeps → ask-AI bar typing → confidence bar →
shareable-link toast → logo.
</structure>

<build>
1. One HTML file, one canvas, window.seek(t). No CSS transitions, no timers, no carried state.
2. Closed-form springs from lib/motion.js. A value with many targets = track() (sum of one spring per change).
3. Text inside a morphing container enters after the morph starts, leaves before the next one (swapAlpha).
4. Tab indicators: leading and trailing edges on different springs so they stretch (indicator()).
5. Beat grid from the track (tools/beats.py) or 120 BPM synthesized. Start on a downbeat. UI sounds on hits.
6. Render with node render.mjs (60 fps, 4 subframes, blended for motion blur).
</build>

<gotchas>
Never scale text via CSS transforms on a camera move (blurry text) — draw at final size.
The last frame must equal the first, cursor position and velocity included (loopT()).
</gotchas>

<start>
Ask for the inputs, then show me the state list on the beat grid before writing code.
</start>
