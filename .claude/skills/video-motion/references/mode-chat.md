# Mode Chat + Karakter

Template: `assets/templates/chat/` (`index.html`, `chat.js`, `chat.css`) — ini adalah video "Kok Bisa?": tokoh di kamar → notifikasi → gelembung pikiran → flashback chat (atas) + reaksi tokoh (bawah) → balik ke kamar → solusi → kartu penutup. Contoh lain: `assets/examples/chat-dompet/` (chat layar penuh, avatar dompet makin kurus, hook "POV").

## Mesin chat (`chat.js`)
`createChat(elemen, SCRIPT, {start, saldo, gaji})` → `{renderAt(tLokal), items, audio, end}`. Panggil `renderAt` dengan waktu lokal (t − offset), dan tambahkan `audio` ke `AUDIO_EVENTS` dengan offset yang sama.

Baris naskah (`SCRIPT`), dijalankan berurutan; waktu dihitung otomatis dari panjang teks:
| Baris | Arti |
|---|---|
| `{date: '25 OKT · HARI GAJIAN', clock: '09.02'}` | pemisah tanggal + set jam |
| `{card: '👟 Sepatu lari', label: 'CHECKOUT BERHASIL', amt: -749000, fast?}` | kartu transaksi; saldo di header ikut berubah |
| `{card: '🐷 Ke Tabungan', label: 'TABUNGAN DULUAN', amt: -1600000, save: true}` | kartu hijau "menabung" |
| `{d: 'teks', typ: .6, wait?}` | pesan dari Dompet (dengan indikator mengetik `typ` detik) |
| `{k: 'teks', wait?}` | pesan dari Kamu (diketik di kolom input dulu) |
| `{voice: '(keterangan)', dur: 2.8}` | pesan suara dengan gelombang berjalan |
| `{rekap: true, title: 'REKAP 9 HARI', typ, wait}` | kartu rekap kebutuhan / keinginan / tabungan (dihitung dari saldo dan `opts.gaji`) |
| `react: 'shock'` (di baris mana pun) | ekspresi tokoh saat baris itu muncul |

Nama kontak "Dompet", avatar dompet (gemuk ↔ kurus mengikuti saldo/GAJI), baterai, dan jam dikelola otomatis. Untuk tokoh lain (mis. "Kartu Kredit", "Celengan"), ubah header di `createChat` dan fungsi `wallet()`.

## Tokoh manusia (`human(expr, t, bounce)` di template index.html)
Ekspresi: `scroll, neutral, happy, smug, cringe, shock, guilty, facepalm, think, idea, proud`. Ekspresi baru: tambahkan entri di objek `EX` (eyes: dot/arc/lid/squeeze/big/side/up/sparkle/none; mouth: smile/flat/grin/smirk/teeth/O/wobble/down/pursed; hand: face/chin/point; phone, sweat, blush, pale, bulb). Ganti penampilan lewat palet `P` (skin, hair, hood) dan path rambut — mis. versi berhijab: ganti path rambut dengan bentuk kerudung yang menutup telinga & leher.

`room(t, {clock})` menggambar kamar (jendela + bulan, poster, lampu tidur, jam, ranjang). `thought(cx, cy, teks, k, ekor)` = gelembung pikiran. `panel()` = tokoh dipotong di setengah bawah untuk mode reaksi + angka minus melayang.

## Timeline di index.html
`FB0` mulai flashback, `FB_END = FB0 + chatA.end + .2`, `R2` kembali ke kamar, `AF0` adegan sesudahnya, `E0` penutup. `KEYS` = urutan ekspresi (gabungan manual + `react` dari naskah). Ubah teks hook di `notifBanner`, caption di `CAPS`, penutup di `#end`.

## Nama seri
- **Kok Bisa?**: tokoh di kamar + flashback chat + reaksi (template ini). Tag penutup `KOK BISA? · EPS. NN`.
- **Curhat Dompet**: chat layar penuh dengan Dompet, hook "POV" (contoh `chat-dompet`). Tag `CURHAT DOMPET · EPS. NN`.
Naikkan nomor episode dan cek repo untuk episode yang sudah ada.

## Teks khusus episode yang WAJIB diganti saat bikin episode baru
Template berisi detail episode 1; periksa semua sebelum pratinjau (grep teksnya):
`notifBanner` (isi notifikasi + nominal), `CAPS` (caption kamar), `thought(...)` teks gelembung, label chip (`'💭 9 HARI SEBELUMNYA'`, `'📅 GAJIAN BERIKUTNYA'`), `title` rekap, `opts.gaji`, jam di `room(t, {clock})` / `panel(..., clock)` agar cocok dengan jam di chat, serta isi `#end` (tag seri, judul, paragraf, CTA). Kartu jenis baru (mis. cicilan "Rp0 hari ini + Rp149rb/bln") boleh ditambahkan di `chat.js`; jaga semua angka konsisten.

## Tips
- Panel chat 800 px atas cukup untuk ±6 bubble; ritme ideal 0,6–1,2 dtk per item.
- Angka harus konsisten: saldo akhir = jumlah semua `amt`. Rekap memakai saldo itu.
- Untuk video lebih pendek, kurangi kartu `fast` berderet, bukan memperpendek waktu baca.
