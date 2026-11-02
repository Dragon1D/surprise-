"""Mesin audio "studio": musik berstruktur (intro, build, drop, breakdown, riser, akord penutup,
sidechain) + SFX berlapis. Diadaptasi dari PANDUAN-VIDEO-MOTION (Fase 6).

    python3 studio_audio.py events.json out.wav

events.json = {"duration": 21,
  "events": [{"t": 2.5, "type": "impact", "gain": .9, "pan": 0, "d": .5, "f": 1318}, ...],
  "music": {"engine": "studio", "bpm": 120, "bars": ["C","G","Am","F"], "breaks": [[10.5, 14]],
            "build": [13, 14], "final": 19.5, "final_chord": "C", "arp_from": 3.5, "hat_from": 2,
            "clap_from": 2, "volume": 1, "sfxGain": 1}}

Jenis SFX: impact thud clap pop plink tick ticks(d,step) bell(f) sparkle whoosh(d,f0,f1) riser(d)
rise(d,f0,f1) shimmer(d) + alias lama: coin swipe save minus income pluck(note) slap boom end.
Semua bunyi disintesis dari kode (tanpa sampel berlisensi).
"""
import json, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

np.random.seed(7)
SR = 44100
data = json.load(open(sys.argv[1])); dst = sys.argv[2]
DUR = float(data['duration']); M = data.get('music', {}); EV = data.get('events', [])
BEAT = 60.0 / M.get('bpm', 120); BAR = BEAT * 4
N = int(DUR * SR) + SR
music = np.zeros((N, 2)); drums = np.zeros((N, 2)); sfx = np.zeros((N, 2))

def tt(d): return np.arange(int(d * SR)) / SR
def place(buf, sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    n = min(len(sig), N - i)
    l = np.cos((pan + 1) * np.pi / 4) * 1.4142; r = np.sin((pan + 1) * np.pi / 4) * 1.4142
    buf[i:i + n, 0] += sig[:n] * gain * l; buf[i:i + n, 1] += sig[:n] * gain * r
def filt(x, kind, f, order=3): return sosfilt(butter(order, f, btype=kind, fs=SR, output='sos'), x)
def noise(d): return np.random.randn(int(d * SR))
def sweep_tone(d, f0, f1, curve=1.0):
    t = tt(d); f = f0 + (f1 - f0) * (t / d) ** curve; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def sweep_noise(d, f0, f1, q=1.6):
    x = noise(d); out = np.zeros_like(x); W = 2048; H = 1024; win = np.hanning(W); nch = max(1, len(x) // H - 1)
    for k in range(nch):
        s = k * H; fc = f0 * (f1 / f0) ** (k / max(1, nch - 1)); seg = x[s:s + W]
        if len(seg) < W: break
        out[s:s + W] += filt(seg, 'band', [max(60, fc / q), min(SR / 2 - 500, fc * q)], 2) * win
    return out / (np.max(np.abs(out)) + 1e-9)

# ---- bunyi dasar
def kick():
    t = tt(.5); s = np.sin(2 * np.pi * np.cumsum(48 + 130 * np.exp(-t * 30)) / SR) * np.exp(-t * 8)
    s[:150] += np.random.randn(150) * 0.4 * np.linspace(1, 0, 150); return s
def clap():
    t = tt(.25); n = filt(noise(.25), 'band', [900, 3500], 2); e = np.exp(-t * 20) * 0.5
    for o in (0, .011, .022): e += np.exp(-np.clip(t - o, 0, None) * 120) * (t >= o)
    return n * e * 0.7
def hat(o=False):
    d = .22 if o else .07; return filt(noise(d), 'high', 7000, 2) * np.exp(-tt(d) * (18 if o else 70)) * 0.5
def impact():
    t = tt(1.6); return np.sin(2 * np.pi * np.cumsum(28 + 70 * np.exp(-t * 5)) / SR) * np.exp(-t * 2.6) + filt(noise(1.6), 'low', 500, 2) * np.exp(-t * 3.2) * 0.7
def thud():
    t = tt(.35); return np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-t * 25)) / SR) * np.exp(-t * 12) + filt(noise(.35), 'low', 700, 2) * np.exp(-t * 45) * 0.6
def pop():
    t = tt(.16); return np.sin(2 * np.pi * np.cumsum(350 + 800 * np.exp(-t * 30)) / SR) * np.exp(-t * 30)
def plink():
    t = tt(.3); f = 700 + 900 * np.exp(-t * 25); return (np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 16)
