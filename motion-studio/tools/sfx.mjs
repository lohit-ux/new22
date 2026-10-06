// tools/sfx.mjs — synthesize UI sound effects from a cue list.
//   node tools/sfx.mjs cues.json audio/sfx.wav
// cues.json: [{ "t": 0.5, "type": "click", "gain": 1 }, ...]
// types: click | tick | pop | thump | whoosh | riser | chime
import { readFileSync } from 'node:fs';
import { writeWav } from './wav.mjs';

const SR = 48000, cues = JSON.parse(readFileSync(process.argv[2] || 'cues.json', 'utf8'));
const out = process.argv[3] || 'audio/sfx.wav';
const dur = Number(process.argv[4]) || Math.max(...cues.map((c) => c.t)) + 2;
const buf = new Float32Array(Math.ceil(dur * SR));

let s = 42; const noise = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2147483648 - 1; // seeded
const TAU = 2 * Math.PI;
const VOICES = {
  click:  [0.05, (t) => Math.sin(TAU * 1800 * t) * Math.exp(-t * 90) * 0.5],
  tick:   [0.03, (t) => Math.sin(TAU * 3200 * t) * Math.exp(-t * 160) * 0.3],
  pop:    [0.15, (t) => Math.sin(TAU * (600 + 900 * t) * t) * Math.exp(-t * 30) * 0.4],
  thump:  [0.50, (t) => Math.sin(TAU * (90 - 60 * t) * t) * Math.exp(-t * 9) * 0.9],
  whoosh: [0.40, (t) => noise() * Math.sin(Math.PI * Math.min(1, t / 0.4)) * 0.22],
  riser:  [1.00, (t) => noise() * Math.pow(t, 2) * 0.18 + Math.sin(TAU * (200 + 600 * t * t) * t) * t * 0.08],
  chime:  [1.20, (t) => [1, 2.01, 3.02].reduce((a, h, i) => a + Math.sin(TAU * 880 * h * t) * Math.exp(-t * (3 + i * 2)) / (i + 1), 0) * 0.22],
};
for (const c of cues) {
  const v = VOICES[c.type]; if (!v) { console.warn('unknown sfx type', c.type); continue; }
  const [len, fn] = v, start = Math.floor(c.t * SR), gain = c.gain ?? 1;
  // whoosh/riser are centred so their peak lands on the cue
  const offset = c.type === 'whoosh' ? Math.floor(0.3 * SR) : c.type === 'riser' ? Math.floor(len * SR) : 0;
  for (let i = 0; i < len * SR; i++) { const j = start - offset + i; if (j >= 0 && j < buf.length) buf[j] += fn(i / SR) * gain; }
}
writeWav(out, buf, SR);
console.log(`wrote ${out} (${cues.length} cues, ${dur.toFixed(1)}s)`);
