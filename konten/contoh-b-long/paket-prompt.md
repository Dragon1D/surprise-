# Contoh B (jalur long / video cerita) — paket prompt AI image-to-video

Alur: **Claude** tulis naskah + prompt → **Deny** generate gambar & klip di aplikasi AI → kirim klip ke Claude → **Claude** edit (potong, caption, narasi ElevenLabs, musik, SFX, penutup, QA).

Judul: **"Gajian tanggal 25, tanggal 5 udah nol"** · ±45 dtk · 9:16 · 8 adegan × ±5–6 dtk
Tokoh: **Si Anonim** (orisinal Bokek Anonim — jangan pakai tokoh kreator lain).

## 1. Blok tokoh (tempel di SETIAP prompt gambar, jangan diubah)
```
Si Anonim: a young adult wearing a brown paper grocery bag over the whole head, the bag has two small black dot eyes and a simple line mouth drawn with marker, the top edge of the bag is zigzag folded and slightly crumpled; coral orange hoodie with a front pocket, dark navy jeans, white sneakers, skin-tone hands. Same character in every image.
```
Gaya (tempel juga di setiap prompt gambar):
```
Hand-drawn cartoon illustration, warm painterly comic style, clean dark ink outlines, soft lighting, detailed background, vertical 9:16, no text, no logos, no watermark.
```

## 2. Cara generate (pilih aplikasi yang lu punya)
- **Gambar:** aplikasi text-to-image apa pun yang bisa 9:16 (mis. Hugging Face Space *Qwen-Image* / *FLUX*, atau aplikasi lain).
- **Video:** image-to-video dari gambar adegan (mis. Hugging Face Space *Wan 2.2 I2V*, Kling, Hailuo, Seedance). Durasi 5 dtk per klip.
- Mulai dari **adegan 1**, simpan gambar tokoh yang paling pas → pakai sebagai **gambar referensi** (fitur "reference image"/"character") untuk adegan lain kalau aplikasinya punya, supaya tokoh konsisten.
- Kalau hasil aneh (jari dobel, kantong kepala berubah jadi wajah), ulangi dengan seed lain. Kirim ke gua klip yang paling oke saja, beri nama `adegan-1.mp4` … `adegan-8.mp4`.
- Klip **tanpa suara** tidak masalah — audio gua yang buat.

## 3. Adegan

| # | Narasi (VO) | Prompt gambar (setelah blok tokoh + gaya) | Prompt gerak (video) |
|---|---|---|---|
| 1 | Tanggal 25. Gajian. Rasanya kayak sultan. | Si Anonim jumping happily in a small cozy rented bedroom, holding a smartphone showing a big green notification bubble, warm morning light from the window, calendar on the wall. | The character jumps with joy and pumps a fist, hair-like bag edge bouncing, camera slowly pushes in, natural cartoon motion. |
| 2 | Tanggal 26, "self reward" dikit. | Si Anonim sitting on the bed scrolling a shopping app, several delivery boxes stacked around, evening lamp light. | The character taps the phone quickly, a new box slides into frame, small happy shoulder wiggle, gentle camera pan right. |
| 3 | Tanggal 28, nongkrong, ngopi, jajan. | Si Anonim at a busy street cafe at night with friends silhouettes, holding an iced coffee, string lights. | The character laughs and raises the coffee cup, friends in background move, bokeh lights twinkle, slow dolly forward. |
| 4 | Tanggal 1, tagihan mulai datang. | Si Anonim standing at the door of the room, many envelopes and bills falling onto the floor, cool daylight. | Envelopes keep falling, the character steps back in surprise with both hands up, camera small shake. |
| 5 | Tanggal 3, cek saldo... | Close-up of Si Anonim looking at the phone screen, room dim, phone glow lighting the paper bag face, eyes drawn as worried. | The character slowly leans closer to the phone, phone light flickers, camera slow push-in, tense mood. |
| 6 | Tanggal 5, nol. Kok bisa? | Si Anonim sitting on the floor against the bed, slumped, empty wallet open on the floor, dark blue night light through window. | The character sighs, shoulders drop, head tilts down, curtains move slightly, very slow camera pull-out, sad atmosphere. |
| 7 | Bukan gajinya yang kecil. Duitnya nggak punya rencana. | Si Anonim at a desk at sunrise, writing on a notebook, three small labeled jars-free pouches (no text) in coral, purple and green on the desk. | The character starts writing, then looks up with renewed energy, sunrise light grows warmer, camera slow arc around. |
| 8 | Gajian depan, kasih tiap rupiah tugasnya. | Si Anonim standing on a rooftop at golden hour, city behind, holding the green pouch, confident pose. | The character raises the pouch and gives a thumbs up, wind moves the hoodie, golden light flare, camera slow rise. |

Penutup (dibuat Claude, bukan AI video): layar gelap → "kasih tiap rupiah" / **TUGASNYA** (kuning) + logo Bokek Anonim.

VO total ±60 kata (±45 dtk dengan jeda). Teks siap tempel ke ElevenLabs (1 kalimat per baris):
```
Tanggal dua puluh lima. Gajian. Rasanya kayak sultan.
Tanggal dua puluh enam, self reward dikit.
Tanggal dua puluh delapan, nongkrong, ngopi, jajan.
Tanggal satu, tagihan mulai datang.
Tanggal tiga, cek saldo...
Tanggal lima, nol. Kok bisa?
Bukan gajinya yang kecil. Duitnya nggak punya rencana.
Gajian depan, kasih tiap rupiah tugasnya.
```

## 4. Catatan
- Angka & tanggal = cerita contoh, bukan data.
- Jangan pakai logo aplikasi/bank asli di prompt (sudah ditulis "no logos").
- Kalau aplikasi memberi tanda air (watermark), bilang ke gua — kadang perlu dipotong atau pakai paket tanpa watermark.
