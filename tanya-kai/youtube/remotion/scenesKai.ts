// @ts-nocheck
/* Adegan intro & outro YouTube Tanya Kai (16:9, komposisi 1920×1080, render scale 4/3 → 2560×1440).
   Semua dihitung dari t (detik) + cues_kai.json. Keluaran: string SVG. */
import {P, kai, star, clamp, lerp, prog, eout, eio, spr, rnd, f, O} from './kaiSvg';

const W = 1920, H = 1080;
const lipAt = (arr, t) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
const _cv = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
const measure = (s, size, w = 800) => { if (!_cv) return s.length * size * .55; _cv.font = `${w} ${size}px Pop`; return _cv.measureText(s).width; };
const T = (x, y, s, o = {}) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${o.anchor || 'middle'}" font-family="Pop" font-size="${o.size || 40}" font-weight="${o.weight || 900}" fill="${o.fill || '#fff'}"${o.stroke ? ` stroke="${P.ink}" stroke-width="${o.stroke}" paint-order="stroke"` : ''} letter-spacing="${o.ls || 0}">${s}</text>`;

function bg(t, cx, cy, spin = 10, conf = 30) {
  let s = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.bg1}"/><stop offset="1" stop-color="${P.bg2}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect x="-60" y="-60" width="${W + 120}" height="${H + 120}" fill="url(#bg)"/>`;
  s += `<g transform="translate(${cx} ${cy}) rotate(${f(t * spin)})">`;
  for (let i = 0; i < 18; i++) { const a = i * Math.PI / 9; s += `<path d="M0 0 L${f(Math.cos(a - .09) * 2400)} ${f(Math.sin(a - .09) * 2400)} L${f(Math.cos(a + .09) * 2400)} ${f(Math.sin(a + .09) * 2400)} Z" fill="#fff" opacity=".12"/>`; }
  s += `</g><circle cx="${cx}" cy="${cy}" r="${f(420 + Math.sin(t * 2) * 12)}" fill="url(#glow)"/>`;
  const cols = [P.yel, P.mint, '#fff', '#ff7aa2'];
  for (let i = 0; i < conf; i++) {
    const x = rnd(i) * W + Math.sin(t * 1.3 + i) * 20, y = H + 40 - ((t * (40 + rnd(i + 5) * 50) + rnd(i + 9) * (H + 80)) % (H + 80)), r = 7 + rnd(i + 2) * 7;
    s += i % 2 ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${cols[i % 4]}" stroke="${P.ink}" stroke-width="3.5"/>` : `<rect x="${f(x - r)}" y="${f(y - r)}" width="${f(r * 2)}" height="${f(r * 2)}" rx="3" fill="${cols[i % 4]}" stroke="${P.ink}" stroke-width="3.5" transform="rotate(${f(t * 90 + i * 30)} ${f(x)} ${f(y)})"/>`;
  }
  return s;
}
function burst(t, t0, cx, cy, front) {
  const k = prog(t, t0, t0 + 1.1); if (k <= 0 || k >= 1) return '';
  let s = '';
  if (!front) {
    const cols = [P.yel, P.mint, '#fff', '#ff7aa2', P.bg1];
    for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2 + rnd(i) * .3, d = eout(k) * (320 + rnd(i + 4) * 220), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d + k * k * 260, z = (1 - k * .6) * (10 + rnd(i + 1) * 9); s += `<rect x="${f(x - z)}" y="${f(y - z / 2)}" width="${f(z * 2)}" height="${f(z)}" rx="3" fill="${cols[i % 5]}" stroke="${P.ink}" stroke-width="3" transform="rotate(${f(k * 540 + i * 40)} ${f(x)} ${f(y)})"/>`; }
    return s;
  }
  [[-300, -240, 52], [280, -260, 60], [-320, 160, 38], [300, 180, 44]].forEach(([dx, dy, r], i) => {
    const kk = spr(t - t0 - i * .06, .35, 20) * (1 - prog(t, t0 + .8, t0 + 1.1));
    if (kk > 0) s += `<g transform="translate(${cx + dx} ${cy + dy}) rotate(${f(t * 90)}) scale(${f(kk)})">${star(r, i % 2 ? P.yel : '#fff', 8)}</g>`;
  });
  return s;
}
// Kai di (x,y) skala sc; o = parameter kai()
function kaiAt(o, x, y, sc, sx = 1, sy = 1, rot = 0) {
  return `<ellipse cx="${x}" cy="${f(y + sc * 158)}" rx="${f(150 * sc)}" ry="${f(22 * sc)}" fill="${P.ink}" opacity=".2"/>`
    + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(sc * sx)} ${f(sc * sy)}) rotate(${f(rot)}) translate(-258 -256)">${kai(o)}</g>`;
}

