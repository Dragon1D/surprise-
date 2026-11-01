"""Bikin musik latar sederhana (pad ambient + efek) untuk video, tanpa sample eksternal.
Hasil: music.wav (57 detik, 44.1 kHz, stereo)."""
import os
import wave

import numpy as np

SR = 44100
DUR = 57.0
N = int(SR * DUR)
t = np.arange(N) / SR
out = np.zeros(N)


def hz(note):
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    n = names[note[0]] + (1 if '#' in note else 0)
    octv = int(note[-1])
    return 440.0 * 2 ** ((n + (octv - 4) * 12) / 12)


def tone(freq, start, length, amp, attack=1.2, release=1.5, harm=(1, .35, .12)):
    i0, i1 = int(start * SR), min(N, int((start + length) * SR))
    tt = np.arange(i1 - i0) / SR
    sig = sum(a * np.sin(2 * np.pi * freq * (k + 1) * tt + k) for k, a in enumerate(harm))
    sig += .5 * np.sin(2 * np.pi * freq * 1.003 * tt)  # detune lembut
    env = np.minimum(1, tt / attack) * np.minimum(1, (length - tt) / release)
    out[i0:i1] += amp * sig * np.clip(env, 0, 1)


# progresi Am - F - C - G, tiap akor 4 detik
chords = [['A2', 'C4', 'E4'], ['F2', 'A3', 'C4'], ['C3', 'E4', 'G4'], ['G2', 'B3', 'D4']]
for i, start in enumerate(np.arange(0, DUR, 4.0)):
    for n in chords[i % 4]:
        tone(hz(n), start - .3 if start else 0, 4.8, .05)

# pluck lembut di awal tiap caption
caps = [3.8, 6.9, 10.2, 12.6, 15.0, 17.3, 19.5, 23.8, 27.2, 29.2, 31.6, 35.2, 37.4, 40.3, 42.4, 47.4, 50.0, 52.9]
melody = ['E5', 'C5', 'A4', 'E5', 'G4', 'D5', 'C5', 'E5', 'A4', 'C5', 'B4', 'G4', 'E5', 'A4', 'C5', 'E5', 'G4', 'C5']
for c, m in zip(caps, melody):
    tone(hz(m), c, 1.6, .05, attack=.01, release=1.5, harm=(1, .2))

# dentuman rendah di pergantian adegan
for s in [3.6, 10.0, 17.0, 22.2, 27.2, 35.0, 40.1, 47.2, 52.9]:
    i0 = int(s * SR); L = int(1.2 * SR); tt = np.arange(min(L, N - i0)) / SR
    out[i0:i0 + len(tt)] += .28 * np.sin(2 * np.pi * (60 - 20 * tt) * tt) * np.exp(-tt * 4)

# nada tegang naik saat air makin panas (17-22 dtk)
i0, i1 = int(17.0 * SR), int(22.2 * SR); tt = np.arange(i1 - i0) / SR
out[i0:i1] += .035 * np.sin(2 * np.pi * (220 + 120 * tt / tt[-1]) * tt) * np.minimum(1, tt / 2) * np.minimum(1, (tt[-1] - tt) / .4)

# desis gelembung (noise disaring kasar) di adegan panci
rng = np.random.default_rng(1)
noise = np.convolve(rng.standard_normal(N), np.ones(30) / 30, mode='same')
bub = np.zeros(N)
for a, b, g in [(3.6, 10.0, 1), (10.0, 17.0, .35), (17.0, 22.2, 1.2), (40.1, 47.2, .6)]:
    m = (t >= a) & (t < b)
    bub[m] = g * np.minimum(1, (t[m] - a) / .4) * np.minimum(1, (b - t[m]) / .4)
out += .06 * noise * bub * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t) ** 2)

# fade in/out & normalisasi
out *= np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 2.5)
out = out / np.max(np.abs(out)) * .8
left = out + .02 * np.roll(out, 600)
right = out + .02 * np.roll(out, 900)
pcm = (np.stack([left, right], axis=1) * 32767).astype(np.int16)
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music.wav')
with wave.open(path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', path)
