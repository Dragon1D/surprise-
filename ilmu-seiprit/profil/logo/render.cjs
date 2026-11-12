// Render paket logo Ilmu Seiprit: node render.cjs (dari root repo: NODE_PATH=$(npm root -g) node ilmu-seiprit/profil/logo/render.cjs)
const { chromium } = require('playwright'); const path = require('path'), http = require('http'), fs = require('fs');
const root = path.resolve(__dirname, '../../..'), outDir = path.join(__dirname, 'final');
fs.mkdirSync(outDir, { recursive: true });
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html' : 'font/woff2' }); r.end(b); }); });
const JOBS = [['avatar', 'avatar-1080.png', false], ['logo', 'kai-transparan-1080.png', true], ['ekspresi-senyum', 'kai-senyum.png', true], ['ekspresi-kaget', 'kai-kaget.png', true], ['ekspresi-mikir', 'kai-mikir.png', true], ['ekspresi-ngeh', 'kai-ngeh.png', true], ['banner-yt', 'banner-youtube-2560x1440.png', false], ['cover-fb', 'sampul-facebook-1640x624.png', false], ['watermark', 'watermark-video.png', true], ['lembar', '../lembar-kai.png', false]];
srv.listen(0, async () => {
  const b = await chromium.launch(), port = srv.address().port;
  for (const [o, file, transp] of JOBS) {
    const pg = await b.newPage({ viewport: { width: 2560, height: 1440 } });
    await pg.goto(`http://127.0.0.1:${port}/ilmu-seiprit/profil/logo/paket.html?out=${o}`); await pg.evaluate(() => window.READY);
    const [w, h] = await pg.evaluate(() => window.SIZE);
    await pg.setViewportSize({ width: w, height: h });
    await pg.screenshot({ path: path.join(outDir, file), omitBackground: transp, clip: { x: 0, y: 0, width: w, height: h } });
    await pg.close();
  }
  await b.close(); srv.close(); console.log('ok', JOBS.length, 'file');
});