/* =================== INTRO =================== */
export function introSvg(t, C) {
  const c = C.intro, KX = 540, KY = 560;
  const enter = spr(t - c.enter, .4, 14), talk = lipAt(c.lip, t);
  const jump = t >= c.ngeh ? Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI) : 0;
  const land = t >= c.ngeh + .5 ? Math.max(0, 1 - (t - c.ngeh - .5) / .25) * Math.cos((t - c.ngeh - .5) * 30) : 0;
  const pre = Math.sin(prog(t, c.ngeh - .18, c.ngeh) * Math.PI / 2) * (t < c.ngeh ? 1 : 0);
  const idle = Math.sin(t * 4.2);
  const sx = 1 + pre * .12 - jump * .08 + land * .1 + idle * .015, sy = 1 - pre * .14 + jump * .12 - land * .1 - idle * .015;
  const ngeh = t >= c.ngeh && t < c.exit;
  const o = {
    wave: t > c.wave[0] && t < c.wave[1] ? Math.sin((t - c.wave[0]) * 14) * 26 * Math.sin(prog(t, c.wave[0], c.wave[1]) * Math.PI) : (ngeh ? -28 * Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI) : 0),
    rest: ngeh ? -30 * Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI) : Math.sin(t * 3) * 4,
    sprout: Math.sin(t * 6) * 8 + (1 - spr(t - c.enter - .2, .2, 14)) * 30 + (ngeh ? Math.sin((t - c.ngeh) * 18) * 18 * Math.max(0, 1 - (t - c.ngeh) / .8) : 0),
    look: [0, 0], eyes: ngeh ? 'star' : ((t > 1.9 && t < 2.02) ? 'blink' : 'open'), spin: (t - c.ngeh) * 120,
    mouth: ngeh && talk < .1 ? 'grin' : 'smile', talk: ngeh ? Math.min(talk, .6) : talk,
  };
  let s = bg(t, KX, KY, 10, 34) + burst(t, c.ngeh, KX, KY - 40, false);
  s += kaiAt(o, KX, KY + (1 - enter) * 800 - jump * 130 + idle * 6, 1.45, sx, sy, Math.sin(t * 2.5) * 2);
  s += burst(t, c.ngeh, KX, KY - 40, true);
  // "MASA SIH?!" meledak di momen ngeh, lalu memberi tempat untuk judul
  const mk = spr(t - c.ngeh, .35, 18) * (1 - prog(t, c.title - .05, c.title + .2));
  if (mk > 0) s += `<g transform="translate(1380 520) rotate(-6) scale(${f(mk)})">${T(0, 0, 'MASA SIH?!', {size: 132, fill: P.yel, stroke: 18, ls: -3})}</g>`;
  // judul + tagline
  const tk = spr(t - c.title, .42, 16), gk = spr(t - c.tag, .5, 16);
  if (tk > 0) s += `<g transform="translate(1360 ${f(560 + (1 - tk) * 90)}) scale(${f(clamp(tk, 0, 1.2))})">${T(0, 0, 'Tanya Kai', {size: 156, stroke: 20, ls: -4})}</g>`;
  if (gk > 0) s += `<g transform="translate(1360 660) scale(${f(gk)})"><rect x="-300" y="-48" width="600" height="92" rx="46" fill="${P.yel}" ${O(8)}/>${T(0, 16, 'Dikit, tapi nempel.', {size: 46, fill: P.ink})}</g>`;
  // keluar: zoom + putih
  const ex = eio(prog(t, c.exit, c.dur));
  if (ex > 0) s = `<g transform="translate(${KX} ${KY}) scale(${f(1 + ex * .25)}) translate(${-KX} ${-KY})">${s}</g><rect width="${W}" height="${H}" fill="#fff" opacity="${f(ex)}"/>`;
  return s;
}

