#!/usr/bin/env node
// Render halaman animasi (kontrak: window.DURATION + window.renderAt(t)) jadi MP4 vertikal.
//
//   node render.cjs <project-dir> [--out video.mp4] [--fps 30] [--scale 1.5]
//   node render.cjs <project-dir> --preview 1,5,9.5|auto [--sheet sheet.jpg] [--dir out/]
//   opsi 3D: --pr 1.5 (canvas WebGL setajam 1080p; default halaman 1 = 720p di-upscale, jauh lebih cepat)
//
// - Proyek disajikan lewat server http lokal (supaya ES module / Three.js bisa dimuat).
// - Halaman dibuka dengan ?render=1, viewport 720x1280 x scale (default 1.5 -> 1080x1920).
// - Audio: window.AUDIO_EVENTS + window.MUSIC -> events.json -> sound.py -> sound.wav,
//   lalu dinormalisasi ke loudness medsos (default -15 LUFS; MUSIC.lufs atau --lufs, standar studio -14).
//   MUSIC.engine = 'studio' memakai studio_audio.py (musik berstruktur + SFX berlapis).
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
if (!argv[0] || argv[0].startsWith('--')) { console.error('pakai: node render.cjs <project-dir> [opsi]'); process.exit(2); }
const dir = path.resolve(argv[0]);
const opt = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const FPS = +opt('fps', 30);
const SCALE = +opt('scale', 1.5);
const page_ = opt('page', 'index.html');
const preview = opt('preview', null);
const PR = opt('pr', null); // pixel ratio canvas 3D (default di halaman: 1 = cepat; 1.5 = tajam penuh, ~2x lebih lambat)

const LIB = path.resolve(__dirname, '../assets/lib');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      // /lib/... selalu tersedia: Three.js dkk dari folder skill
      const file = url.startsWith('/lib/') ? path.join(LIB, url.slice(5)) : path.join(dir, url);
      if (!file.startsWith(dir) && !file.startsWith(LIB)) { rsp.writeHead(403); return rsp.end(); }
      fs.readFile(file, (e, d) => {
        if (e) { rsp.writeHead(404); return rsp.end('404'); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        rsp.end(d);
      });
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  const srv = await serve();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: SCALE });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/${page_}?render=1${PR ? '&pr=' + PR : ''}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    if (window.READY) await window.READY;
  });
  await page.waitForFunction(() => typeof window.renderAt === 'function' && window.DURATION > 0, null, { timeout: 20000 })
    .catch(() => { console.error('halaman tidak menyediakan window.renderAt / window.DURATION', errors); process.exit(1); });
  const fail = () => { if (errors.length) { console.error('error di halaman:\n' + errors.join('\n')); process.exit(1); } };
  const shot = async (t, o) => { await page.evaluate(t => window.renderAt(t), t); return page.screenshot(o); };
  const duration = await page.evaluate(() => window.DURATION);

  if (preview) {
    const outDir = path.resolve(opt('dir', path.join(dir, 'preview')));
    fs.mkdirSync(outDir, { recursive: true });
    for (const old of fs.readdirSync(outDir)) if (/^frame-.*\.png$/.test(old)) fs.unlinkSync(path.join(outDir, old)); // buang frame lama
    const times = preview === 'auto'
      ? Array.from({ length: 12 }, (_, i) => +((i + .5) * duration / 12).toFixed(2))
      : preview.split(',').map(Number);
    const files = [];
    for (const t of times) {
      const f = path.join(outDir, `frame-${t.toFixed(2).padStart(6, '0')}.png`);
      await shot(t, { path: f }); files.push(f);
    }
    fail();
    const sheet = opt('sheet', path.join(outDir, 'sheet.jpg'));
    const cols = Math.min(6, files.length), rows = Math.ceil(files.length / cols);
    const list = path.join(outDir, 'list.txt');
    fs.writeFileSync(list, files.map(f => `file '${f}'`).join('\n'));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list,
      '-vf', `scale=270:-1,pad=270:480:(ow-iw)/2:0,tile=${cols}x${rows}`, '-frames:v', '1', sheet]);
    console.log(`durasi ${duration.toFixed(2)} dtk | ${files.length} frame -> ${outDir}\nlembar kontak: ${sheet}`);
    await browser.close(); srv.close(); return;
  }

  // ---- audio ----
  const { events, music } = await page.evaluate(() => ({ events: window.AUDIO_EVENTS || [], music: window.MUSIC || {} }));
  fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify({ duration, events, music }));
  const wav = path.join(dir, 'sound.wav');
  const engine = music.engine === 'studio' ? 'studio_audio.py' : 'sound.py'; // studio = musik berstruktur (PANDUAN Fase 6)
  execFileSync('python3', [path.join(__dirname, engine), path.join(dir, 'events.json'), wav], { stdio: 'inherit' });
  const LUFS = +opt('lufs', music.lufs ?? -15);

  // ---- video ----
  const out = path.resolve(opt('out', path.join(dir, path.basename(dir) + '.mp4')));
  const frames = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', wav,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-af', `loudnorm=I=${LUFS}:TP=-2:LRA=11,alimiter=limit=0.79:level=false,aresample=44100`, '-c:a', 'aac', '-b:a', '160k', '-ar', '44100',
    '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const buf = await shot(i / FPS, { type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} dtk)`);
    if (i === 0) fail();
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  fail();
  await browser.close(); srv.close();
  console.log(`selesai: ${out} (${duration.toFixed(1)} dtk, ${Math.round(720 * SCALE)}x${Math.round(1280 * SCALE)})`);
})();
