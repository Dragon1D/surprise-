# Mode 3D (Three.js r160, lokal)

Template: `assets/templates/3d/index.html` — toples tabungan + koin jatuh (bounce), HP dengan koin terbang, grafik batang 3D; caption HTML di atas canvas.

## Cara kerja
- Three.js dan add-on disajikan oleh `render.cjs` di `/lib/` (dari `assets/lib/`) lewat importmap: `import * as THREE from 'three'` dan `three/addons/...`. Tersedia: `geometries/RoundedBoxGeometry.js`, `loaders/GLTFLoader.js`, `utils/BufferGeometryUtils.js`, `environments/RoomEnvironment.js`. Butuh add-on lain → salin dari paket npm `three@0.160.0` (`npm pack three@0.160.0`) ke `assets/lib/addons/` dengan struktur folder yang sama.
- Halaman 3D **harus dibuka lewat render.cjs** (server http lokal); `file://` memblokir ES module.
- WebGL jalan di Chromium headless via SwiftShader (CPU). Template ±0,25–0,35 dtk/frame → video 60 dtk ≈ 8–10 menit render; jalankan render penuh di background (`run_in_background`) dan kerjakan hal lain sambil menunggu.
- Kecepatan: canvas default dirender 720p (`?pr=1`) lalu di-upscale; `--pr 1.5` untuk tajam penuh (±2x lebih lambat). `MeshPhysicalMaterial` dengan `transmission` sangat mahal (merender adegan dua kali) — untuk kaca pakai `MeshStandardMaterial` transparan (opacity .3, depthWrite false). Bayangan PCFSoft relatif murah. Hindari post-processing.

## Struktur template
- Renderer: ACES tone mapping, sRGB, bayangan PCFSoft, `RoomEnvironment` untuk pantulan lembut, fog senada background.
- Cahaya: hemisphere + key light (bayangan) + rim light kebiruan.
- Helper: `mat(warna, opsi)`, `mesh(geo, mat, parent)`, `textTexture(teks, {w, h, bg, color, font})` untuk label/layar, `coin()`.
- `SCENES = [{a, b, show: [objek], sfx, update(l, t)}]` — `update` mengatur posisi objek dan kamera dari waktu lokal; objek di luar `show` disembunyikan.
- Caption: `CAPS = [[mulai, selesai, html, {y, size}]]` di layer `#ui` (HTML, tajam & mudah wrap).

## Pola animasi
- Kamera: `camera.position.set(...)` + `lookAt(...)` per frame; orbit = `sin(l*kecepatan)`; dolly masuk = `lerp` jarak dengan `eio`.
- Portrait 9:16 sempit secara horizontal: FOV 40–45 dan jarak kamera ~10 untuk objek selebar ±4 unit. `lookAt` lebih tinggi dari pusat objek = objek turun di frame (sisakan ruang caption di atas).
- Jatuh/mendarat: `lerp(tinggi, posisiAkhir, bounce(k))`. Muncul: `scale = back(k)`. Tumpukan: posisi y = indeks × tebal.
- Gaya "toy/clay" dari primitif terlihat rapi: RoundedBox, Cylinder, Sphere, Torus, Capsule dengan `roughness .4–.6`, warna jenuh, bayangan lembut.
- Model .glb dari user: `new GLTFLoader().loadAsync('model.glb')` lalu set `window.READY` = promise itu sebelum render.
- Teks 3D: pakai `textTexture` pada plane/sprite, atau caption HTML. (TextGeometry butuh file font JSON — tidak dibundel.)

## Jebakan umum
- Koin/objek metalik tampak gelap → turunkan `metalness` (.2–.3) atau tambah `emissive` lembut.
- Tekstur gepeng → sesuaikan rasio canvas (`w`,`h`) dengan rasio permukaan.
- Objek keluar frame karena FOV portrait → cek preview tiap adegan, terutama awal & akhir gerakan kamera.
