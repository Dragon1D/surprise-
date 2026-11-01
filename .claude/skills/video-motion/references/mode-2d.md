# Mode 2D (SVG)

Template: `assets/templates/2d/index.html`. Contoh lengkap: `assets/examples/katak-di-panci/` (perumpamaan → konsep psikologi → grafik → penutup; karakter katak, panci, api, termometer, uap, gelembung). Catatan: contoh lama itu memakai `music.py` terpisah; untuk proyek baru pakai `AUDIO_EVENTS`/`MUSIC` seperti di template.

## Struktur template
- `C` — palet. Ganti dulu sebelum menggambar.
- Helper: `prog(t,a,b)` 0..1, `eout/eio/back` easing, `rnd(i)` acak deterministik, `txt(x,y,s,opsi)`, `popIn(t, mulai, x, y, isiSVG)`.
- `SCENES = [{a, b, sfx, draw(l, t)}]` — `l` waktu lokal adegan. Return string SVG. Fade antar adegan otomatis.
- `CAPS = [[mulai, selesai, 'teks|baris2', {y, size}]]` — kata muncul satu per satu; `*merah*`, `_hijau_`, `^kuning^`.
- `AUDIO_EVENTS` dibangun otomatis dari `sfx` adegan + pluck tiap caption; tambahkan efek khusus manual.

## Pola menggambar
- Karakter = fungsi `nama(o)` yang menerima posisi, skala, ekspresi (`eyes`, `mouth`, `tint`, `sweat`) dan return `<g transform>`; lihat `frog()` di contoh katak. Gaya: isi warna rata + outline krem 5 px, sudut membulat.
- Lapisan kedalaman: gambar belakang → isi → depan (contoh: dinding belakang panci → katak → air semi transparan → dinding depan).
- Zoom kamera: bungkus adegan dengan `translate(cx cy) scale(k) translate(-cx -cy)`.
- Partikel (uap, gelembung, debu): loop `i` dengan fase `(t*kecepatan + rnd(i)) % 1`.
- Grafik: batang tumbuh `h * back(prog(...))`, nilai berubah dengan `lerp` + label angka.
- Teks panjang/wrapping lebih mudah di HTML; SVG `<text>` tidak membungkus otomatis — pecah baris manual dengan `|`.

## Jebakan umum
- Elemen yang muncul di detik `a` tapi caption menutupinya → cek preview di detik itu.
- Font tebal lebih lebar dari perkiraan; sisakan margin 40 px kiri-kanan.
- `filter` (drop shadow) di banyak elemen memperlambat render; pakai di caption/judul saja.
