// Render index.html jadi MP4 vertikal 1080x1920 @30fps.
// Pakai: python3 music.py && node render.cjs [output.mp4] [--preview t1,t2,...]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const FPS = 30;
const args = process.argv.slice(2);
const previewIdx = args.indexOf('--preview');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?render=1');
  await page.evaluate(() => document.fonts.ready);

  if (previewIdx >= 0) {
    // ambil beberapa frame sebagai PNG untuk dicek
    const times = args[previewIdx + 1].split(',').map(Number);
    const dir = args[previewIdx + 2] || __dirname;
    for (const t of times) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(dir, `preview-${t}.png`) });
    }
    await browser.close();
    return;
  }

  const out = args[0] || path.join(__dirname, 'katak-di-panci.mp4');
  const audio = path.join(__dirname, 'music.wav');
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', audio,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.renderAt(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('selesai:', out);
})();
