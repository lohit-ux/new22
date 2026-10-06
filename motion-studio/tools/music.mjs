// tools/music.mjs — a small original score synthesized in code, locked to the beat grid.
//   node tools/music.mjs --bpm 120 --dur 12 --drop 4 --out audio/music.wav
// Structure: sparse/tense until --drop (seconds), bright groove after, final hit + ring-out
// on the last bar. Use a supplied track instead whenever the brief has one (then run beats.py).
import { writeWav } from './wav.mjs';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const BPM = Number(arg('bpm', 120)), DUR = Number(arg('dur', 12)), DROP = Number(arg('drop', 4));
const END = Number(arg('end', DUR - 2)), OUT = arg('out', 'audio/music.wav');
const SR = 48000, spb = 60 / BPM, TAU = 2 * Math.PI;
const buf = new Float32Array(Math.ceil((DUR + 1.5) * SR));
let seed = 7; const noise = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2147483648 - 1;
const add = (t0, len, fn, g = 1) => { const s = Math.floor(t0 * SR); for (let i = 0; i < len * SR; i++) if (s + i < buf.length && s + i >= 0) buf[s + i] += fn(i / SR) * g; };
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

const kick = (t) => Math.sin(TAU * (50 + 110 * Math.exp(-t * 30)) * t) * Math.exp(-t * 7);
const hat = (t) => noise() * Math.exp(-t * 60) * 0.25;
const clap = (t) => noise() * (Math.exp(-t * 25) + 0.4 * Math.exp(-Math.max(0, t - 0.012) * 25)) * 0.35;
const pluck = (f) => (t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) + 0.12 * Math.sin(TAU * 3 * f * t)) * Math.exp(-t * 7) * 0.22;
const bass = (f, len) => (t) => Math.tanh(1.6 * Math.sin(TAU * f * t)) * Math.min(1, t * 80) * Math.min(1, (len - t) * 30) * 0.32;
const pulse = (f) => (t) => Math.sin(TAU * f * t) * Math.exp(-t * 14) * 0.25;

// I – V – vi – IV in D major (bright), one chord per bar
const PROG = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]];
const ROOT = [38, 33, 35, 31];
const beats = Math.floor(END / spb);
for (let b = 0; b < beats; b++) {
  const t = b * spb, bar = Math.floor(b / 4), chord = PROG[bar % 4], inBar = b % 4;
  if (t < DROP) {
    // tension: muted low pulse on every beat, kick on 1, ticking hats on 8ths in the 2nd bar
    add(t, 0.3, pulse(hz(38)), 0.9);
    if (inBar === 0) add(t, 0.5, kick, 0.7);
    if (t >= DROP - 2 * 4 * spb / 2) { add(t + spb / 2, 0.08, hat, 0.6); }
  } else {
    add(t, 0.5, kick, 0.95);
    if (inBar === 1 || inBar === 3) add(t, 0.25, clap, 0.8);
    add(t + spb / 2, 0.08, hat, 0.8); add(t, 0.06, hat, 0.35);
    add(t, spb * 0.9, bass(hz(ROOT[bar % 4]), spb * 0.9), 1);
    // arpeggio on 8ths
    for (let k = 0; k < 2; k++) add(t + k * spb / 2, 0.6, pluck(hz(chord[(inBar * 2 + k) % 3] + 12)), 0.9);
  }
}
// riser into the drop, and a final hit with a ringing chord at END
add(DROP - 1, 1, (t) => noise() * t * t * 0.12, 1);
add(END, 0.6, kick, 1.1);
for (const m of [50, 62, 66, 69, 74]) add(END, 1.8, (t) => Math.sin(TAU * hz(m) * t) * Math.exp(-t * 1.8) * 0.12, 1);

// gentle master: soft clip + fade out
const fadeStart = (DUR - 0.4) * SR;
for (let i = 0; i < buf.length; i++) { let v = Math.tanh(buf[i] * 0.9); if (i > fadeStart) v *= Math.max(0, 1 - (i - fadeStart) / (0.4 * SR)); buf[i] = v; }
writeWav(OUT, buf.subarray(0, Math.ceil(DUR * SR)), SR);
console.log(`wrote ${OUT} (${BPM} BPM, ${DUR}s, drop at ${DROP}s)`);
