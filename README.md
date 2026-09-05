# 📚 Pustaka Pangkalan — Sistem Informasi Perpustakaan Digital Desa

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-2ea44f?style=for-the-badge&logo=vercel)](https://perpus-pangkalan.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-00e599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Quality Assurance](https://img.shields.io/badge/STQA_Tests-48%2F48_Passed-success?style=for-the-badge&logo=checkmarx)](https://github.com/ZephyrGraphic/pustaka-pangkalan)

> **Sistem Informasi Perpustakaan Digital Desa Pangkalan**, Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat.  
> Tautan Aplikasi: **[https://perpus-pangkalan.vercel.app](https://perpus-pangkalan.vercel.app)**

---

## 📖 Project Overview

**Pustaka Pangkalan** adalah platform perpustakaan digital desa terpadu yang memadukan akses bacaan modul terapan pedesaan secara digital dengan sistem pencatatan sirkulasi peminjaman buku fisik di balai desa.

Sistem dirancang *mobile-first*, ringan, serta mendukung fitur dwibahasa (**Bahasa Indonesia** dan **Basa Sunda**) untuk mempermudah seluruh lapisan warga di 4 dusun resmi: **Dusun Pangkalan**, **Dusun Cikajang**, **Dusun Pasir Arangan**, dan **Dusun Pasir Gombong**.

---

## ✨ Fitur Unggulan (Actual Features)

### 👤 Modul Warga Desa (Citizen)
- **Autentikasi Ramah Warga**: Pendaftaran dan login cukup menggunakan NIK 16 digit dan PIN 6 digit sederhana (dengan proteksi enkripsi Bcrypt).
- **Katalog & 8 Kategori Tematik**: Modul dikelompokkan ke dalam 8 topik desa: *Pertanian, Budaya Sunda, UMKM, Kesehatan, Teknologi AI, Cerita Anak, Keterampilan Kreatif, dan Agama*.
- **Pembaca E-Book per Bab**: Antarmuka pembaca materi teks per bab yang nyaman di layar ponsel dengan fitur penanda bacaan (*bookmark*).
- **Gamifikasi Literasi**: Membaca modul memberikan poin (+10 poin/bab), catatan *streak*, dan 3 jenjang lencana (*Pembaca Rajin, Cendekia Desa, Pelopor Literasi*) serta papan peringkat desa.
- **Kartu Anggota Digital**: Dilengkapi kode QR dan identitas dusun warga.
- **Asisten Kades AI**: Asisten cerdas terintegrasi untuk konsultasi materi pertanian dan informasi desa.

### 👮 Modul Pengelola Balai Desa (Administrator / `/admin`)
- **Dashboard Metrik**: Ringkasan real-time total buku, warga terdaftar, sirkulasi aktif, dan sebaran per dusun.
- **Manajemen Buku & Bab**: CRUD katalog buku cetak & digital serta editor konten bab e-book.
- **Sirkulasi Peminjaman Balai Desa**: Pencatatan pinjam buku fisik, perpanjangan masa pinjam (+7 hari), dan tombol pengembalian buku (*Tandai Kembali*).
- **CRUD Kategori Tematik**: Penambahan topik baru, ikon kustom Lucide, dan pembaruan kaskade nama kategori pada buku.
- **Manajemen 4 Dusun**: Pemantauan sebaran warga pembaca per dusun.
- **Reset PIN Warga**: Petugas balai desa dapat membantu mereset PIN warga yang lupa.
- **Warta & Pengumuman Desa**: Publikasi maklumat literasi yang tampil pada bilah atas website.
- **Ekspor Laporan CSV**: Fasilitas rekapitulasi data literasi untuk laporan pertanggungjawaban desa.

---

## 🛠️ Technology Stack

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Core Framework** | Next.js 16.3.0 (App Router) | React 19.2.8 & TypeScript v5 |
| **Styling** | Tailwind CSS v4 & Lucide React | Material You tokens, responsive & dark mode |
| **Database** | Neon Serverless PostgreSQL | PostgreSQL v16 cloud cluster |
| **ORM** | Prisma ORM 7.9.1 | `@prisma/adapter-neon` WebSocket connection pooler |
| **Authentication** | NextAuth.js 4.24.15 | Credentials Provider, Bcryptjs PIN hash |
| **Data Fetching** | SWR 2.5.1 | Client-side reactive cache & revalidation |
| **Deployment** | Vercel Edge Network | Terintegrasi otomatis dengan branch `main` GitHub |

---

## 📂 Project Structure

```text
Perpustakaan Digital/
├── docs/                     # Dokumentasi formal, panduan, arsitektur, dan BAST
│   ├── 01-project-report/    # Laporan Pengembangan Sistem (BAB I - BAB VI)
│   ├── 02-user-manual/       # Buku Panduan Penggunaan Warga & Pengelola
│   ├── 03-technical/         # Dokumentasi Teknis Sistem & API
│   ├── 04-handover/          # Berita Acara Serah Terima (BAST)
│   └── 05-diagrams/          # Diagram Mermaid (Flow, Arch, ERD, Use Case)
├── prisma/
│   └── schema.prisma         # Skema 10 model basis data Prisma
├── public/
│   ├── icon.svg              # Favicon resmi Lambang Kab. Sukabumi
│   ├── og-image.png          # Social preview banner (1200x630 px)
│   └── manifest.json         # Manifest PWA mobile
├── scratch/
│   └── run_full_stqa_test.ts # Suite pengujian otomatis STQA (48 test cases)
├── src/
│   ├── app/                  # 19 Halaman Rute dan 30 API Route Handlers
│   ├── components/           # Komponen UI, layout, dan Context bilingual
│   ├── lib/                  # Inisialisasi Prisma, Auth, dan Zod validasi
│   └── middleware.ts         # Proxy middleware otorisasi berbasis peran (RBAC)
└── DOCUMENTATION-AUDIT.md     # Laporan audit kepatuhan dokumentasi vs source code
```

---

## 🚀 Panduan Memulai Cepat (Getting Started)

### 1. Prasyarat Sistem
- **Node.js**: Versi 20.x atau 24.x LTS.
- **NPM**: Versi 10.x+.
- **Database PostgreSQL**: Akun Neon Serverless atau PostgreSQL lokal.

### 2. Kloning & Instalasi
```bash
# Kloning repositori
git clone https://github.com/ZephyrGraphic/pustaka-pangkalan.git
cd "Perpustakaan Digital"

# Pasang dependensi
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin template lingkungan:
```bash
cp .env.example .env
```
Isi variabel yang dibutuhkan (tanpa menyebarkan secret ke publik):
```ini
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="kunci_acak_rahasia_minimal_32_karakter"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Sinkronisasi Database & Generate Client
```bash
npx prisma db push
npx prisma generate
```

### 5. Menjalankan Server Pengembang Lokal
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🧪 Pengujian Otomatis (STQA Suite)

Proyek ini dilengkapi rangkaian pengujian otomatis (*Software Testing & Quality Assurance*) yang menguji 9 suite fungsional dan integritas data:

```bash
npm test
```
*Hasil Uji Terakhir: **48 dari 48 Test Cases Lulus 100% (Zero Defect)***.

---

## 📦 Build & Deployment

Untuk membuat bundel produksi:
```bash
npm run build
```
Aplikasi secara otomatis terintegrasi dengan pipeline CI/CD **Vercel** setiap kali ada perubahan yang di-*push* ke branch `main`.

---

## 📚 Dokumentasi Lengkap

Untuk membaca dokumentasi terperinci, silakan buka folder [`/docs`](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/README.md):
- 📘 [Laporan Pengembangan Sistem (BAB I-VI)](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/01-project-report/project-report.md)
- 📙 [Buku Panduan Penggunaan (User Manual)](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/02-user-manual/user-manual.md)
- 📗 [Dokumentasi Teknis & API Developer](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/03-technical/technical-documentation.md)
- 📜 [Dokumen Serah Terima Sistem (BAST)](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/04-handover/handover-document.md)
- 📊 [Diagram Alur, Arsitektur & ERD](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/)
