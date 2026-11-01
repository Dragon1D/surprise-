---
name: panduan-konten-finansial
description: >-
  Pedoman tetap akun sosmed edukasi finansial milik Deny. Isinya target penonton, gaya bahasa gua-lu,
  pilar topik, batasan aturan (OJK, investasi, penipuan), format postingan (video animasi, carousel IG,
  thread), seri yang sudah ada, dan bank ide konten. Pakai skill ini setiap kali menyusun ide konten,
  kalender posting, naskah video, carousel, caption, hook, atau thread bertema uang, nabung, budgeting,
  paylater, pinjol, investasi, atau psikologi uang untuk akun ini, walaupun user tidak menyebut
  "pedoman". Pakai juga sebelum skill video-motion membuat episode baru, supaya gaya dan topiknya
  tetap konsisten.
---

# Panduan Konten Finansial

Pedoman ini berasal dari keputusan Deny (pemilik akun). Ikuti pedoman ini supaya semua postingan terasa datang dari satu akun yang sama. Kalau ada hal yang belum diputuskan (lihat **Pertanyaan terbuka**), tanyakan dulu ke Deny sebelum mengarang. Setiap jawaban baru dicatat ke file ini supaya tidak perlu ditanyakan lagi.

## Penonton (semua segmen, beri label di tiap konten)
| Kode | Segmen | Konteks umum (asumsi, ubah kalau Deny bilang beda) |
|---|---|---|
| M | Mahasiswa | Uang saku ±Rp1–2,5 jt, kerja part-time, jajan, nabung gadget atau liburan |
| FJ | First jobber 22–27 | Gaji ±Rp4–10 jt, gaya hidup mulai naik, paylater, nongkrong. **Segmen inti karakter seri** |
| PK | Pasangan muda / keluarga baru | Nikah, keuangan berdua, anak pertama, rumah |
| PM | Pekerja mapan 28–35 | Lifestyle creep, mulai mikir investasi, pensiun, rumah |

Karena akun menyasar semua segmen, tiap konten tetap harus punya **satu segmen utama**. Konten yang mencoba bicara ke semua orang sekaligus jadi tumpul. Contoh kasus dan nominal disesuaikan dengan segmen itu.

## Gaya bahasa: santai ala temen (gua-lu)
- Bicara seperti teman yang pernah salah juga, bukan guru. Menyindir halus boleh, merendahkan tidak.
- Kalimat pendek dan contoh konkret dengan angka. Lebih baik "kopi 25rb × 22 hari = Rp550rb sebulan" daripada "kurangi pengeluaran kecil".
- Istilah teknis boleh, asal langsung diterjemahkan: "hedonic adaptation (otak cepat bosen sama kenyamanan baru)".
- Hindari nada menghakimi seperti "makanya jangan boros!" dan janji kaya cepat. Ganti dengan "wajar kok, tapi coba ini".
- Contoh hook yang pas: "Gaji 5 juta, kok tanggal 10 udah tipis?", "Checkout jam 2 pagi itu bukan lu, itu capek lu."

## Pilar topik (semua disetujui)
1. **Kebiasaan & budgeting**: nabung, dana darurat, gaya hidup, paylater, langganan, bonus dan THR.
2. **Psikologi uang**: bias, gengsi, FOMO, lifestyle creep, mental accounting.
3. **Konsep investasi umum**: bunga majemuk, inflasi, risiko vs imbal hasil, diversifikasi. Selalu pakai **disclaimer** ("ini edukasi, bukan ajakan beli produk apa pun") dan **jangan sebut produk, emiten, aplikasi, atau rekomendasi beli**. Simulasi angka pakai asumsi hipotetis yang disebut jelas.
4. **Waspada penipuan & pinjol**: investasi bodong, pinjol ilegal, modus APK, OTP. Arahkan penonton ke kanal resmi (OJK). Nama lembaga dan kanal dicek dulu.

Target komposisi: kira-kira 35% kebiasaan, 25% psikologi, 20% investasi umum, 20% penipuan.

