# Standar studio: video tips 21 detik

Turunan praktis dari `panduan-video-motion.md` (instruksi tetap Deny) untuk seri video tips. Kalau ada yang bertentangan, panduan menang.

## Ringkasan standar gerak & teknis (wajib)
- **CUE tunggal:** semua waktu kejadian di objek `CUE` dalam halaman; `AUDIO_EVENTS` dibangun dari `CUE`, tidak ada angka detik ganda.
- **Tipografi kinetik:** judul per kata, mask-reveal naik dari bawah + rotasi kecil + pegas (overshoot). Hook boleh langsung tampil (frame 0); kata kunci slam (skala ±1,3, getar, ganti warna) di klimaks.
- **Kamera & kedalaman:** tiap adegan push-in 1,00→1,05 + pan kecil + rotasi ≤ 0,8°. Tiga lapis: pola titik (jauh), bentuk datar besar berwarna adegan (tengah), partikel kecil (depan).
- **Fisika:** pegas untuk pop, squash & stretch saat mendarat/menghantam, guncangan layar 14 frame meluruh di tiap impact.
- **Transisi:** setiap batas berbeda (panel berlapis, iris, push, panel menyamping, objek membesar → match-cut), semua dengan `whoosh` + `thud`.
- **Keterbacaan:** teks ≥ 27 px CSS (≥ 40 px final), footer sumber ≥ 24 px CSS (36 px final), warna mute gelap (`#6b6357`), zona aman y 120–1100 px CSS.
- **Audio:** `MUSIC.engine = 'studio'`, drop jatuh di adegan Dampak (breakdown di Inti 2 + build), −14 LUFS, peak ≤ −1,2 dBFS.

Format bawaan untuk **video tips cepat** (seri harian Bokek Anonim dan sejenisnya). Video cerita (30–60 dtk) tetap memakai struktur di `craft.md`.

## Kerangka waktu
21 dtk = 42 beat @120 BPM = **6 adegan × 3,5 dtk** (7 beat). Pergantian adegan selalu tepat di batas 3,5 dtk dan diberi SFX `whoosh` 0,2 dtk sebelumnya.

| # | Adegan | Waktu | VO (±7–8 kata) | Isi wajib |
|---|---|---|---|---|
| 1 | Hook | 0–3,5 | 0,2–3,3 | Teks hook terbaca di frame 0. **Angka konkret tampil di visual** (mis. label "Rp5.000.000" yang menghitung turun), bukan hanya di teks. Klimaks ≤ 2,5 dtk; **kata kunci di judul ikut bereaksi** (getar/membesar/berubah warna) tepat saat klimaks |
| 2 | Bukti / data | 3,5–7 | 3,6–6,9 | Rumus, angka, atau grafik yang menggambar diri. Sumber kecil di bawah (label fakta) |
| 3 | Inti 1 | 7–10,5 | 7,1–10,3 | Satu poin, satu objek metafora, satu angka |
| 4 | Inti 2 | 10,5–14 | 10,6–13,8 | Poin kedua. **Jangan identik dengan adegan 3**: masuk dari arah berlawanan, layout dicerminkan, atau objek berbeda |
| 5 | Dampak | 14–17,5 | 14,1–17,3 | Sebelum → sesudah, atau hasil hitungan. Tanda centang/coret sebagai penutup gerak |
| 6 | CTA | 17,5–21 | 17,6–20,6 | Logo, ajakan simpan/kirim, sumber + "angka = contoh". Fade ke gelap 20,65–21 |

VO total ±45 kata (±2,2 kata/dtk). Buat `narasi.md` + `narasi.srt` dengan timecode di atas.

## Isi tiap 3,5 detik (anti detik mati)
Tidak boleh ada jeda > 1 dtk tanpa sesuatu yang baru masuk. Pola timeline yang terbukti untuk adegan inti:

| Lokal | Kejadian |
|---|---|
| 0–0,4 | judul masuk (per kata, stagger 0,07) + objek utama pop |
| 0,4–2,0 | aksi utama (koin jatuh, bar mengisi), angka menghitung naik |
| 1,0–1,8 | ikon/objek pendukung pop berurutan (stagger 0,2) |
| 2,0–2,3 | angka selesai + pantulan (`income`/`ding`) |
| 2,3–3,2 | rincian muncul sebagai chip satu per satu (stagger 0,3, SFX `pluck` nada naik); ikon terkait menyala saat chip-nya muncul |
| 3,2–3,5 | keluar / transisi |

