#!/usr/bin/env python3
"""Gabung SATU file narasi (mis. hasil ElevenLabs sekali generate) ke video.

File dipotong otomatis per kalimat di jeda hening, lalu tiap kalimat ditaruh
di detik mulainya sesuai narasi.srt. Kalimat yang lebih panjang dari slotnya
dipercepat (atempo, nada tidak berubah). Musik video tetap, hasil dinormalisasi.

Pemakaian:
  python3 gabung-vo.py <folder-proyek> --vo narasi.mp3 [--video X-untuk-vo.mp4]
                       [--srt narasi.srt] [--out X-dengan-vo.mp4] [--cek]

Cara memilih titik potong: semua jeda hening jadi kandidat. Karena jeda koma di
dalam kalimat bisa sepanjang jeda antarkalimat, potongan dipilih dengan
pemrograman dinamis: posisi potong harus dekat dengan perkiraan dari panjang
teks tiap kalimat di .srt, dan jeda yang lebih panjang lebih diutamakan.
--cek hanya mencetak hasil potongan tanpa merender.
"""
import argparse, glob, os, re, subprocess, sys

def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def dur(path):
    return float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).stdout)

def ts(s):
    h, m, rest = s.split(':'); sec, ms = rest.split(',')
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

def read_srt(path):
    blocks = re.split(r'\n\s*\n', open(path, encoding='utf-8').read().strip())
    out = []
    for b in blocks:
        lines = b.strip().splitlines()
        a, z = [ts(x.strip()) for x in lines[1].split('-->')]
        out.append((a, z, ' '.join(lines[2:])))
    return out

def silences(path, noise, mind):
    err = sh(['ffmpeg', '-nostats', '-i', path, '-af', f'silencedetect=n={noise}dB:d={mind}', '-f', 'null', '-']).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    total = dur(path)
    if len(en) < len(st): en.append(total)
    return list(zip(st, en)), total

def choose_cuts(gaps, a, z, weights, n, wgap=1.0):
    """Pilih n-1 jeda (urut waktu). Biaya per kalimat = selisih relatif panjangnya terhadap
    perkiraan (panjang teks x laju bicara rata-rata), dikurangi bonus panjang jeda."""
    rate = (z - a) / sum(weights)
    exp = [w * rate for w in weights]
    m, k = len(gaps), n - 1
    if m < k: return None
    INF = float('inf')
    seg = lambda L, i: 12 * ((L - exp[i]) / exp[i]) ** 2
    # dp[ki][g]: biaya terbaik bila potongan ke-ki memakai jeda g
    dp = [[INF] * m for _ in range(k)]; prev = [[-1] * m for _ in range(k)]
    for g in range(m): dp[0][g] = seg(gaps[g][0] - a, 0) - wgap * (gaps[g][1] - gaps[g][0])
    for ki in range(1, k):
        for g in range(ki, m):
            for p in range(ki - 1, g):
                c = dp[ki - 1][p] + seg(gaps[g][0] - gaps[p][1], ki) - wgap * (gaps[g][1] - gaps[g][0])
                if c < dp[ki][g]: dp[ki][g], prev[ki][g] = c, p
    g = min(range(m), key=lambda x: dp[k - 1][x] + seg(z - gaps[x][1], n - 1)); path = []
    for ki in range(k - 1, -1, -1):
        path.append(gaps[g]); g = prev[ki][g]
    return path[::-1]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dir'); ap.add_argument('--vo', required=True)
    ap.add_argument('--video'); ap.add_argument('--srt'); ap.add_argument('--out')
    ap.add_argument('--noise', type=float, default=-40); ap.add_argument('--min-gap', type=float, default=0.12)
    ap.add_argument('--potong', help='titik potong manual (dtk, dipisah koma), mis. 3.1,6.3,9.5,12.0,15.8')
    ap.add_argument('--lufs', type=float, default=-15); ap.add_argument('--cek', action='store_true')
    o = ap.parse_args()
    d = o.dir
    video = o.video or (glob.glob(os.path.join(d, '*-untuk-vo.mp4')) or [None])[0]
    srt = o.srt or os.path.join(d, 'narasi.srt')
    vo = o.vo if os.path.isabs(o.vo) or os.path.exists(o.vo) else os.path.join(d, o.vo)
    if not video: sys.exit('video *-untuk-vo.mp4 tidak ditemukan; pakai --video')
    lines = read_srt(srt); n = len(lines); vdur = dur(video)

    sil, total = silences(vo, o.noise, o.min_gap)
    a = sil[0][1] if sil and sil[0][0] <= 0.02 else 0.0           # awal suara
    z = sil[-1][0] if sil and sil[-1][1] >= total - 0.02 else total  # akhir suara
    gaps = [g for g in sil if g[0] > a + 0.05 and g[1] < z - 0.05]
    weights = [len(re.sub(r'[^\w]', '', t)) for _, _, t in lines]
    cuts = [(float(x), float(x)) for x in o.potong.split(',')] if o.potong else choose_cuts(gaps, a, z, weights, n)
    if cuts is None:
        sys.exit(f'Jeda terdeteksi cuma {len(gaps)}, butuh {n - 1}. Minta file dengan jeda lebih jelas antarkalimat '
                 f'(satu kalimat per baris), atau turunkan --noise / --min-gap.')
    bounds = [a] + [x for g in cuts for x in g] + [z]
    segs = [(bounds[2 * i], bounds[2 * i + 1]) for i in range(n)]

    print(f'suara {a:.2f}–{z:.2f} dtk dari {total:.2f} dtk; {len(gaps)} jeda kandidat')
    print(f"{'#':<3}{'potong':>14}{'panjang':>9}{'slot':>7}{'tempo':>7}  teks")
    filt, labels, warn = [], [], False
    for i, ((s0, s1), (st, en, text)) in enumerate(zip(segs, lines)):
        nxt = lines[i + 1][0] if i + 1 < n else vdur - .4
        slot = max(.5, nxt - st - .2)
        L = s1 - s0; tempo = max(1.0, L / slot)
        exp = (z - a) * weights[i] / sum(weights)
        flag = ''
        if tempo > 1.2: flag = '  ⚠ dipercepat >1,2×'; warn = True
        if abs(L - exp) / exp > .4: flag += '  ⚠ panjang beda jauh dari perkiraan teks, cek potongan'; warn = True
        print(f'{i + 1:<3}{s0:>6.2f}–{s1:<6.2f}{L:>8.2f}s{slot:>6.2f}s{tempo:>7.2f}  {text[:48]}{flag}')
        ms = int(st * 1000)
        filt.append(f'[1:a]atrim={s0:.3f}:{s1:.3f},asetpts=PTS-STARTPTS,atempo={min(tempo, 2):.3f},'
                    f'aresample=48000,afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse,adelay={ms}|{ms}[v{i}]')
        labels.append(f'[v{i}]')
    if o.cek: return
    out = o.out or (video.replace('-untuk-vo.mp4', '-dengan-vo.mp4'))
    fc = ';'.join(filt) + f";[0:a]{''.join(labels)}amix=inputs={n + 1}:duration=first:normalize=0," \
         f'loudnorm=I={o.lufs}:TP=-1.5:LRA=11[a]'
    r = sh(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', vo, '-filter_complex', fc,
            '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out])
    if r.returncode: sys.exit(r.stderr)
    print(f'selesai: {out}' + ('  (ada peringatan di atas, dengarkan dulu)' if warn else ''))

if __name__ == '__main__':
    main()