def tick(): return filt(noise(.03), 'high', 3000, 2) * np.exp(-tt(.03) * 160)
def bell(f, d=1.4):
    t = tt(d); s = 0
    for m, a, k in [(1, 1, 3), (2.76, .5, 5), (5.4, .3, 8), (8.93, .15, 12)]: s = s + a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k)
    return s * 0.6
def coin():
    s = np.zeros(int(.5 * SR)); a = bell(1975, .5) * .5; b = bell(2637, .45) * .5
    s[:len(a)] += a; s[int(.06 * SR):int(.06 * SR) + len(b)] += b[:len(s) - int(.06 * SR)]; return s
def sparkle(t0, pan=0, g=.5):
    for i, fq in enumerate([880, 1318, 1760, 2637, 3520]): place(sfx, bell(fq, .9) * 0.5, t0 + i * .055, pan + (i - 2) * .2, g)
def whoosh(t0, d, f0, f1, gain=.8, pan=0):
    x = sweep_noise(d, f0, f1); place(sfx, x * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2, t0, pan, gain)
def riser(t0, d, gain=.8):
    x = sweep_noise(d, 250, 7000, 1.8); e = np.linspace(0, 1, len(x)) ** 2.2
    place(sfx, (x + sweep_tone(d, 180, 1500, 2.0) * .25) * e, t0, 0, gain)
def hz(m): return 440 * 2 ** ((m - 69) / 12)

# ---- musik
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def chord(name):
    r = NOTE[name[0]]; rest = name[1:]
    if rest[:1] == '#': r += 1; rest = rest[1:]
    elif rest[:1] == 'b': r -= 1; rest = rest[1:]
    minor = rest.startswith('m') and not rest.startswith('maj'); root = 36 + r
    while root < 41: root += 12
    return [hz(m) for m in (root, root + (3 if minor else 4), root + 7)]
def pluck(f, d=.3):
    t = tt(d); return sum((1 / n ** 1.4) * np.sin(2 * np.pi * f * n * t) * np.exp(-t * (9 + 4 * n)) for n in range(1, 7))
def bass(f, d=.24):
    t = tt(d); s = np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) * np.exp(-t * 10) + .3 * np.sin(6 * np.pi * f * t) * np.exp(-t * 14)
    return s * np.minimum(1, t / .004) * np.exp(-t * 4)
def pad(freqs, d, det):
    t = tt(d); s = sum(np.sin(2 * np.pi * f * det * n * t) / n ** 1.5 for f in freqs for n in range(1, 9))
    return s * np.minimum(1, t / .7) * np.minimum(1, (d - t) / .7) / len(freqs)

BARS = M.get('bars', ['C', 'G', 'Am', 'F'])
breaks = M.get('breaks', []); FINAL = M.get('final', DUR - 1.5)
def on(t): return t < FINAL and not any(a <= t < b for a, b in breaks)

t = 0.0; kicks = []
while t < FINAL:
    if on(t): place(drums, kick(), t, 0, .95); kicks.append(t)
    t += BEAT
for a, b in breaks:
    for tb in (a, b - 2 * BEAT, b - BEAT): place(drums, kick(), tb, 0, .5)
t = 0.0
while t < FINAL:
    if on(t):
        bib = round((t % BAR) / BEAT)
        if t >= M.get('clap_from', 2.0) and bib in (1, 3): place(drums, clap(), t, 0, .8)
        if t >= M.get('hat_from', 2.0):
            place(drums, hat(), t + BEAT / 2, .3, .8); place(drums, hat(), t + BEAT / 4, -.3, .45)
    t += BEAT
if M.get('build'):
    x, gap, a = M['build'][0], .25, M['build'][0]
    while x < M['build'][1]:
        place(drums, clap(), x, 0, .5 + .5 * (x - a) / (M['build'][1] - a)); gap = max(.0625, gap * .8); x += gap
    riser(M['build'][0] - 1.0, M['build'][1] - M['build'][0] + 1.0, .7)
duck = np.ones(N)
for k in kicks:
    i = int(k * SR); n = int(.4 * SR); e = 1 - .6 * np.exp(-np.arange(n) / SR * 9); seg = duck[i:i + n]; duck[i:i + len(seg)] = np.minimum(seg, e[:len(seg)])