## Aturan visual (pelajaran QA H1)
- **Urutan lapisan:** teks hook dan label penting digambar **paling akhir**, supaya objek terbang tidak menutupinya.
- **Lintasan objek tidak boleh melewati label.** Batasi lengkung (mis. koin muncul dari samping kartu dan melengkung di bawah label), atau taruh objek di belakang kartu.
- **Metafora harus langsung terbaca.** Kantong uang = karung kain: leher dikerut, kerutan kain di atas tali, tali menjuntai dengan simpul, lipatan kain, bawah lebih sempit dari badan. Uji: kalau ditunjukkan tanpa teks, orang menyebut nama objeknya dengan benar.
- **Angka di layar dibulatkan** saat menghitung (kelipatan 50.000) supaya tidak tampak acak; angka akhir harus persis.
- **Arah transisi bervariasi:** wipe → slide kanan → slide kiri → wipe → zoom. Dua adegan berstruktur sama tidak boleh masuk dari arah yang sama.
- Teks penting minimal 25 px CSS, di dalam zona aman (bukan 120 px teratas / 220 px terbawah). Bar progres 6 segmen di y ±1046.
- Semua elemen bergerak (bob, goyang halus, pantul). Tidak ada "AI slop": tanpa gradien acak, tanpa ikon generik berlebihan, tanpa teks dekoratif yang tidak dibaca.

## Audio
- Musik `upbeat` 120 BPM, drum sampai ±20,5 dtk, + SFX untuk **setiap** kejadian: `swipe` (uang terbang), `minus` (angka turun), `slap` + `boom` (klimaks), `tick` (bar), `pop` (objek), `coin`, `income` (angka selesai), `pluck` (chip), `save`, `end`.
- **Narasi dari Deny = 1 file per video** (sekali generate di ElevenLabs, hemat kredit). Minta teks ditempel 1 kalimat per baris supaya ada jeda. Gabungkan otomatis:
  `python3 <skill>/scripts/gabung-vo.py explainer/<slug> --vo narasi.mp3 --cek` (lihat potongan) lalu tanpa `--cek` untuk render → `<slug>-dengan-vo.mp4`.
  Skrip memotong di jeda hening (dipilih berdasarkan panjang teks tiap baris .srt, jadi jeda koma tidak salah dikira akhir kalimat), menaruh tiap kalimat di detik mulai .srt, mempercepat kalimat yang melebihi slot (atempo, nada tetap), dan loudnorm −15. Kalau ada ⚠, dengarkan; potong manual dengan `--potong 3.1,6.3,...`.
- Dua versi: `<slug>.mp4` (−14 LUFS) dan `<slug>-untuk-vo.mp4` (musik 0,45, gain SFX × 0,7, loudnorm I=−22) untuk ditimpa dubbing.

## Akurasi & caption
- Fakta diberi label: [FAKTA — sumber], [HITUNGAN], [ANGKA CONTOH]. Kalau sumber belum dibuka, tulis "ringkasan pencarian, belum dibuka".
- Batasan penting yang tidak muat di video (mis. "dihitung dari gaji bersih", "20% termasuk bayar utang") **wajib** masuk caption dan komentar sematan.
- Caption per platform mengikuti pola `konten/minggu-01/h1-video-tips-qa-caption.md`: kalimat pertama berisi kata kunci pencarian, rincian angka, ajakan komentar spesifik, disclaimer edukasi, 3–5 hashtag (luas + niche + #bokekanonim), alt text IG, judul YT ≤ 100 karakter.

## QA dari MP4 final (wajib sebelum "selesai")
Lembar kontak padat: `ffmpeg -i out.mp4 -vf "fps=2,scale=180:-1,tile=7x6" -frames:v 1 sheet.jpg` (42 frame, satu per beat). Skor 7 aspek × 10 (hook, kejelasan, ritme, visual, akurasi, audio, CTA). Target ≥ 60/70. Cek:
- [ ] Frame 0 sudah berisi hook + angka konkret
- [ ] Klimaks ≤ 2,5 dtk dan kata kunci judul bereaksi
- [ ] Tidak ada 2 frame berturut-turut (1 dtk) yang identik di tengah adegan
- [ ] Tidak ada objek yang lewat di atas label/teks
- [ ] Adegan 3 dan 4 terlihat berbeda (arah/tata letak)
- [ ] Objek metafora terbaca tanpa teks
- [ ] Angka akhir tepat dan konsisten dengan VO + caption
- [ ] Loudness −14 ±1 LUFS dan peak ≤ −1,2 dBFS (`ffmpeg -nostats -i out.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2`)
- [ ] Tiap transisi & kejadian penting punya SFX; tidak ada frame diam > 0,5 dtk
- [ ] Batasan/caveat ada di caption
