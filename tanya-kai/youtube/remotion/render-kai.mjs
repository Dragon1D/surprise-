// Render intro & outro YouTube Tanya Kai (2560×1440) dari studio/proj. Jalankan: node render-kai.mjs [intro|outro|semua]
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const PROJ = process.cwd(), OUT = path.resolve(PROJ, '../../tanya-kai/youtube');  // dijalankan dari studio/proj
const CH = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const which = process.argv[2] || 'semua';
const serveUrl = await bundle({entryPoint: path.join(PROJ, 'src/index.ts')});
for (const [id, file] of [['KaiIntroYT', 'tanya-kai-intro-youtube.mp4'], ['KaiOutroYT', 'tanya-kai-outro-youtube.mp4'], ['KaiComboYT', 'tanya-kai-intro-outro-youtube.mp4']]) {
  if (which !== 'semua' && !id.toLowerCase().includes(which)) continue;
  const c = await selectComposition({serveUrl, id, browserExecutable: CH, inputProps: {}});
  const t0 = Date.now();
  await renderMedia({composition: c, serveUrl, codec: 'h264', crf: 18, scale: 4 / 3, audioCodec: 'aac', audioBitrate: '256k', outputLocation: path.join(OUT, file), browserExecutable: CH, concurrency: 3, imageFormat: 'jpeg', jpegQuality: 92});
  console.log('RENDER_OK', file, Math.round((Date.now() - t0) / 1000), 's');
}
fs.rmSync(serveUrl, {recursive: true, force: true});
