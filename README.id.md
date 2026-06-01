<p align="center">
  <img src="assets/logo.png" width="180" alt="Galyarder Design">
</p>

<h1 align="center">Galyarder Design</h1>

<p align="center">Mesin desain ramah agen (agent-native) berestetika premium untuk Perusahaan Agen (Agentic Company).</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Lisensi Apache 2.0"></a>
  <a href="https://github.com/galyarderlabs/galyarder-design/stargazers"><img src="https://img.shields.io/github/stars/galyarderlabs/galyarder-design" alt="Bintang"></a>
  <a href="https://github.com/galyarderlabs/galyarder-framework"><img src="https://img.shields.io/badge/framework-galyarder-black" alt="Framework"></a>
</p>

<p align="center">
  Sumber terbuka · Lokal-utama · Tanpa akun · BYOK (Bawa Kunci API Sendiri)
</p>

<p align="center"><!-- README language switcher --><a href="README.md">English</a> | <b>Bahasa Indonesia</b></p>

---

Generasi produk berikutnya tidak akan dirancang di klik-klik pixel yang melelahkan. Produk tersebut akan dibangun oleh para founder dan developer yang mendeskripsikan tujuan mereka, dan membiarkan mesin koding ramah agen (agent-native) me-render kode bersih yang siap produksi.

Galyarder Design adalah infrastruktur estetika untuk itu. Ruang kerja premium yang mengutamakan privasi lokal (local-first), mendeteksi agen koding terinstal secara otomatis (Claude Code, Codex, Devin, Cursor, Gemini, dll.), dan mengoordinasikannya melalui Skill khusus, arahan visual deterministik, dan Sistem Desain langsung di penyimpanan lokal Anda. Mengutamakan niat daripada koordinat. Mengutamakan kecepatan daripada ritual.

Tanpa cloud closed-source, tanpa jebakan langganan, dan tanpa kuncian vendor (vendor lock-in). Hanya kekuatan desain murni yang berjalan 100% di mesin lokal Anda.

---

## Ide Dasarnya

Sebagian besar alat desain memperlakukan AI seperti gelembung obrolan (chat bubble) yang melayang di sebelah kanvas. Itu bukan mesin desain; itu hanyalah desainer junior yang berdiri di belakang punggung Anda.

Kekuatan nyata adalah ketika agen koding Anda memiliki lingkungan yang terstruktur. Ketika agen tersebut memahami bahasa desain perusahaan, membaca palet OKLch deterministik, mengikuti daftar periksa kritik mandiri lima dimensi, dan menulis langsung ke sistem file kerja.

Itulah tujuan Galyarder Design dibangun. Kami menghubungkan agen koding lokal terkuat di mesin Anda ke dalam mesin desain teratur yang mengalirkan komponen visual siap produksi.

---

## Cara Kerja

Anda memilih skenario — prototipe, landing page, slide presentasi (deck), dasbor, atau aplikasi seluler. Mesin pendeteksi Galyarder Design mengunci ringkasan (brief) Anda (audiens, nada/tone, skala) sebelum model menulis satu piksel pun.

Jika Anda belum memiliki buku panduan merek (brand book), panel pemilih menyediakan 5 arahan visual pilihan (Editorial Monocle, Modern Minimal, Warm Soft, Tech Utility, Brutalist Experimental). Masing-masing dipetakan ke palet warna deterministik dan susunan font — tidak ada eksperimen bebas dari model.

Agen akan aktif, menyusun rencana `TodoWrite` langsung di UI Anda, membaca template awal di disk lokal, menjalankan pemeriksaan mandiri, dan menghasilkan komponen Anda di dalam iframe terisolasi (sandbox). Ada penyesuaian di babak kedua? Anda dapat menyesuaikan parameter secara langsung di panel penyesuaian (tweaks panel), dan agen akan meregenerasi UI tersebut.

---

## Apa yang Anda Dapatkan

**Ruang kerja ramah agen (Agent-native)**  
UI interaktif langsung yang menampilkan todo list, panggilan alat (tool calls), dan rencana eksekusi secara real-time. Jeda, alihkan, atau sesuaikan di tengah jalan.

