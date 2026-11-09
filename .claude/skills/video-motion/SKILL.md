---
name: video-motion
description: >-
  Bikin video motion graphic vertikal (MP4 9:16, 1080x1920, siap Reels/TikTok/Shorts) dari ide atau naskah, lengkap dengan musik dan efek suara buatan sendiri. Tiga mode yang bisa dicampur. 2D: flat vector, caption kata per kata, infografis. Chat: simulasi chat plus karakter yang bereaksi. 3D: Three.js, objek, kamera bergerak, koin, HP, grafik 3D. Pakai skill ini setiap kali user minta video, reel, konten animasi, explainer, motion graphic, video 3D, animasi karakter, atau bilang "bikinin video kayak gini" sambil kirim contoh, walaupun kata "motion" tidak disebut. Pakai juga untuk episode lanjutan seri video yang sudah ada (Kok Bisa?, Curhat Dompet, Katak di Panci) dan untuk mengubah naskah, durasi, warna, atau karakter video yang sudah dirender.
---

# Video Motion

Skill ini mengubah ide menjadi video MP4 vertikal yang bisa langsung diupload. Animasinya berupa halaman web (SVG/HTML/Three.js) yang dihitung **murni dari waktu `t`**. `scripts/render.cjs` lalu memotretnya frame per frame dengan Playwright, menjahitnya dengan ffmpeg, dan menambahkan audio sintetis dari `scripts/sound.py`. Karena tiap frame deterministik, hasilnya bisa dipratinjau di detik mana pun dan dirender ulang sama persis setelah revisi.

## Standar kualitas (instruksi tetap dari Deny)
`references/panduan-video-motion.md` adalah instruksi tetap Deny untuk semua video motion: tanya dulu (Fase 1, satu pesan, lewati yang sudah jelas), riset & label fakta (Fase 2), CUE sebagai satu-satunya sumber waktu (Fase 3), standar gerak setara After Effects (Fase 4), musik + SFX wajib (Fase 6), QA dari MP4 final (Fase 7), laporan maks 8 baris (Fase 8). Baca sebelum membuat video baru.
- **Mesin:** panduan memakai Remotion; skill ini memakai mesin HTML/SVG + Playwright (`render.cjs`) dengan aturan yang setara (deterministik dari t, tanpa CSS animation/Math.random). Remotion boleh dipakai kalau Deny minta (npm registry bisa diakses). Sebutkan mesin yang dipakai di laporan.
- **Audio:** `window.MUSIC = { engine: 'studio', bpm, bars, breaks, build, final, lufs: -14, ... }` memakai `scripts/studio_audio.py` (musik berstruktur, sidechain, SFX impact/thud/clap/bell/sparkle/riser/ticks). Butuh `pip install scipy --break-system-packages`. Target −14 ±1 LUFS, peak ≤ −1,2 dBFS (cek `ebur128=peak=true`).
- **Font:** Poppins 600/800/900 di `assets/fonts/` (OFL). Salin ke `explainer/<slug>/fonts/`, daftarkan dengan `@font-face`, dan set `window.READY = Promise.all([...document.fonts.load(...)])`.
- **Dua jalur (keputusan Deny 2026-11-09):** video **short/tips** = animasi kode (jalur A); video **long/cerita** = klip AI image-to-video yang Deny generate dari paket prompt, lalu diedit di sini (jalur B, contoh paket: `konten/contoh-b-long/paket-prompt.md`).
- **Karakter bertulang (jalur A):** contoh `explainer/contoh-a-anonim/` — tokoh "Si Anonim" (kepala kantong kertas), tungkai rubber-hose (path Q per sendi), pose kunci + campuran (TRIP/AIR/SIT/SLUMP/PUSH/STAND/CHEER) di atas siklus jalan prosedural, kamera mengikuti + push-in emosi, latar berlapis parallax, mood cahaya (redup biru ↔ hangat), caption per frasa, penutup layar gelap + kata kunci kuning.
- **Contoh lengkap standar ini:** `explainer/h1-tiga-kantong/index.html` (CUE, tipografi kinetik mask-reveal + pegas, kamera push-in, 3 lapis parallax, shake, squash, 5 transisi berbeda ber-SFX, audio diturunkan dari CUE).

## Alur kerja

1. **Tangkap brief.** Cari tahu topik dan pesan utama, target penonton, durasi (default 45–60 detik; **video tips cepat = 21 detik standar studio, baca `references/standar-studio.md`**), gaya, dan contoh video kalau ada. Kalau user mengirim video contoh, ambil frame-nya dulu (`ffmpeg -i in.mp4 -vf "fps=1/2.5,scale=240:-1,tile=6x4" grid.jpg`) dan baca strukturnya. Jangan bertanya hal yang bisa diputuskan sendiri dengan wajar.
2. **Tulis konsep dan storyboard singkat** sebelum menulis kode: hook (0–3 detik), urutan adegan dengan detik, naskah caption, dan penutup atau CTA. Baca `references/craft.md` untuk ritme, hook, dan aturan keaslian. Kalau user meminta "kayak video X", ambil gaya umumnya, tapi cerita, karakter, nama seri, dan detail visualnya harus orisinal. Jangan meniru branding atau watermark kreator lain.
3. **Pilih mode** (boleh dicampur dalam satu halaman):
   - Cerita dengan perumpamaan, infografis, atau tipografi kinetik: **2D**, lihat `references/mode-2d.md`.
   - Percakapan, notifikasi, saldo, atau karakter manusia yang bereaksi: **chat dan karakter**, lihat `references/mode-chat.md`.
   - Objek 3D, produk, kamera mengorbit, atau "video 3D": **3D**, lihat `references/mode-3d.md`.
