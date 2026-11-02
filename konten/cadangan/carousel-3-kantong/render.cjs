// Render carousel jadi JPG: node render.cjs  → ig/slide-N.jpg (1080x1350) + tiktok/slide-N.jpg (1080x1920)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const dir = __dirname, T = { '.html': 'text/html', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': T[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, async () => {
  const b = await chromium.launch(), port = srv.address().port, errs = [];
  for (const [r, folder, h] of [['45', 'ig', 1350], ['916', 'tiktok', 1920]]) {
    const pg = await b.newPage({ viewport: { width: 1080, height: h } });
    pg.on('pageerror', e => errs.push(e.message));
    for (let n = 1; n <= 7; n++) {
      await pg.goto(`http://127.0.0.1:${port}/carousel.html?slide=${n}&r=${r}`);
      await pg.evaluate(() => window.READY);
      await pg.screenshot({ path: path.join(dir, folder, `slide-${n}.jpg`), type: 'jpeg', quality: 92 });
    }
  }
  await b.close(); srv.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
  console.log('ok: 7 slide IG + 7 slide TikTok');
});