**Dukungan CLI Agen**  
Mendeteksi otomatis Claude Code, Codex, Cursor, Devin, Gemini, Hermes, Kimi, OpenCode, Qwen, Qoder, GitHub Copilot CLI, Mistral Vibe, Pi, dan lainnya di dalam `PATH` Anda. Tukar mesin koding Anda dengan satu klik.

**150+ Sistem Desain Bawaan**  
Template awal, atom, dan token lengkap dari sistem kelas dunia (Linear, Stripe, Supabase, Apple, Airbnb, Tesla, Notion, dan banyak lagi) untuk memastikan semua hasil kerja selaras dengan bahasa produk premium.

**130+ Keahlian Desain Siap Produksi (Skills)**  
Skill siap pakai dalam mode prototipe (landing page, dasbor, tata letak SaaS, prototipe seluler iPhone 15 Pro) dan slide presentasi horizontal.

**Pembuatan Media & Animasi**  
Buat gambar, video teks-ke-sinematik, dan tipografi kinetik HTML-ke-MP4 menggunakan GPT-Image-2, Seedance, dan HyperFrames.

**Lokal-Utama & Mandiri**  
Database SQLite bawaan, penyajian direktori lokal, dan soket IPC POSIX. Semua kode proyek disimpan secara pribadi di ruang kerja Anda.

---

## Memulai Cepat

```bash
git clone https://github.com/galyarderlabs/galyarder-design.git
cd galyarder-design
pnpm install
pnpm tools-dev start
```

Buka **http://localhost:7456** di browser Anda.

**Persyaratan:** Node.js 24, pnpm 10.33.2+

---

## Agen yang Didukung

Claude Code · Codex · Cursor · Devin · Gemini · Hermes · Kimi · OpenCode · Qwen · Qoder · GitHub Copilot CLI · Mistral Vibe · Pi

Jika agen tersebut memiliki CLI dan dapat membaca file, maka agen tersebut dapat bekerja sebagai mesin Galyarder Design Anda.

---

## Tanya Jawab (FAQ)

**Di mana desain saya disimpan?**  
Semua aset proyek, file, gambar, dan HTML berada langsung di dalam direktori lokal Anda. Galyarder Design mengutamakan lokal (local-first) dan tidak mengunggah file Anda ke cloud eksternal mana pun.

**Bagaimana Galyarder Design terhubung ke agen koding saya?**  
Daemon memindai `PATH` shell Anda untuk menemukan executable agen. Saat Anda mengetik perintah, daemon menyiapkan ruang kerja terisolasi (sandbox), menulis persyaratan penemuan, dan mendelegasikan eksekusi ke CLI.

**Bisakah saya menjalankannya tanpa shell desktop Electron?**  
Ya. Menjalankan `pnpm tools-dev start` akan meluncurkan daemon latar belakang yang ringan dan klien web. Anda dapat menggunakannya 100% di dalam browser web Anda (Chrome, Firefox, Safari) dan melewati wrapper Electron sepenuhnya.

---

## Pengembangan

```bash
pnpm tools-dev start     # Mulai semua layanan (daemon + web + desktop) di latar belakang
pnpm tools-dev stop      # Hentikan semua layanan
pnpm tools-dev status    # Lihat status layanan aktif
pnpm tools-dev restart   # Mulai ulang layanan dengan bersih
pnpm tools-dev check     # Jalankan diagnosis cepat
pnpm guard               # Periksa kebijakan dan aturan gaya ruang kerja
pnpm typecheck           # Jalankan pemeriksaan TypeScript ruang kerja
```

---

## Kontribusi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Lisensi

Apache-2.0 © 2026 Galyarder Labs

---

<p align="center">
  Masa depan desain bukanlah menggeser piksel. Melainkan membangun infrastruktur.<br>
  <br>
  Sumber terbuka. Lokal-utama. Dibangun untuk para founder yang berpikir dalam sistem.
</p>