nb = int(np.ceil(FINAL / BAR)) + 1
for bi in range(nb):
    t0 = bi * BAR; ch = chord(BARS[bi % len(BARS)]); inbreak = any(a <= t0 < b for a, b in breaks)
    if on(t0):
        for k in range(8): place(music, bass(ch[0]), t0 + k * BEAT / 2, 0, .9)
        sb = tt(BAR * .95)
        place(music, np.sin(2 * np.pi * (ch[0] / 2) * sb) * np.minimum(1, sb / .05) * np.minimum(1, (BAR * .95 - sb) / .2), t0, 0, .45)
    if t0 >= M.get('arp_from', 0) and t0 < FINAL:
        if inbreak:
            for k in range(8): place(music, pluck(ch[k % 3] * 4, .5), t0 + k * BEAT / 2, ((k % 3) - 1) * .4, .28)
        else:
            notes = [ch[0] * 2, ch[1] * 2, ch[2] * 2, ch[1] * 4, ch[2] * 2, ch[1] * 2, ch[0] * 4, ch[2] * 4]
            for k in range(16): place(music, pluck(notes[k % 8]), t0 + k * BEAT / 4, ((k % 4) - 1.5) * .3, .35)
    if t0 < FINAL:
        g = .5 if inbreak else .32; pf = [x * 2 for x in ch]
        place(music, pad(pf, BAR, 1.003), t0, -.5, g); place(music, pad(pf, BAR, .997), t0, .5, g)
fch = chord(M.get('final_chord', BARS[0]))
fc = [x * 4 for x in fch] + [fch[0] * 8]
place(music, pad(fc, 1.5, 1.003), FINAL, -.5, .55); place(music, pad(fc, 1.5, .997), FINAL, .5, .55); place(drums, impact(), FINAL, 0, .7)

# ---- SFX
for e in EV:
    t, ty, g, p = float(e['t']), e['type'], e.get('gain', .8), e.get('pan', 0)
    d = e.get('d', e.get('dur'))
    if   ty in ('impact', 'boom'): place(sfx, impact(), t, p, g)
    elif ty == 'thud':   place(sfx, thud(), t, p, g)
    elif ty == 'clap':   place(sfx, clap(), t, p, g)
    elif ty == 'slap':   place(sfx, impact(), t, p, g * .6); place(sfx, clap(), t, p, g)
    elif ty == 'pop':    place(sfx, pop(), t, p, g)
    elif ty == 'plink':  place(sfx, plink(), t, p, g)
    elif ty == 'tick':   place(sfx, tick(), t, p, g)
    elif ty == 'ticks':
        x = t
        while x < t + (d or .5): place(sfx, tick(), x, p, g); x += e.get('step', .1)
    elif ty == 'bell':    place(sfx, bell(e.get('f', 1318)), t, p, g)
    elif ty == 'coin':    place(sfx, coin(), t, p, g)
    elif ty == 'income':  place(sfx, bell(1568, 1.0), t, p, g); place(sfx, bell(2093, .9), t + .08, p, g * .7)
    elif ty == 'minus':   place(sfx, sweep_tone(.22, 700, 300) * np.exp(-tt(.22) * 9) * .5, t, p, g)
    elif ty == 'pluck':   place(sfx, pluck(hz(int(e.get('note', 76))), .5) * .7, t, p, g)
    elif ty in ('sparkle', 'save', 'end'): sparkle(t, p, g * .6)
    elif ty == 'whoosh':  whoosh(t, d or .5, e.get('f0', 300), e.get('f1', 5200), g, p)
    elif ty == 'swipe':   whoosh(t, d or .3, e.get('f0', 800), e.get('f1', 6000), g, p)
    elif ty == 'riser':   riser(t, d or 1.2, g)
    elif ty == 'rise':    place(sfx, sweep_tone(d, e.get('f0', 250), e.get('f1', 1000), 1.3) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))) * .2, t, p, g)
    elif ty == 'shimmer': place(sfx, filt(noise(d), 'high', 5000, 2) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))) * .12, t, p, g)
    else: print(f'peringatan: SFX "{ty}" tidak dikenal, dilewati', file=sys.stderr)

# ---- mix
vol = M.get('volume', 1.0); sg = M.get('sfxGain', 1.0)
n = int(DUR * SR)
mix = np.tanh((music * duck[:, None] * .55 * vol + drums * .8 * vol + sfx * .95 * sg) * .9)[:n]
fo = int(.8 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .9
with wave.open(dst, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'audio studio ok: {n / SR:.1f} dtk, {len(EV)} efek, {M.get("bpm", 120)} BPM')
