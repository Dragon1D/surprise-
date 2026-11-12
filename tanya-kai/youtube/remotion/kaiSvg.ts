// @ts-nocheck
/* Kai (maskot Tanya Kai) sebagai string SVG — diport dari explainer/tanya-kai-intro/index.html.
   Palet Permen Kapas. Dipakai komposisi Remotion KaiIntroYT & KaiOutroYT. */
export const P = { ink: '#1f1b2e', white: '#ffffff', body: '#ff9ec4', shine: '#ffd3e6', fold: '#f06fa2', cheek: '#ff5a5f', leaf: '#5fe0a8', yel: '#ffd23f', bg1: '#8b7bff', bg2: '#4fc3ff', mint: '#5fe0a8' };
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const eout = k => 1 - Math.pow(1 - k, 3);
export const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
export const spr = (dt, z = .38, w = 16) => { if (dt <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + z / Math.sqrt(1 - z * z) * Math.sin(wd * dt)); };
export const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const f = n => (+n).toFixed(1);
export const O = (w = 12) => `stroke="${P.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
export const star = (r, fill = P.white, sw = 9) => { let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .4 : r; d += `${i ? 'L' : 'M'}${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)} `; } return `<path d="${d}Z" fill="${fill}" stroke="${P.ink}" stroke-width="${sw}" stroke-linejoin="round"/>`; };

/* ---------- Kai (kotak 512, kaki di y≈414) ---------- */
const BODY = 'M112 300 C98 222 142 152 212 152 C232 120 290 118 314 150 C382 148 422 212 406 292 C400 362 332 394 258 394 C178 394 118 362 112 300 Z';
export function kai(o) {
  // o: wave (derajat ayunan lengan), sprout (derajat), look [x,y], eyes 'open'|'blink'|'star', mouth 'smile'|'o'|'grin'
  let s = '';
  s += `<ellipse cx="216" cy="398" rx="28" ry="16" fill="${P.body}" ${O(11)}/><ellipse cx="300" cy="398" rx="28" ry="16" fill="${P.body}" ${O(11)}/>`;
  // lengan kanan (diam, sedikit berayun)
  s += `<g transform="rotate(${f(o.rest || 0)} 402 318)"><path d="M402 318 C426 330 432 350 424 366" fill="none" ${O(30)}/><path d="M402 318 C426 330 432 350 424 366" fill="none" stroke="${P.body}" stroke-width="16" stroke-linecap="round"/><circle cx="422" cy="372" r="17" fill="${P.body}" ${O(10)}/></g>`;
  // tunas
  s += `<g transform="rotate(${f(o.sprout)} 262 152)"><path d="M262 150 C262 112 254 92 270 70" fill="none" ${O(10)}/><path d="M270 72 C300 40 350 46 356 64 C330 92 292 92 270 72 Z" fill="${P.leaf}" ${O(10)}/><path d="M266 92 C240 70 206 74 200 90 C220 110 252 108 266 92 Z" fill="${P.leaf}" ${O(9)}/></g>`;
  // badan otak
  s += `<path d="${BODY}" fill="${P.body}" ${O(13)}/><path d="M140 250 C150 200 190 176 230 176" fill="none" stroke="${P.shine}" stroke-width="16" stroke-linecap="round"/>`;
  s += `<path d="M262 138 C250 168 270 192 256 222" fill="none" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/><path d="M190 196 q22 -8 30 12 M320 186 q-18 10 -6 30 q10 12 28 6 M350 250 q-20 0 -26 14" fill="none" stroke="${P.fold}" stroke-width="10" stroke-linecap="round"/>`;
  // mata
  [[204, 284], [312, 284]].forEach(([x, y]) => {
    if (o.eyes === 'blink') s += `<path d="M${x - 26} ${y + 2} q26 16 52 0" fill="none" ${O(9)}/>`;
    else if (o.eyes === 'star') s += `<ellipse cx="${x}" cy="${y}" rx="32" ry="38" fill="${P.ink}"/><g transform="translate(${x} ${y}) rotate(${f(o.spin || 0)})">${star(24, P.yel, 0)}</g><circle cx="${x - 12}" cy="${y - 18}" r="6" fill="${P.white}"/>`;
    else { const [lx, ly] = o.look || [0, 0]; s += `<ellipse cx="${x}" cy="${y}" rx="30" ry="38" fill="${P.ink}"/><circle cx="${x - 9 + lx}" cy="${y - 14 + ly}" r="12" fill="${P.white}"/><circle cx="${x + 9 + lx}" cy="${y + 12 + ly}" r="5.5" fill="${P.white}"/>`; }
  });
  s += `<ellipse cx="160" cy="330" rx="22" ry="12" fill="${P.cheek}" opacity=".75"/><ellipse cx="356" cy="330" rx="22" ry="12" fill="${P.cheek}" opacity=".75"/>`;
  if (o.talk && o.talk > .06 && o.mouth !== 'grin') { const h = 6 + o.talk * 26, w = 22 + o.talk * 8; s += `<path d="M${f(258 - w)} 324 Q258 ${f(324 + h * 2)} ${f(258 + w)} 324 Z" fill="${P.ink}" ${O(6)}/><ellipse cx="258" cy="${f(324 + h * 1.15)}" rx="${f(w * .5)}" ry="${f(Math.max(3, h * .38))}" fill="#ff7aa2"/>`; }
  else if (o.mouth === 'o') s += `<ellipse cx="258" cy="334" rx="13" ry="16" fill="${P.ink}"/>`;
  else if (o.mouth === 'grin') s += `<path d="M226 320 q32 40 64 0 z" fill="${P.ink}" ${O(6)}/><ellipse cx="258" cy="342" rx="15" ry="8" fill="#ff7aa2"/>`;
  else s += `<path d="M234 326 q24 30 48 0 z" fill="${P.ink}" ${O(6)}/><ellipse cx="258" cy="342" rx="12" ry="7" fill="#ff7aa2"/>`;
  // lengan kiri melambai (pivot di bahu)
  s += `<g transform="rotate(${f(o.wave)} 118 318)"><path d="M118 318 C92 300 80 270 88 244" fill="none" ${O(30)}/><path d="M118 318 C92 300 80 270 88 244" fill="none" stroke="${P.body}" stroke-width="16" stroke-linecap="round"/><circle cx="88" cy="236" r="18" fill="${P.body}" ${O(10)}/></g>`;
  return s;
}