## Aturan fakta & keamanan
- Angka statistik, persentase inflasi atau bunga, UMR, harga, dan nama lembaga ditandai **⚠️ cek**, lalu diverifikasi ke sumber resmi sebelum tayang (pakai agent pengecek-fakta kalau tersedia). Hitungan matematis murni boleh langsung dipakai, tapi tetap dihitung ulang.
- Jangan pakai nama, logo, atau tampilan merek asli (bank, aplikasi paylater, e-commerce, aplikasi chat). Pakai versi generik seperti "M-BANKING", "PAYLATER", atau "Dompet".
- Jangan meniru konten kreator lain (cerita, nama seri, watermark). Ambil tekniknya saja.

## Format postingan
| Format | Kapan | Struktur |
|---|---|---|
| 🎬 Video animasi (Reels/TikTok) | Cerita, emosi, momen relatable | Dibuat dengan skill **video-motion**. Hook 0–3 dtk, cerita, titik balik, solusi, CTA. 30–60 dtk |
| 🖼️ Carousel IG (5–10 slide) | Tips, checklist, hitung-hitungan yang layak disimpan | Slide 1 hook besar; slide 2 masalah; slide 3–8 isi (satu poin per slide); slide terakhir ringkasan + CTA simpan/kirim |
| 🧵 Thread / caption panjang | Cerita, opini, diskusi | Kalimat pertama hook; 5–8 poin pendek; tutup dengan pertanyaan ke penonton |

Story interaktif (polling atau kuis) **tidak** dipilih Deny. Jangan dijadikan format utama.

## Seri yang sudah ada
- **Kok Bisa?** (`KOK BISA? · EPS. NN`): tokoh hoodie coral di kamar, masalah uang, flashback chat dengan Dompet, lalu solusi. Eps 01 soal gaji habis tanggal 3; eps 02 (draft uji) soal paylater.
- **Curhat Dompet** (`CURHAT DOMPET · EPS. NN`): chat layar penuh dengan Dompet, hook "POV".
- **Perumpamaan** (contoh: Katak di Panci): explainer 2D, dari perumpamaan ke konsep psikologi.
- **3D**: objek mainan (koin, toples, HP, grafik), contohnya video dana darurat.

## Bank ide
File `konten/bank-ide.csv` (kolom: no, pilar, judul_hook, segmen, format, angle_isi, cta, status) dan `konten/bank-ide.md` (versi bacaan). Status: `ide → naskah → produksi → tayang`.
- Sebelum menambah ide baru, baca bank ide dulu supaya tidak ada duplikat. Lanjutkan penomoran.
- Format satu ide: judul atau hook, segmen utama, format, angle dan isi (1–2 kalimat), CTA, plus tanda ⚠️ cek kalau perlu.
- Setelah konten tayang, ubah statusnya. Kalau Deny memberi angka performa, catat juga.