4. **Salin template** ke folder proyek baru (mis. `explainer/<slug>/`), lalu sesuaikan isinya:
   `cp -r <skill>/assets/templates/<2d|chat|3d>/. explainer/<slug>/`
   Contoh lengkap yang sudah jadi ada di `assets/examples/` dan berguna sebagai referensi pola, misalnya karakter katak, panci, atau tokoh di kamar.
5. **Pratinjau sebelum render penuh.** Render penuh makan waktu beberapa menit, sedangkan pratinjau hanya beberapa detik:
   `NODE_PATH=$(npm root -g) node <skill>/scripts/render.cjs explainer/<slug> --preview auto`
   Perintah ini menghasilkan 12 frame dan `preview/sheet.jpg`. **Lihat lembar kontaknya** dengan Read, lalu cek teks terpotong, objek bertabrakan, caption menutupi objek penting, frame kosong, dan elemen di luar layar. Untuk detail, crop satu frame dengan ffmpeg dan lihat ukuran penuhnya. Ulangi sampai bersih. Pakai `--preview 3.5,7,12` untuk detik tertentu.
6. **Render penuh:**
   `NODE_PATH=$(npm root -g) node <skill>/scripts/render.cjs explainer/<slug> [--out nama.mp4]`
   Perkiraan waktu: 2D/chat ±0,1–0,2 dtk/frame (video 60 dtk ≈ 3–6 menit); 3D ±0,3–0,6 dtk/frame (60 dtk ≈ 10–18 menit). Pakai timeout Bash panjang (600000 ms) atau `run_in_background` untuk video 3D > 30 dtk, dan beri tahu user perkiraan waktunya.
   Audio dibuat otomatis dari `window.AUDIO_EVENTS` dan `window.MUSIC`, lalu dinormalisasi ke -15 LUFS.
7. **Verifikasi hasil:** untuk video tips 21 dtk, jalankan QA lengkap di `references/standar-studio.md` (lembar kontak 42 frame, skor 7 aspek, loudness ebur128). Selain itu: `ffprobe` (durasi, 1080x1920, h264 dan aac), lembar kontak dari MP4 final (`ffmpeg -i out.mp4 -vf "fps=1/3,scale=180:-1,tile=9x2" -frames:v 1 cek.jpg`), dan `volumedetect` (mean sekitar -16 sampai -22 dB). Jangan bilang selesai sebelum ini dicek.
8. **Serahkan:** kirim MP4 ke user dengan SendUserFile kalau tersedia. Masukkan `sound.wav` dan `events.json` ke .gitignore, lalu commit sumber dan MP4 kalau bekerja di repo. Ringkas konsep video dalam beberapa poin, sebutkan keterbatasannya (lihat di bawah), dan tawarkan revisi atau episode lanjutan.

## Kontrak halaman (wajib, semua mode)

Halaman `index.html` di folder proyek harus menyediakan:

| Global | Isi |
|---|---|
| `window.DURATION` | durasi total (detik) |
| `window.renderAt(t)` | menggambar frame di detik `t`; boleh async |
| `window.AUDIO_EVENTS` | `[{t, type, ...}]` efek suara (daftar jenis di `references/audio.md`) |
| `window.MUSIC` | `{style: 'lofi'\|'ambient'\|'upbeat'\|'tense'\|'none', bpm?, drumsFrom?, drumsTo?, volume?}` |
| `window.READY` | opsional, Promise kalau ada aset yang perlu dimuat dulu (model .glb, gambar) |

Frame pertama dipakai sebagai thumbnail/cover di banyak aplikasi. Jangan mulai dari layar hitam; hook harus sudah terlihat sejak detik 0.

Stage berukuran **720×1280 px CSS** dan diletakkan di pojok kiri atas saat `?render=1` (template sudah mengurusnya). Renderer memotret dengan skala 1,5, jadi hasil akhirnya 1080×1920.

Aturan yang menjaga hasil stabil: jangan pakai `Date.now()`, `Math.random()`, `requestAnimationFrame`, transisi CSS, atau `@keyframes` untuk animasi yang dirender. Semuanya harus dihitung dari `t`. Untuk keacakan, pakai `rnd(i)` deterministik dari template. Kalau ada smoothing yang bergantung riwayat, simulasikan dari 0 sampai `t` (lihat `scrollAt` di `chat.js`).

## Keterbatasan yang perlu disampaikan

- **Belum ada voice over.** Layanan TTS biasanya tidak bisa diakses dari sandbox. Buat caption yang cukup lama untuk dibaca tanpa suara, lalu sarankan user menambah narasi sendiri atau TTS di CapCut. Kalau ada file suara dari user, mux dengan ffmpeg dan atur timing caption mengikuti durasinya.
- Font yang tersedia adalah Inter (default), JetBrains Mono, dan Noto Color Emoji. Google Fonts belum tentu bisa dimuat.
- Untuk 3D, model .glb dari user bisa dimuat (taruh di folder proyek). Membuat model rumit dari nol tidak realistis, jadi gunakan gaya "toy/clay" dari primitif (box, silinder, torus, rounded box) yang terlihat bagus dan cepat.

## Konten finansial

Kalau videonya untuk akun edukasi keuangan, tetap di jalur kebiasaan (budgeting, nabung, utang konsumtif). Hindari rekomendasi produk investasi spesifik. Angka seperti inflasi, bunga, atau UMR sebaiknya dicek dulu, misalnya lewat agent pengecek-fakta kalau tersedia.
