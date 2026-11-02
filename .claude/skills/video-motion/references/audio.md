# Audio (scripts/sound.py)

Semua bunyi disintesis dari nol (numpy) — tanpa sample berlisensi, aman untuk medsos. `render.cjs` menulis `events.json` dari halaman lalu memanggil `sound.py`; hasil dinormalisasi -15 LUFS saat mux.

## window.MUSIC
`{ style, bpm?, drumsFrom?, drumsTo?, volume? }`
- `lofi` (84 bpm, akor jazz + kick/snare lembut + kresek vinyl) — santai, cocok chat/curhat.
- `ambient` (pad panjang, tanpa drum) — sinematik, perumpamaan.
- `upbeat` (112 bpm, hat rapat) — 3D/produk/energik.
- `tense` (akor minor gelap) — adegan masalah.
- `none`.
`drumsFrom/drumsTo`: drum hanya di rentang ini (mis. hook sunyi, drum masuk saat cerita mulai).

## window.AUDIO_EVENTS — jenis efek
| type | bunyi | pakai untuk |
|---|---|---|
| `in` / `out` | blip naik dua nada / satu nada | pesan masuk / terkirim |
| `key` | klik pendek | ketikan |
| `date`, `tick` | nada pendek | pemisah, penanda |
| `minus` | "kaching" turun | uang keluar |
| `income` | arpeggio naik | uang masuk |
| `save`, `coin` | arpeggio terang, denting koin | nabung, koin mendarat |
| `delete` | desis memudar | pesan dihapus |
| `voice` (`dur`) | napas ngos-ngosan | pesan suara lucu |
| `notif` | ding-ding HP | notifikasi |
| `sting` | akor dramatis | kaget |
| `whoosh` / `swipe` (`dur`) | sapuan noise | transisi zoom / geser |
| `pop` | blup | gelembung, objek muncul |
| `slap` | tepukan | tepuk jidat |
| `idea` | arpeggio "ting" | ide / lampu |
| `boom` | dentuman rendah | pergantian adegan |
| `pluck` (`note` MIDI) | petikan lembut | awal caption |
| `rise` (`dur`) | nada naik | ketegangan |
| `bubbles` (`dur`) | desis | air mendidih, latar |
| `end` | arpeggio penutup | kartu akhir |

Semua menerima `gain` (default 1). Jenis baru: tambahkan cabang di fungsi `sfx()`.

## Voice over dari user
Kalau user memberi rekaman narasi: render video seperti biasa, lalu
`ffmpeg -i video.mp4 -i narasi.m4a -filter_complex "[0:a]volume=0.35[m];[m][1:a]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v copy -c:a aac out.mp4`
dan sesuaikan timing caption dengan durasi kalimat di narasi.

## Narasi satu file (ElevenLabs dll.)
Satu file berisi semua kalimat → `scripts/gabung-vo.py <folder> --vo narasi.mp3 [--cek]`. Dipotong otomatis per kalimat dan ditaruh sesuai `narasi.srt`. Detail di `standar-studio.md`.