## Profil akun: Bokek Anonim (diputuskan Deny, 2026-11-01)
Detail ada di `konten/profil/profil-instagram.md`, mockup di `konten/profil/contoh-profil.png`, dan riset brandnya di dokumen [Riset Brand Akun Edukasi Finansial](https://claude.ai/artifact/Gtirj8RkWDKjGuurjw4SMb).
- **Handle:** @bokekanonim. Nama tampilan "Bokek Anonim · Keuangan" (batas Instagram 30 karakter). Ketersediaan handle belum dicek; cadangannya @bokek.anonim dan @bokekanonim.id. Nama lama "Duit Kemana" **tidak dipakai**.
- **Konsep:** parodi kelompok dukungan, dengan pembuka sesi "Halo, gua bokek. Lu juga?". Konten boleh disebut "sesi", misalnya "Sesi #12: paylater". Seri *Kok Bisa?* dan *Curhat Dompet* tetap jalan di dalam akun ini.
- **Nada wajib:** "kita senasib", bukan "lu bokek". Yang disindir kebiasaannya, bukan orangnya. Selalu ada pujian atau semangat saat penonton berhasil. Jangan menertawakan orang yang benar-benar kesulitan, misalnya kena PHK, sakit, atau terjerat pinjol; untuk topik itu nadanya empatik.
- **Logo dan foto profil:** dompet coral berkacamata dan berkumis penyamaran di latar kuning (`konten/profil/foto-profil-bokek-anonim.png`, sumber di `konten/profil/logo-v2/`). Hindari koin dengan grafik naik, daun, perisai, dan warna hijau atau biru ala bank.
- **Palet:** kuning `#ffd84d`, coral `#ef6f50`, krem `#f4ede1`, ink `#1d1b26`, plus ungu `#5b4bff` sebagai aksen. Font Inter.
- **Bio:** teks siap salin untuk Instagram (3 versi), TikTok, YouTube, link di bio, dan caption postingan pertama ada di `konten/profil/bio-lengkap.md`. Versi utama Instagram (146/150): "Halo, gua bokek. Lu juga? 👋 / Tempat pulih buat yang gajinya numpang lewat. / 🎬 Kok Bisa? · Dana darurat · Anti pinjol / Edukasi, bukan jualan produk." **Bio di semua platform tidak boleh memakai kata "dompet"** (keputusan Deny); maskot Dompet tetap dipakai di konten dan logo. Hitung karakter dengan emoji = 2.
- **Highlight:** Mulai Sini, Dana Darurat, Anti Pinjol, Budgeting, Curhat.
- **Cover reels:** label seri kecil berhuruf kapital, lalu judul 2–3 baris dengan satu kata disorot. Grid diselang-seling antara video gelap dan carousel terang.
- **Tag penutup video:** `BOKEK ANONIM · <SERI> EPS. NN`. Label lama "DOMPET BOCOR" di video Katak di Panci harus diganti.

## Rencana posting (keputusan Deny, 2026-11-01)
- **Platform:** Instagram, Facebook, TikTok, YouTube Shorts, dan Threads.
- **Frekuensi:** 3 postingan per hari selama 30 hari, total 90 konten: 2 video dan 1 carousel per hari.
- **Satu tema per hari** (diambil dari bank ide), dikemas jadi 3 format:
  1. **Video cerita** (30–45 dtk): seri *Kok Bisa?* atau sesi curhat.
  2. **Video tips cepat** (15–25 dtk): gaya **2D teks dan animasi**.
  3. **Carousel** (6–8 slide) yang layak disimpan.
- **Distribusi:**
  - Instagram: 2 video + carousel.
  - Facebook: 2 video, dibagikan ulang dari Instagram.
  - TikTok: 2 video + carousel dalam **mode foto**.
  - YouTube Shorts: 2 video.
  - Threads: **versi teks** dari tema hari itu.
- **Narasi (voice over):** Deny akan mencari dubbing sendiri. Setiap video wajib disertai **naskah VO dengan timecode** (`narasi.md` + `narasi.srt`) dengan tempo sekitar 2,3 kata per detik. Caption di layar tetap ada, supaya video bisa dinikmati tanpa suara. Kalau audio dubbing sudah ada, gabungkan dengan ffmpeg (lihat `references/audio.md` di skill video-motion) dan sesuaikan timing kalau perlu.
- **Produksi per minggu:** buat 7 hari (14 video, 7 carousel, 7 thread), minta Deny mengecek, baru lanjut ke minggu berikutnya.
- **Kalender:** `konten/kalender-30-hari.csv` dan Google Sheets di folder Drive "Bokek Anonim". Rencana mingguan ada di `konten/minggu-NN/`.
- **Pengiriman file:** konektor Drive tidak bisa mengunggah video (terlalu besar). Teks dan jadwal disimpan di Drive. Video dan gambar dikirim lewat chat atau halaman unduhan.
- **Auto-posting:** belum ada. Posting manual lewat Meta Business Suite, TikTok Studio, dan YouTube Studio. Konektor TikTok for Business yang tersambung hanya untuk iklan, bukan posting organik.

## Pertanyaan terbuka (tanyakan ke Deny saat relevan, lalu pindahkan jawabannya ke atas)
- Hasil cek ketersediaan handle @bokekanonim di Instagram, TikTok, dan YouTube.
- Wajah brand cukup maskot Dompet, atau Deny ikut tampil (wajah atau suara)?
- Frekuensi posting per minggu dan platform prioritas (Instagram, TikTok, atau keduanya).
- Segmen prioritas kalau harus memilih satu untuk 30 hari pertama.
- Apakah akan ada wajah atau suara Deny (voice over), atau full animasi.
- Tujuan jangka panjang: personal branding, endorse, atau produk sendiri. Ini memengaruhi CTA dan aturan endorse.
