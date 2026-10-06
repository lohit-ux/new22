// render.mjs — walks time, calls window.seek(t), pipes frames into ffmpeg.
//
//   node render.mjs                         full render, 60 fps, 4 subframes (motion blur)
//   node render.mjs --draft                 fast check: 30 fps, no blur, half size
//   node render.mjs --format 1x1            9x16 (default) | 1x1 | 16x9
//   node render.mjs --from 4 --to 6         re-render only seconds 4-6 (out/part_4-6.mp4)
//   node render.mjs --stills 0.5            one PNG every 0.5s + out/contact.png (no video)
//   node render.mjs --film films/other.html render a different film file
//
// The film page must define window.seek(t) and window.FILM = { dur, bpm }.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const argv = process.argv.slice(2);
const has = (k) => argv.includes('--' + k);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };

const DRAFT = has('draft');
const FORMAT = arg('format', '9x16');
const FPS = Number(arg('fps', DRAFT ? 30 : 60));
const SUB = Math.max(1, Number(arg('sub', DRAFT ? 1 : 4)));
const SCALE = Number(arg('scale', DRAFT ? 0.5 : 1));
const FILM = arg('film', 'index.html');
const STILLS = arg('stills', null);
const SIZES = { '9x16': [1080, 1920], '1x1': [1080, 1080], '16x9': [1920, 1080], '4x5': [1080, 1350] };
if (!SIZES[FORMAT]) throw new Error(`Unknown --format ${FORMAT}. Use ${Object.keys(SIZES).join(' | ')}`);
const [W, H] = SIZES[FORMAT].map((v) => Math.round((v * SCALE) / 2) * 2);

// --- tiny static server (ES modules don't load from file://) ---
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.css': 'text/css' };
const root = process.cwd();
const server = createServer(async (req, res) => {
  try {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    const file = join(root, p || 'index.html');
    if (!file.startsWith(root)) throw new Error('outside root');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/${FILM}?format=${FORMAT}&scale=${SCALE}&render=1`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('PAGE ERROR:', e.message); process.exitCode = 1; });
await page.goto(url);
await page.waitForFunction(() => typeof window.seek === 'function' && window.FILM);
await page.evaluate(async () => { await document.fonts.ready; if (window.ready) await window.ready; });
const film = await page.evaluate(() => window.FILM);
const DUR = Number(arg('dur', film.dur));
const FROM = Number(arg('from', 0));
const TO = Math.min(DUR, Number(arg('to', DUR)));

// Grab a frame straight from the canvas (faster than a page screenshot).
const grab = async (t) => {
  const b64 = await page.evaluate((t) => { window.seek(t); return document.querySelector('canvas').toDataURL('image/png').slice(22); }, t);
  return Buffer.from(b64, 'base64');
};

await mkdir('out', { recursive: true });

if (STILLS) {
  // --- contact-sheet mode: stills only ---
  const step = Number(STILLS);
  await rm('out/stills', { recursive: true, force: true });
  await mkdir('out/stills', { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  // Label each still with its timestamp so critique notes can cite exact seconds.
  const grabLabelled = (t) => page.evaluate((t) => {
    window.seek(t);
    const src = document.querySelector('canvas');
    const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const g = c.getContext('2d'); g.drawImage(src, 0, 0);
    const fs = Math.round(Math.min(c.width, c.height) * 0.06);
    g.font = `700 ${fs}px sans-serif`; const label = t.toFixed(2) + 's';
    g.fillStyle = 'rgba(0,0,0,0.7)'; g.fillRect(0, 0, g.measureText(label).width + fs, fs * 1.6);
    g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(label, fs / 2, fs * 0.8);
    return c.toDataURL('image/png').slice(22);
  }, t).then((b) => Buffer.from(b, 'base64'));
  let n = 0;
  for (let t = FROM; t < TO - 1e-6; t += step) {
    await writeFile(`out/stills/${String(n).padStart(3, '0')}.png`, await grabLabelled(t));
    n++;
  }
  const cols = 6, rows = Math.ceil(n / cols);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', 'out/stills/%03d.png', '-vf',
    `scale=270:-2,tile=${cols}x${rows}:padding=4:color=0x222222`, '-frames:v', '1', 'out/contact.png'], { stdio: 'inherit' });
  console.log(`wrote ${n} stills -> out/stills/, contact sheet -> out/contact.png`);
} else {
  // --- video mode ---
  const partial = FROM > 0 || TO < DUR;
  const name = arg('out', partial ? `out/part_${FROM}-${TO}.mp4` : DRAFT ? 'out/draft.mp4' : `out/silent_${FORMAT}.mp4`);
  const vf = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-',
    '-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-preset', DRAFT ? 'veryfast' : 'slow', '-crf', DRAFT ? '23' : '16',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', name], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = Math.round((TO - FROM) * FPS * SUB);
  const started = Date.now();
  for (let i = 0; i < total; i++) {
    const png = await grab(FROM + i / (FPS * SUB));
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % (FPS * SUB) === 0) process.stdout.write(`\rrendered ${(i / (FPS * SUB)).toFixed(0)}s / ${(TO - FROM).toFixed(1)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`\nwrote ${name} (${W}x${H}, ${FPS} fps, ${SUB} subframes) in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

await browser.close();
server.close();