/* =================== OUTRO =================== */
function bubble(text, x, y, k) {
  const words = text.split(' '), lines = [''], maxW = 640, size = 40;
  words.forEach(w => { const tryL = (lines[lines.length - 1] + ' ' + w).trim(); if (measure(tryL, size) > maxW && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tryL; });
  const bw = Math.max(...lines.map(l => measure(l, size) * 1.1)) + 110, bh = lines.length * 52 + 46;
  let s = `<g transform="translate(${x} ${y}) scale(${f(k)})"><path d="M${f(-bw / 2)} ${f(-bh)} h${f(bw)} a26 26 0 0 1 26 26 v${f(bh - 52)} a26 26 0 0 1 -26 26 h${f(-bw / 2 + 60)} l-40 46 l6 -46 h${f(-bw / 2 + 2 - 26 + 26)} a26 26 0 0 1 -26 -26 v${f(-(bh - 52))} a26 26 0 0 1 26 -26 z" fill="#fff" ${O(7)}/>`;
  lines.forEach((l, i) => s += T(0, -bh + 62 + i * 52, l, {size, fill: P.ink, weight: 800}));
  return s + '</g>';
}
export function outroSvg(t, C) {
  const c = C.outro, KX = 440, KY = 620;
  const enter = spr(t - c.enter, .4, 14), talk = lipAt(c.lip, t);
  const idle = Math.sin(t * 3.6);
  const pointing = t > c.point && t < c.point + 1.6, bye = t > c.bye && t < c.bye + 2.6;
  const o = {
    wave: bye ? Math.sin((t - c.bye) * 13) * 30 * Math.sin(prog(t, c.bye, c.bye + 2.6) * Math.PI) - 10 : (t > 16.5 && t < 18 ? Math.sin((t - 16.5) * 12) * 18 * Math.sin(prog(t, 16.5, 18) * Math.PI) : 0),
    rest: pointing ? -95 * Math.sin(prog(t, c.point, c.point + 1.6) * Math.PI) : Math.sin(t * 3) * 4,
    sprout: Math.sin(t * 5) * 8 + (1 - spr(t - c.enter - .2, .2, 14)) * 30,
    look: pointing ? [9, 2] : [0, 0], eyes: ((t % 3.4) > 3.26) ? 'blink' : 'open',
    mouth: 'smile', talk,
  };
  let s = bg(t, KX, KY, 5, 22);
  // logo kecil kiri atas
  s += `<g transform="translate(70 70)"><rect width="300" height="74" rx="37" fill="${P.ink}"/>${T(150, 50, 'Tanya Kai', {size: 38, fill: P.yel})}</g>`;
  // bingkai panduan untuk elemen layar akhir YouTube (2 video)
  [[1150, 150], [1150, 600]].forEach(([x, y], i) => {
    const k = spr(t - c.frames - i * .15, .5, 16); if (k <= 0) return;
    s += `<g transform="translate(${x + 320} ${y + 180}) scale(${f(k)}) translate(${-320} ${-180})"><rect width="640" height="360" rx="28" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-width="6" stroke-dasharray="18 14"/>${T(320, 196, i ? 'video lainnya' : 'tonton juga', {size: 40, fill: '#fff', weight: 800})}</g>`;
  });
  // ajakan subscribe saat kata "subscribe"
  const sk = spr(t - c.point, .45, 16) * (1 - prog(t, c.bye - .3, c.bye));
  if (sk > 0) s += `<g transform="translate(830 930) scale(${f(sk)})"><rect x="-190" y="-46" width="380" height="92" rx="46" fill="#ff3b3b" ${O(8)}/>${T(0, 16, 'subscribe ya!', {size: 44})}</g>`;
  // Kai berbicara + gelembung ucapan
  s += kaiAt(o, KX, KY + (1 - enter) * 800 + idle * 6, 1.25, 1 + idle * .015, 1 - idle * .015, Math.sin(t * 2.2) * 2);
  const line = c.lines.find(([a, b]) => t >= a - .05 && t < b + .45);
  if (line) { const bk = spr(t - line[0] + .05, .5, 18); s += bubble(line[2], KX + 40, 340, clamp(bk, 0, 1.08)); }
  // akhir: gelap pelan
  s += `<rect width="${W}" height="${H}" fill="${P.ink}" opacity="${f(prog(t, c.fade, c.dur))}"/>`;
  return s;
}

/* =================== GABUNGAN: satu adegan, Kai muncul sekali =================== */
export function comboSvg(t, C) {
  const c = C.combo, talk = lipAt(c.lip, t);
  const m = eio(prog(t, c.morph[0], c.morph[1]));            // 0 = tata letak intro, 1 = tata letak outro
  const KX = lerp(540, 440, m), KY = lerp(560, 620, m), SC = lerp(1.45, 1.25, m);
  const enter = spr(t - c.enter, .4, 14);
  const jump = t >= c.ngeh ? Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI) : 0;
  const land = t >= c.ngeh + .5 ? Math.max(0, 1 - (t - c.ngeh - .5) / .25) * Math.cos((t - c.ngeh - .5) * 30) : 0;
  const pre = Math.sin(prog(t, c.ngeh - .18, c.ngeh) * Math.PI / 2) * (t < c.ngeh ? 1 : 0);
  const idle = Math.sin(t * 4);
  const sx = 1 + pre * .12 - jump * .08 + land * .1 + idle * .015, sy = 1 - pre * .14 + jump * .12 - land * .1 - idle * .015;
  const ngeh = t >= c.ngeh && t < c.morph[0] + .2;
  const pointing = t > c.point && t < c.point + 1.6, bye = t > c.bye && t < c.bye + 1.4;
  const o = {
    wave: t > c.wave[0] && t < c.wave[1] ? Math.sin((t - c.wave[0]) * 14) * 26 * Math.sin(prog(t, c.wave[0], c.wave[1]) * Math.PI)
      : ngeh ? -28 * Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI)
      : bye ? Math.sin((t - c.bye) * 13) * 30 * Math.sin(prog(t, c.bye, c.bye + 1.4) * Math.PI) - 10 : 0,
    rest: ngeh ? -30 * Math.sin(prog(t, c.ngeh, c.ngeh + .5) * Math.PI) : pointing ? -95 * Math.sin(prog(t, c.point, c.point + 1.6) * Math.PI) : Math.sin(t * 3) * 4,
    sprout: Math.sin(t * 6) * 8 + (1 - spr(t - c.enter - .2, .2, 14)) * 30 + (ngeh ? Math.sin((t - c.ngeh) * 18) * 18 * Math.max(0, 1 - (t - c.ngeh) / .8) : 0),
    look: pointing ? [9, 2] : [0, 0],
    eyes: ngeh ? 'star' : (((t > 1.9 && t < 2.02) || (t > c.morph[1] && (t % 3.4) > 3.26)) ? 'blink' : 'open'), spin: (t - c.ngeh) * 120,
    mouth: ngeh && talk < .1 ? 'grin' : 'smile', talk: ngeh ? Math.min(talk, .6) : talk,
  };
  let s = bg(t, KX, KY, lerp(10, 5, m), 30) + burst(t, c.ngeh, KX, KY - 40, false);
  // bingkai panduan layar akhir (muncul setelah Kai pindah)
  [[1150, 150], [1150, 600]].forEach(([x, y], i) => {
    const k = spr(t - c.frames - i * .15, .5, 16); if (k <= 0) return;
    s += `<g transform="translate(${x + 320} ${y + 180}) scale(${f(k)}) translate(${-320} ${-180})"><rect width="640" height="360" rx="28" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-width="6" stroke-dasharray="18 14"/>${T(320, 196, i ? 'video lainnya' : 'tonton juga', {size: 40, fill: '#fff', weight: 800})}</g>`;
  });
  const sk = spr(t - c.point, .45, 16) * (1 - prog(t, c.bye - .3, c.bye));
  if (sk > 0) s += `<g transform="translate(830 930) scale(${f(sk)})"><rect x="-190" y="-46" width="380" height="92" rx="46" fill="#ff3b3b" ${O(8)}/>${T(0, 16, 'subscribe ya!', {size: 44})}</g>`;
  s += kaiAt(o, KX, KY + (1 - enter) * 800 - jump * 130 + idle * 6, SC, sx, sy, Math.sin(t * 2.4) * 2);
  s += burst(t, c.ngeh, KX, KY - 40, true);
  const mk = spr(t - c.ngeh, .35, 18) * (1 - prog(t, c.title - .05, c.title + .2));
  if (mk > 0) s += `<g transform="translate(1380 520) rotate(-6) scale(${f(mk)})">${T(0, 0, 'MASA SIH?!', {size: 132, fill: P.yel, stroke: 18, ls: -3})}</g>`;
  // judul besar → mengecil jadi logo pojok kiri atas
  const tk = spr(t - c.title, .42, 16), gk = spr(t - c.tag, .5, 16) * (1 - prog(t, c.morph[0], c.morph[0] + .3));
  if (tk > 0) {
    const tx = lerp(1360, 220, m), ty = lerp(560 + (1 - Math.min(tk, 1)) * 90, 120, m), ts = lerp(clamp(tk, 0, 1.2), .26, m);
    if (m > .02) s += `<g opacity="${f(prog(m, .85, 1))}"><rect x="70" y="70" width="300" height="74" rx="37" fill="${P.ink}"/></g>`;
    s += `<g transform="translate(${f(tx)} ${f(ty)}) scale(${f(ts)})">${T(0, m > .6 ? 0 : 0, 'Tanya Kai', {size: 156, stroke: lerp(20, 0, m), fill: m > .6 ? P.yel : '#fff', ls: -4})}</g>`;
  }
  if (gk > 0) s += `<g transform="translate(1360 660) scale(${f(gk)})"><rect x="-300" y="-48" width="600" height="92" rx="46" fill="${P.yel}" ${O(8)}/>${T(0, 16, 'Dikit, tapi nempel.', {size: 46, fill: P.ink})}</g>`;
  const line = c.lines.find(([a, b]) => t >= a - .05 && t < b + .45);
  if (line) { const bk = spr(t - line[0] + .05, .5, 18); s += bubble(line[2], KX + 40, 340, clamp(bk, 0, 1.08)); }
  s += `<rect width="${W}" height="${H}" fill="${P.ink}" opacity="${f(prog(t, c.fade, c.dur))}"/>`;
  return s;
}
