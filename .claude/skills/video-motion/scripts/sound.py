"""Audio sintetis untuk video motion: musik latar + efek suara dari timeline.

    python3 sound.py events.json sound.wav

events.json = {"duration": 52.3, "events": [{"t": 1.2, "type": "notif"}, ...],
               "music": {"style": "lofi", "bpm": 84, "drumsFrom": 6, "drumsTo": 50, "volume": 1}}

music.style: "lofi" (akor + drum santai), "ambient" (pad lembut), "upbeat" (lebih cepat, cerah), "tense", "none".
Jenis efek (type) yang dikenal: lihat fungsi sfx() di bawah. Jenis tak dikenal diabaikan dengan peringatan.
Semua bunyi dibuat dari nol (tanpa sample berlisensi), jadi aman dipakai di medsos.
"""
import json
import sys
import wave

import numpy as np

SR = 44100
src, dst = sys.argv[1], sys.argv[2]
data = json.load(open(src))
DUR = float(data['duration'])
N = int(SR * DUR) + 1
out = np.zeros(N)
rng = np.random.default_rng(7)
T_ALL = np.arange(N) / SR


def add(sig, at, gain=1.0):
    i0 = int(at * SR)
    if i0 >= N or i0 < 0:
        return
    sig = sig[: N - i0]
    out[i0:i0 + len(sig)] += gain * sig


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def blip(f0, f1, sec, gain, decay=18):
    t = tt(sec)
    f = np.linspace(f0, f1, len(t))
    return gain * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay) * np.minimum(1, t / .003)


def noise(sec, smooth=1):
    n = rng.standard_normal(int(sec * SR))
    return np.convolve(n, np.ones(smooth) / smooth, mode='same') if smooth > 1 else n


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------- musik ----------------
M = data.get('music') or {}
style = M.get('style', 'lofi')
vol = float(M.get('volume', 1))
PROG = {
    'lofi': [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]],
    'ambient': [[45, 52, 57, 64], [41, 48, 57, 60], [48, 55, 60, 64], [43, 50, 55, 62]],
    'upbeat': [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 65], [55, 59, 62, 67]],
    'tense': [[45, 48, 52, 56], [46, 49, 53, 56], [45, 48, 52, 56], [44, 48, 51, 55]],
}
if style != 'none':
    bpm = float(M.get('bpm', {'lofi': 84, 'ambient': 70, 'upbeat': 112, 'tense': 90}.get(style, 84)))
    beat = 60 / bpm
    bar = beat * 4
    d_from, d_to = float(M.get('drumsFrom', 0)), float(M.get('drumsTo', DUR))
    chords = PROG.get(style, PROG['lofi'])
    for b in range(int(DUR / bar) + 1):
        for n in chords[b % 4]:
            t = tt(bar + .4)
            if style == 'ambient':
                sig = (np.sin(2 * np.pi * hz(n) * t) + .5 * np.sin(2 * np.pi * hz(n) * 1.004 * t)) * np.minimum(1, t / 1.2) * np.minimum(1, (bar + .4 - t) / 1.0)
                add(sig, b * bar, .03 * vol)
            else:
                sig = (np.sin(2 * np.pi * hz(n) * t) + .3 * np.sin(2 * np.pi * hz(n) * 2.001 * t)) * np.exp(-t * (.9 if style != 'upbeat' else 1.6))
                add(sig * np.minimum(1, t / .02), b * bar, .022 * vol)
        if style == 'ambient':
            continue
        for k in range(4):
            st = b * bar + k * beat
            if not (d_from <= st < d_to):
                continue
            if k in (0, 2) or (style == 'upbeat'):
                t = tt(.35)
                add(np.sin(2 * np.pi * (50 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 9), st, .22 * vol)
            if k in (1, 3):
                t = tt(.2)
                add(rng.standard_normal(len(t)) * np.exp(-t * 22), st, .04 * vol)
            for h in ((0, .5) if style != 'upbeat' else (0, .25, .5, .75)):
                t = tt(.05)
                add(np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t * 80), st + h * beat, .022 * vol)
    if style == 'lofi':
        out += (rng.random(N) > .9993) * rng.standard_normal(N) * .04 * vol


