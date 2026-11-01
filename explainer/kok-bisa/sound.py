"""Bikin audio video dari events.json (ditulis render.cjs):
beat lo-fi + efek adegan kamar (notif, kaget, whoosh, tepuk jidat, ide) dan efek chat."""
import json
import os
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
data = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
DUR = data['duration']
N = int(SR * DUR)
MUS = data.get('music') or {'drumsFrom': 0, 'drumsTo': DUR}
out = np.zeros(N)
rng = np.random.default_rng(7)


def add(sig, at, gain=1.0):
    i0 = int(at * SR)
    if i0 >= N:
        return
    sig = sig[: N - i0]
    out[i0:i0 + len(sig)] += gain * sig


def env_t(sec):
    return np.arange(int(sec * SR)) / SR


def blip(f0, f1, sec, gain):
    t = env_t(sec)
    f = np.linspace(f0, f1, len(t))
    return gain * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18) * np.minimum(1, t / .003)


def hz(n):
    return 440 * 2 ** ((n - 69) / 12)


# ---------- beat lo-fi (84 bpm) ----------
bpm = 84
beat = 60 / bpm
chords = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]  # Am7 Fmaj7 Cmaj7 G7
bar = beat * 4
t_all = np.arange(N) / SR
end_at = next(e['t'] for e in data['events'] if e['type'] == 'end')
for b in range(int(DUR / bar) + 1):
    for n in chords[b % 4]:
        t = env_t(bar + .3)
        sig = (np.sin(2 * np.pi * hz(n) * t) + .3 * np.sin(2 * np.pi * hz(n) * 2.001 * t)) * np.exp(-t * .9)
        add(sig * np.minimum(1, t / .02), b * bar, .022)
    for k in range(4):
        st = b * bar + k * beat
        if not (MUS['drumsFrom'] <= st < MUS['drumsTo']):
            continue
        if k in (0, 2):  # kick
            t = env_t(.35)
            add(np.sin(2 * np.pi * (50 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 9), st, .22)
        else:  # snare lembut
            t = env_t(.2)
            add(rng.standard_normal(len(t)) * np.exp(-t * 22), st, .035)
        for h in (0, .5):  # hi-hat
            t = env_t(.05)
            add(np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t * 80), st + h * beat, .025)
# kresek vinyl
crackle = (rng.random(N) > .9993) * rng.standard_normal(N) * .05
out += crackle

# ---------- efek dari timeline ----------
for e in data['events']:
    t0, typ = e['t'], e['type']
    if typ == 'in':
        add(blip(880, 1320, .12, .30), t0)
        add(blip(1320, 1760, .12, .22), t0 + .07)
    elif typ == 'out':
        add(blip(700, 1050, .1, .22), t0)
    elif typ == 'key':
        t = env_t(.025)
        add(rng.standard_normal(len(t)) * np.exp(-t * 300), t0, .08)
    elif typ == 'date':
        add(blip(520, 520, .25, .10), t0)
    elif typ == 'minus':
        add(blip(1500, 900, .09, .22), t0)
        add(blip(1000, 500, .18, .22), t0 + .08)
        t = env_t(.06)
        add(rng.standard_normal(len(t)) * np.exp(-t * 90), t0, .06)
    elif typ == 'income':
        for i, f in enumerate([1047, 1319, 1568, 2093]):
            add(blip(f, f, .3, .2), t0 + i * .07)
    elif typ == 'delete':
        t = env_t(.25)
        add(rng.standard_normal(len(t)) * np.exp(-t * 14) * np.linspace(1, 0, len(t)), t0, .08)
    elif typ == 'voice':
        # ngos-ngosan: hembusan napas noise yang disaring, naik-turun
        d = e['dur']
        t = env_t(d)
        n = np.convolve(rng.standard_normal(len(t)), np.ones(14) / 14, mode='same')
        breath = np.abs(np.sin(np.pi * t * 2.6)) ** 2
        groan = .25 * np.sin(2 * np.pi * (180 + 30 * np.sin(t * 3)) * t) * breath * (np.sin(np.pi * t * 1.3) > .2)
        add((n * 2.5 + groan) * breath * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .2), t0, .5)
    elif typ == 'save':
        for i, f in enumerate([1319, 1568, 2093, 2637]):
            add(blip(f, f, .35, .2), t0 + i * .06)
    elif typ == 'notif':
        add(blip(1568, 1568, .35, .3), t0)
        add(blip(2093, 2093, .5, .3), t0 + .13)
    elif typ == 'sting':
        t = env_t(1.2)
        sig = sum(np.sin(2 * np.pi * f * t) for f in (110, 165, 220, 233)) * np.exp(-t * 2.5)
        add(sig * np.minimum(1, t / .01), t0, .12)
        add(blip(2400, 1800, .3, .15), t0)
    elif typ in ('whoosh', 'swipe'):
        d = .8 if typ == 'whoosh' else .45
        t = env_t(d)
        n = rng.standard_normal(len(t))
        k = np.linspace(2, 40, len(t)) if typ == 'whoosh' else np.linspace(30, 4, len(t))
        sm = np.array([np.mean(n[max(0, i - int(k[i])):i + 1]) for i in range(len(n))])
        add(sm * np.sin(np.pi * t / d) ** 2, t0, .9)
    elif typ == 'pop':
        add(blip(400, 900, .15, .35), t0)
    elif typ == 'slap':
        t = env_t(.25)
        add(rng.standard_normal(len(t)) * np.exp(-t * 35), t0, .5)
        add(np.sin(2 * np.pi * 140 * t) * np.exp(-t * 25), t0, .4)
    elif typ == 'idea':
        for i, f in enumerate([784, 988, 1175, 1568]):
            add(blip(f, f, .6, .2), t0 + i * .08)
    elif typ == 'end':
        for i, f in enumerate([523, 659, 784, 1047]):
            add(blip(f, f, .5, .18), t0 + .5 + i * .1)

# ducking musik di akhir & fade
out *= np.minimum(1, t_all / .6) * np.minimum(1, (DUR - t_all) / 1.5)
out = out / np.max(np.abs(out)) * .85
pcm = (np.stack([out, np.roll(out, 300)], axis=1) * 32767).astype(np.int16)
with wave.open(os.path.join(HERE, 'sound.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('audio ok', round(DUR, 1), 'detik')
