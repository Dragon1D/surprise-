# Naskah VO — Bokek Anonim · Sesi #1 · "Bagi gaji jadi 3 kantong" (21 dtk)

**Gaya baca:** santai ala temen (gua-lu), energik tapi nggak teriak. Tempo ±2,2 kata/detik.
**Timing:** tiap kalimat mulai tepat di awal adegan (kelipatan 3,5 dtk, 120 BPM). File `narasi.srt` berisi timecode yang sama untuk dubbing atau subtitle.

| Adegan | Waktu | Narasi | Yang terjadi di layar |
|---|---|---|---|
| 1 Hook | 0,2–3,3 | Gaji lima juta, tapi tanggal sepuluh udah tipis? | Uang terbang satu per satu, label Rp5.000.000 menghitung turun ke Rp1.000.000, kalender lompat ke 10, stempel "TIPIS" jatuh dan kata "tipis" bergetar membesar di 2,5 dtk |
| 2 Data | 3,6–6,9 | Pakai rumus lima puluh, tiga puluh, dua puluh. | Bar 50/30/20 menggambar diri, persen menghitung naik, 3 karung kecil muncul |
| 3 Inti | 7,1–10,3 | Lima puluh persen buat kebutuhan: dua setengah juta. | Koin jatuh ke karung coral, nominal selesai Rp2.500.000 di ±9,0 dtk, ikon rumah/makan/bus, chip kos · makan · transport muncul satu per satu |
| 4 Inti | 10,6–13,8 | Tiga puluh persen keinginan: satu setengah juta. | Masuk dari kiri, tata letak dicerminkan; karung ungu terisi, Rp1.500.000, ikon kopi/tiket/belanja, chip nongkrong · jajan · langganan |
| 5 Dampak | 14,1–17,3 | Dua puluh persen masa depan: satu juta. Pindahin duluan. | "Sebelum: nabung dari sisa = Rp0" dicoret → "Sesudah: nabung duluan = Rp1.000.000" ✓ |
| 6 CTA | 17,6–20,6 | Simpan, terus coba gajian depan. | Logo Bokek Anonim memantul, tombol "Simpan" ditekan → "Tersimpan" |

Total 45 kata.

## Fakta & label
| Klaim | Label | Sumber | Keyakinan |
|---|---|---|---|
| Rumus 50/30/20 (kebutuhan/keinginan/tabungan) dipopulerkan lewat buku *All Your Worth* karya Elizabeth Warren & Amelia Warren Tyagi (umumnya disebut terbit 2005) | [FAKTA — ringkasan pencarian, halaman belum dibuka] | [Bankrate](https://www.bankrate.com/banking/what-is-the-50-30-20-rule/), [Quicken](https://www.quicken.com/blog/how-budget-your-money-elizabeth-warrens-50-20-30-rule/) | Sedang–tinggi (banyak sumber sepakat; tahun terbit sedikit beda antar sumber, jadi tahun tidak ditampilkan di video) |
| Gaji Rp5 jt → Rp2,5 jt / Rp1,5 jt / Rp1 jt | [HITUNGAN] 50%, 30%, 20% × Rp5.000.000 | — | Tinggi |
| "Gaji Rp5 jt" | [ANGKA CONTOH] ditulis "gaji = contoh" di layar penutup | — | — |

## Versi audio
- `h1-tiga-kantong.mp4`: musik + SFX penuh (siap upload tanpa VO).
- `h1-tiga-kantong-untuk-vo.mp4`: musik lebih tipis supaya suara dubbing jelas; tinggal tempel rekaman VO.
- `h1-tiga-kantong-dengan-vo.mp4`: **versi final dengan narasi ElevenLabs** (`vo/vo1–vo6.mp3`), tiap kalimat di awal adegannya; kalimat 5 dipercepat 1,1×. Buat ulang dari 1 file narasi: `python3 .claude/skills/video-motion/scripts/gabung-vo.py explainer/h1-tiga-kantong --vo narasi.mp3`. −15 LUFS.
