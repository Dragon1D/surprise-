"""make_cues_kai.py — satu-satunya sumber waktu intro & outro YouTube Tanya Kai.
Keluaran: cues_kai.json (dibaca komposisi Remotion) + events_intro.json / events_outro.json (dibaca studio_audio.py).
Jalankan dari folder ini: python3 make_cues_kai.py
"""
import json, subprocess, numpy as np

FPS = 30
VO = {'intro': '../vo/intro-kai.mp3', 'outro': '../vo/outro-kai.mp3'}

def pcm(path, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768, sr

def lip(path, offset, dur):
    """Amplop bukaan mulut 0..1 per frame (RMS dihaluskan), sudah digeser ke posisi VO."""
    x, sr = pcm(path)
    hop = sr // FPS
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    rms = np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1)
    sm = np.convolve(rms, [.25, .5, .25], 'same')
    out = np.zeros(int(round(dur * FPS)))
    o = int(round(offset * FPS))
    out[o:o + len(sm)] = sm[:max(0, len(out) - o)]
    return [round(float(v), 3) for v in out]

C = {}
# ---------- INTRO 5 dtk ----------
vo_i = .6   # VO mulai
C['intro'] = {
    'dur': 5.0, 'vo': vo_i,
    'enter': .05, 'wave': [vo_i + .2, vo_i + 1.3],
    'ngeh': vo_i + 2.25,          # "masa sih?!" ±2,2–2,75 dtk di file VO
    'title': vo_i + 2.75, 'tag': vo_i + 3.1, 'exit': 4.6,
    'lip': lip(VO['intro'], vo_i, 5.0),
}
# ---------- OUTRO 20 dtk ----------
vo_o = 1.0
# segmen kalimat dari jeda hening di file VO (detik di file), lalu digeser vo_o
seg = [(0.26, 1.69, 'Gimana, masih nggak percaya?'),
       (2.05, 4.82, 'Kalau kamu punya pertanyaan aneh, tulis di komentar.'),
       (5.16, 8.70, 'Siapa tahu, video berikutnya Kai yang jawab.'),
       (9.01, 10.97, 'Jangan lupa subscribe, biar nggak ketinggalan fakta nyeleneh lainnya.'),
       (11.29, 12.42, 'Dikit, tapi nempel.'),
       (12.73, 13.13, 'Dadah!')]
C['outro'] = {
    'dur': 20.0, 'vo': vo_o,
    'lines': [[round(a + vo_o, 2), round(b + vo_o, 2), s] for a, b, s in seg],
    'enter': .1, 'frames': 1.2, 'point': 9.01 + vo_o, 'bye': 12.73 + vo_o, 'fade': 19.4,
    'lip': lip(VO['outro'], vo_o, 20.0),
}
# ---------- GABUNGAN (satu adegan, Kai muncul sekali) ----------
vo_o2 = 5.0   # VO outro mulai setelah Kai pindah posisi
dur_c = round(13.13 + vo_o2 + .9, 2)   # selesai ±0,9 dtk setelah VO habis
lipI, lipO = lip(VO['intro'], vo_i, dur_c), lip(VO['outro'], vo_o2, dur_c)
C['combo'] = {
    'dur': dur_c, 'voI': vo_i, 'voO': vo_o2,
    'enter': .05, 'wave': [vo_i + .2, vo_i + 1.3], 'ngeh': vo_i + 2.25, 'title': vo_i + 2.75, 'tag': vo_i + 3.1,
    'morph': [4.3, 5.0], 'frames': 5.3,
    'lines': [[round(a + vo_o2, 2), round(b + vo_o2, 2), t] for a, b, t in seg],
    'point': 9.01 + vo_o2, 'bye': 12.73 + vo_o2, 'fade': dur_c - .55,
    'lip': [round(max(a, b), 3) for a, b in zip(lipI, lipO)],
}
json.dump(C, open('cues_kai.json', 'w'))

# ---------- SFX & musik (studio_audio.py) ----------
def ev(t, typ, **k): return dict(t=round(t, 3), type=typ, **k)
I = C['intro']
e_i = [ev(0, 'whoosh', d=.45, f0=400, f1=3000, gain=.6), ev(.4, 'pop', gain=.8), ev(.45, 'thud', gain=.5),
       ev(I['ngeh'] - .9, 'riser', d=.9, gain=.4), ev(I['ngeh'], 'sparkle', gain=.9), ev(I['ngeh'], 'bell', f=1568, gain=.5),
       ev(I['ngeh'], 'clap', gain=.5), ev(I['title'], 'pop', gain=.8), ev(I['title'] + .12, 'pop', gain=.7),
       ev(I['tag'], 'pluck', note=84, gain=.8), ev(I['exit'] - .1, 'whoosh', d=.45, gain=.7)]
json.dump({'duration': I['dur'], 'events': e_i, 'music': {'engine': 'studio', 'bpm': 120, 'bars': ['C', 'G', 'Am', 'F'], 'final': 4.6, 'final_chord': 'C', 'arp_from': 0, 'hat_from': .5, 'clap_from': I['ngeh'], 'volume': .8, 'sfxGain': 1}}, open('events_intro.json', 'w'))
Q = C['outro']
e_o = [ev(0, 'whoosh', d=.5, gain=.6), ev(.45, 'pop', gain=.8), ev(Q['frames'], 'pop', gain=.6), ev(Q['frames'] + .15, 'pop', gain=.6),
       ev(Q['point'], 'pluck', note=79, gain=.7), ev(Q['bye'], 'sparkle', gain=.8), ev(Q['fade'] - .3, 'bell', f=1318, gain=.4)]
json.dump({'duration': Q['dur'], 'events': e_o, 'music': {'engine': 'studio', 'bpm': 110, 'bars': ['F', 'C', 'Dm', 'Bb'], 'final': 19.0, 'final_chord': 'F', 'arp_from': 0, 'hat_from': 1, 'clap_from': 99, 'volume': .7, 'sfxGain': .9}}, open('events_outro.json', 'w'))
K = C['combo']
e_c = [ev(0, 'whoosh', d=.45, f0=400, f1=3000, gain=.6), ev(.4, 'pop', gain=.8), ev(.45, 'thud', gain=.5),
       ev(K['ngeh'] - .9, 'riser', d=.9, gain=.4), ev(K['ngeh'], 'sparkle', gain=.9), ev(K['ngeh'], 'bell', f=1568, gain=.5), ev(K['ngeh'], 'clap', gain=.5),
       ev(K['title'], 'pop', gain=.8), ev(K['title'] + .12, 'pop', gain=.7), ev(K['tag'], 'pluck', note=84, gain=.8),
       ev(K['morph'][0], 'whoosh', d=.6, f0=600, f1=2500, gain=.5), ev(K['frames'], 'pop', gain=.6), ev(K['frames'] + .15, 'pop', gain=.6),
       ev(K['point'], 'pluck', note=79, gain=.7), ev(K['bye'], 'sparkle', gain=.8)]
json.dump({'duration': K['dur'], 'events': e_c, 'music': {'engine': 'studio', 'bpm': 120, 'bars': ['C', 'G', 'Am', 'F'], 'final': K['dur'] - 1.0, 'final_chord': 'C', 'arp_from': 0, 'hat_from': .5, 'clap_from': K['ngeh'], 'volume': .72, 'sfxGain': 1}}, open('events_combo.json', 'w'))
print('cues ok', {k: (v['dur'], len(v['lip'])) for k, v in C.items()})
