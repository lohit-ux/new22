// lib/motion.js — pure functions of time. Nothing here keeps state between frames,
// so window.seek(t) can paint frame 812 without simulating frames 0-811.

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const mix = lerp;

// Closed-form damped spring, 0 -> 1. k = stiffness, d = damping.
export function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0);
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t); // z >= 1 treated as critical
}

// Spring presets (see CLAUDE.md "Motion")
export const SNAPPY  = [320, 30]; // buttons, toggles, leading edges
export const DEFAULT = [170, 26]; // cards, containers, camera
export const HEAVY   = [90, 20];  // big type, logo lockups (no visible overshoot)
export const PLAYFUL = [260, 14]; // mascots, stickers (visible overshoot)
export const sp = (t, preset = DEFAULT) => spring(t, preset[0], preset[1]);

// A value that changes target several times: sum one spring per change.
// keys: [[time, value], ...] sorted by time.
export function track(t, keys, k = 170, d = 26) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++)
    v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], k, d);
  return v;
}

// Tab indicator that stretches: leading edge stiffer than trailing edge.
export function indicator(t, stops, width = 120) {
  const lead = track(t, stops, 320, 30);
  const trail = track(t, stops, 140, 22);
  return { left: Math.min(lead, trail), right: Math.max(lead, trail) + width };
}

// Text inside a morphing box: in after the morph starts, out before the next one.
export function swapAlpha(t, tIn, tOut) {
  return Math.min(clamp((t - tIn - 0.08) / 0.12), clamp((tOut - 0.1 - t) / 0.1));
}

// Window helper: 0 before a, ramps to 1 by a+inDur, holds, ramps to 0 ending at b.
export function win(t, a, b, inDur = 0.15, outDur = 0.15) {
  return Math.min(clamp((t - a) / inDur), clamp((b - t) / outDur));
}

// Seamless loop: pin the last frame to the first.
export const loopT = (t, dur) => ((t % dur) + dur) % dur;

// Seeded noise (mulberry32). Never use Math.random in a film.
export function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Beat grid helpers. BPM 120 => 0.5s per beat.
export const beatGrid = (bpm) => {
  const b = 60 / bpm;
  return { beat: (n) => n * b, bar: (n) => n * 4 * b, spb: b };
};

// Count-up number that settles with a spring.
export const countUp = (t, to, preset = HEAVY, from = 0) => lerp(from, to, sp(t, preset));