# ---------------- efek ----------------
def sfx(e):
    t0, typ = float(e['t']), e['type']
    g = float(e.get('gain', 1))
    if typ == 'in':          # pesan masuk
        add(blip(880, 1320, .12, .30 * g), t0); add(blip(1320, 1760, .12, .22 * g), t0 + .07)
    elif typ == 'out':       # pesan terkirim
        add(blip(700, 1050, .1, .22 * g), t0)
    elif typ == 'key':       # ketukan keyboard
        t = tt(.025); add(rng.standard_normal(len(t)) * np.exp(-t * 300), t0, .08 * g)
    elif typ in ('date', 'tick'):
        add(blip(520, 520, .25, .10 * g), t0)
    elif typ == 'minus':     # uang keluar
        add(blip(1500, 900, .09, .22 * g), t0); add(blip(1000, 500, .18, .22 * g), t0 + .08)
        t = tt(.06); add(rng.standard_normal(len(t)) * np.exp(-t * 90), t0, .06 * g)
    elif typ == 'income':    # uang masuk
        for i, f in enumerate([1047, 1319, 1568, 2093]): add(blip(f, f, .3, .2 * g), t0 + i * .07)
    elif typ == 'save':      # nabung / sukses
        for i, f in enumerate([1319, 1568, 2093, 2637]): add(blip(f, f, .35, .2 * g), t0 + i * .06)
    elif typ == 'delete':
        t = tt(.25); add(rng.standard_normal(len(t)) * np.exp(-t * 14) * np.linspace(1, 0, len(t)), t0, .08 * g)
    elif typ == 'voice':     # napas ngos-ngosan (pesan suara lucu)
        d = float(e.get('dur', 3)); t = tt(d)
        n = noise(d, 14)
        br = np.abs(np.sin(np.pi * t * 2.6)) ** 2
        groan = .25 * np.sin(2 * np.pi * (180 + 30 * np.sin(t * 3)) * t) * br * (np.sin(np.pi * t * 1.3) > .2)
        add((n * 2.5 + groan) * br * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .2), t0, .5 * g)
    elif typ == 'notif':     # notifikasi HP
        add(blip(1568, 1568, .35, .3 * g), t0); add(blip(2093, 2093, .5, .3 * g), t0 + .13)
    elif typ == 'sting':     # kaget / dramatis
        t = tt(1.2)
        sig = sum(np.sin(2 * np.pi * f * t) for f in (110, 165, 220, 233)) * np.exp(-t * 2.5)
        add(sig * np.minimum(1, t / .01), t0, .12 * g); add(blip(2400, 1800, .3, .15 * g), t0)
    elif typ in ('whoosh', 'swipe'):
        d = float(e.get('dur', .8 if typ == 'whoosh' else .45)); t = tt(d)
        n = rng.standard_normal(len(t))
        k = np.linspace(2, 40, len(t)) if typ == 'whoosh' else np.linspace(30, 4, len(t))
        cs = np.concatenate([[0], np.cumsum(n)])
        idx = np.arange(len(n)); lo = np.maximum(0, idx - k.astype(int))
        sm = (cs[idx + 1] - cs[lo]) / (idx + 1 - lo)
        add(sm * np.sin(np.pi * t / d) ** 2, t0, .9 * g)
    elif typ == 'pop':
        add(blip(400, 900, .15, .35 * g), t0)
    elif typ == 'slap':      # tepuk jidat / pukul
        t = tt(.25); add(rng.standard_normal(len(t)) * np.exp(-t * 35), t0, .5 * g)
        add(np.sin(2 * np.pi * 140 * t) * np.exp(-t * 25), t0, .4 * g)
    elif typ == 'idea':
        for i, f in enumerate([784, 988, 1175, 1568]): add(blip(f, f, .6, .2 * g), t0 + i * .08)
    elif typ == 'boom':      # dentuman pergantian adegan
        t = tt(1.2); add(np.sin(2 * np.pi * (60 - 20 * t) * t) * np.exp(-t * 4), t0, .3 * g)
    elif typ == 'pluck':     # nada lembut (mis. awal caption); e.note = nomor MIDI
        f = hz(int(e.get('note', 76))); t = tt(1.4)
        add((np.sin(2 * np.pi * f * t) + .2 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 3) * np.minimum(1, t / .01), t0, .06 * g)
    elif typ == 'rise':      # nada naik tegang; e.dur
        d = float(e.get('dur', 3)); t = tt(d)
        add(np.sin(2 * np.pi * (220 + 160 * t / d) * t) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .3), t0, .05 * g)
    elif typ == 'bubbles':   # desis/gelembung; e.dur
        d = float(e.get('dur', 3)); t = tt(d)
        add(noise(d, 30) * (.6 + .4 * np.sin(2 * np.pi * 7 * t) ** 2) * np.minimum(1, t / .4) * np.minimum(1, (d - t) / .4), t0, .08 * g)
    elif typ == 'coin':
        add(blip(2637, 2637, .25, .18 * g, 10), t0); add(blip(3520, 3520, .3, .14 * g, 10), t0 + .05)
    elif typ == 'end':
        for i, f in enumerate([523, 659, 784, 1047]): add(blip(f, f, .5, .18 * g), t0 + .5 + i * .1)
    else:
        print(f'  peringatan: jenis efek "{typ}" tidak dikenal, dilewati')


for ev in data.get('events', []):
    sfx(ev)

out *= np.minimum(1, T_ALL / .5) * np.minimum(1, (DUR - T_ALL) / 1.5)
peak = np.max(np.abs(out)) or 1
out = out / peak * .85
pcm = (np.stack([out, np.roll(out, 300)], axis=1) * 32767).astype(np.int16)
with wave.open(dst, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f'audio ok: {DUR:.1f} dtk, {len(data.get("events", []))} efek, musik={style}')
