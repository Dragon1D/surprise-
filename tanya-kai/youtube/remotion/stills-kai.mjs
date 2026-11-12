// Gambar diam untuk cek cepat: node stills-kai.mjs <id> <detik,detik,...> <folder>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const PROJ = process.cwd();  // dijalankan dari studio/proj
const CH = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const [id, ts, dir] = process.argv.slice(2); fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(PROJ, 'src/index.ts')});
const c = await selectComposition({serveUrl, id, browserExecutable: CH, inputProps: {}});
for (const t of ts.split(',').map(Number)) await renderStill({composition: c, serveUrl, frame: Math.min(c.durationInFrames - 1, Math.round(t * 30)), output: path.join(dir, `${id}-${t.toFixed(2)}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, scale: .5, browserExecutable: CH});
fs.rmSync(serveUrl, {recursive: true, force: true}); console.log('STILLS_OK');
