// Render index.html jadi MP4 vertikal 1080x1920 @30fps, lengkap dengan audio yang sinkron.
// Pakai: node render.cjs [output.mp4]            -> render penuh
//        node render.cjs --preview 3,10,20 <dir>  -> simpan beberapa frame PNG
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
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
    const times = args[previewIdx + 1].split(',').map(Number);
    const dir = args[previewIdx + 2] || __dirname;
    for (const t of times) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(dir, `preview-${t}.png`) });
    }
    console.log('durasi:', await page.evaluate(() => window.DURATION));
    await browser.close();
    return;
  }

  // 1) timeline audio dari halaman -> sound.py -> sound.wav
  const { duration, events, music } = await page.evaluate(() => ({ duration: window.DURATION, events: window.AUDIO_EVENTS, music: window.MUSIC }));
  fs.writeFileSync(path.join(__dirname, 'events.json'), JSON.stringify({ duration, events, music }));
  execFileSync('python3', [path.join(__dirname, 'sound.py')], { stdio: 'inherit' });

  // 2) frame -> ffmpeg
  const out = args[0] || path.join(__dirname, 'kok-bisa.mp4');
  const frames = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', path.join(__dirname, 'sound.wav'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.renderAt(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('selesai:', out);
})();
