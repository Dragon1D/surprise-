# Craft: cerita, ritme, dan visual

## Struktur 45–60 detik yang terbukti jalan
| Bagian | Durasi | Tujuan |
|---|---|---|
| Hook | 0–3 dtk | Situasi relatable atau pertanyaan yang bikin berhenti scroll ("POV: dompetmu bisa ngechat", notifikasi "Saldo: Rp416.000") |
| Masalah / cerita | 3–35 dtk | Tunjukkan, jangan ceramah: kejadian konkret, angka spesifik, reaksi karakter |
| Titik balik | ~35–42 dtk | Momen sadar: rekap, grafik, konsep psikologi, "tepuk jidat" |
| Solusi | ~42–52 dtk | Satu aksi yang jelas dan bisa langsung dilakukan |
| Penutup / CTA | 4–6 dtk | Kalimat kunci besar + ajakan simpan/kirim ke teman |

## Versi pendek (15–40 detik)
- 15–25 dtk: hook (0–2) → 2–3 ketukan inti (1 visual + 1 caption per ketukan) → penutup 3 dtk. Satu pesan saja.
- 30–40 dtk: hook (0–4) → cerita/flashback ±14 dtk (4–6 kejadian) → titik balik ±4 dtk → solusi ±6 dtk → penutup 4 dtk.
Pangkas jumlah kejadian, jangan mempercepat waktu baca caption.

## Ritme & keterbacaan
- Caption: maks ~7 kata per baris, 2 baris. Durasi tampil ≈ 0,4 dtk + 0,03 dtk/huruf (minimal 0,8 dtk). Video tanpa suara harus bisa diikuti dari teks saja.
- Ganti sesuatu di layar tiap 1,5–3 dtk (objek baru, ekspresi, angka, kamera) — layar diam = scroll.
- Ukuran teks minimal ~26 px CSS (≈39 px final); caption utama 44–60 px, judul 80–96 px.
- Jaga zona aman: hindari teks penting di 120 px teratas dan 220 px terbawah (tertutup UI Reels/TikTok).
- Animasi masuk: `back()` (sedikit overshoot) untuk pop, `eout()` untuk gerak, `eio()` untuk kamera/zoom. Transisi antar adegan 0,3–0,6 dtk (fade, zoom ke gelembung pikiran, swipe, flash putih).
- Detail kecil yang bikin senyum (poster "GOALS 2026" yang belum dicentang, jam 00.47 saat checkout) menaikkan share.

## Keaslian (penting)
Kalau user memberi video referensi: tiru **teknik** (ritme, caption kata per kata, gaya flat), bukan **isinya**. Ganti perumpamaan, karakter, nama seri, palet, dan struktur bila terlalu mirip. Jangan pakai nama/handle/watermark kreator lain atau logo aplikasi asli (WhatsApp, bank tertentu) — buat versi generik ("M-BANKING", aplikasi chat dengan desain sendiri). Bila user bilang "masih mirip", ubah **format**, bukan cuma warna (mis. dari explainer → simulasi chat → karakter + flashback).

## Palet siap pakai
- Malam/kamar: bg `#2b2653→#3d3576`, aksen `#ffd84d`, coral `#ef6f50`, ungu `#7d70ff`.
- Krem/chat: bg `#f4ede1`, ink `#1d1b26`, ungu `#5b4bff`, merah `#e5483b`, hijau `#1fa971`.
- Navy sinematik: `#06090f→#141d36`, krem garis `#efe6d2`, merah `#e5483b`, amber `#f0b23f`.
Satu video = satu palet dominan + 1–2 aksen. Merah = uang keluar/bahaya, hijau = masuk/benar, kuning = sorotan.

## Daftar cek sebelum render penuh
- [ ] Hook muncul < 1 dtk, terbaca tanpa suara
- [ ] Tidak ada teks terpotong / keluar layar / bertabrakan
- [ ] Setiap caption sempat terbaca (cek detik akhirnya di preview)
- [ ] Angka konsisten (saldo, total, rekap) — hitung, jangan kira-kira
- [ ] Penutup punya satu kalimat kunci + CTA
- [ ] Tidak ada branding/nama kreator lain
