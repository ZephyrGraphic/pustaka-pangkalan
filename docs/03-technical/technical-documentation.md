# 🛠️ TECHNICAL DOCUMENTATION
## Pustaka Pangkalan — Sistem Informasi Perpustakaan Digital Desa

**Dokumentasi Teknis untuk Pengembang & Tim Pemelihara Sistem**  
**Versi Aplikasi**: 0.1.0 (Production)  
**Lingkungan**: Next.js 16 App Router + Neon Serverless PostgreSQL  
**Repositori**: [https://github.com/ZephyrGraphic/pustaka-pangkalan.git](https://github.com/ZephyrGraphic/pustaka-pangkalan.git)

---

## 1. System Overview & Technology Stack

Pustaka Pangkalan dibangun menggunakan paradigma **Fullstack Serverless Framework**. Seluruh logika antarmuka, optimasi gambar, perutean aman, dan logika backend REST API terintegrasi dalam runtime Next.js 16 yang dideploy ke jaringan Vercel Edge.

### Rincian Dependensi Produksi (`package.json`)
- **Framework Utama**: `next@16.3.0`, `react@19.2.8`, `react-dom@19.2.8`
- **Bahasa & Kompiler**: `typescript@^5`, Node.js v20+ / v24+
- **Database & ORM**:
  - `prisma@^7.9.1` & `@prisma/client@^7.9.1`
  - `@neondatabase/serverless@^1.1.0` (WebSocket connection pooler)
  - `@prisma/adapter-neon@^7.9.1` & `@prisma/adapter-pg@^7.9.1`
- **Autentikasi & Keamanan**:
  - `next-auth@^4.24.15` (Credentials Provider)
  - `bcryptjs@^3.0.3` (Hashing PIN warga dengan salt 10 rounds)
- **Validasi Data**: `zod@^4.5.4`
- **State Management & Fetching**: `swr@^2.5.1` (Stale-While-Revalidate caching)
- **Styling**: `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `lucide-react@^1.31.0`
- **Testing Engine**: `tsx@^4.23.12` (STQA Custom Test Runner)

---

## 2. Struktur Proyek (`Project Structure`)

```text
Perpustakaan Digital/
├── docs/                                # Seluruh paket dokumentasi formal & teknis
│   ├── 01-project-report/               # Laporan Pengembangan Sistem (BAB I-VI)
│   ├── 02-user-manual/                  # Buku Panduan Penggunaan
│   ├── 03-technical/                    # Dokumentasi Teknis Sistem
│   ├── 04-handover/                     # Dokumen Serah Terima Sistem
│   └── 05-diagrams/                     # Berkas diagram Mermaid (flow, arch, erd, usecase)
├── prisma/
│   ├── schema.prisma                    # Definisi model basis data & relasi
│   └── seed.ts                          # Script pengisian data awal
├── public/
│   ├── icon.svg                         # Vektor tab favicon resmi
│   ├── logo_sukabumi.webp               # Logo Kabupaten Sukabumi transparan
│   ├── og-image.png                     # Banner OpenGraph (1200x630 px)
│   ├── manifest.json                    # Konfigurasi Progressive Web App (PWA)
│   └── images/                          # Aset grafis latar & avatar maskot desa
├── scratch/
│   ├── generate_branding_assets.py      # Generator aset visual & thumbnail OpenGraph
│   ├── migrate_category_table.ts        # Script migrasi DDL tabel Category
│   ├── seed_categories.ts               # Seeding 8 kategori tematik Desa Pangkalan
│   └── run_full_stqa_test.ts            # Test runner otomatis 9 suite STQA
├── src/
│   ├── app/                             # Next.js App Router (Halaman & Route Handlers)
│   ├── components/                      # Komponen modular UI, modal, banner, dan layout
│   ├── lib/                             # Inisialisasi prisma, authOptions, dan Zod schemas
│   └── middleware.ts                    # Route guard berbasis session & RBAC
├── .env.example                         # Template variabel lingkungan (zero secret)
├── package.json                         # Dependensi dan scripts
└── tsconfig.json                        # Konfigurasi TypeScript
```

---

## 3. Inventarisasi Halaman Rute (`Page Routes`)

Berikut adalah daftar 19 rute halaman UI yang benar-benar terimplementasi:

| Rute Halaman | Akses | Komponen File | Deskripsi Fungsionalitas |
|---|---|---|---|
| `/` | Publik | `src/app/page.tsx` | Beranda utama, sambutan warga, warta pengumuman, leaderboard, rekomendasi modul. |
| `/explore` | Publik | `src/app/explore/page.tsx` | Katalog buku dengan pencarian instan dan filter dinamis 8 kategori tematik. |
| `/books/[id]` | Publik | `src/app/books/[id]/page.tsx` | Halaman detail buku, sinopsis, status ketersediaan fisik, ulasan, dan daftar bab. |
| `/read/[chapterId]` | Warga | `src/app/read/[chapterId]/page.tsx` | E-book reader per bab, navigasi antar-bab, penanda bookmark, dan akumulasi poin baca. |
| `/shelf` | Warga | `src/app/shelf/page.tsx` | Rak buku pribadi warga yang menyimpan daftar bacaan favorit. |
| `/profile` | Warga | `src/app/profile/page.tsx` | Tampilan Kartu Anggota Digital ber-QR Code, status poin literasi, dan form edit profil. |
| `/login` | Tamu | `src/app/login/page.tsx` | Formulir login NIK + PIN dan pendaftaran warga baru. Dilindungi auto-redirect jika sudah login. |
| `/onboarding` | Tamu | `src/app/onboarding/page.tsx` | Langkah aktivasi akun warga baru (pembuatan PIN 6 digit, pemilihan dusun, dan no HP). |
| `/admin` | Admin | `src/app/admin/page.tsx` | Dashboard utama pengelola desa memuat kartu metrik total buku, warga, sirkulasi, dan dusun. |
| `/admin/books` | Admin | `src/app/admin/books/page.tsx` | Manajemen koleksi buku fisik dan digital dengan pencarian, filter, edit, dan hapus. |
| `/admin/books/new` | Admin | `src/app/admin/books/new/page.tsx` | Formulir penambahan buku baru dengan pemilihan kategori dinamis dari database. |
| `/admin/books/[id]/chapters` | Admin | `src/app/admin/books/[id]/chapters/page.tsx` | Manajemen bab bacaan e-book (*chapter list & text editor*). |
| `/admin/categories` | Admin | `src/app/admin/categories/page.tsx` | CRUD kategori tematik desa, icon picker, nomor urut, dan cascade update nama buku. |
| `/admin/circulation` | Admin | `src/app/admin/circulation/page.tsx` | Pelayanan sirkulasi peminjaman buku fisik balai desa, perpanjangan +7 hari, dan tandai kembali. |
| `/admin/dusuns` | Admin | `src/app/admin/dusuns/page.tsx` | Master data 4 dusun resmi dan visualisasi sebaran warga pembaca per wilayah dusun. |
| `/admin/users` | Admin | `src/app/admin/users/page.tsx` | Manajemen direktori warga, filter dusun, status keaktifan, dan modal reset PIN warga. |
| `/admin/reviews` | Admin | `src/app/admin/reviews/page.tsx` | Moderasi ulasan warga; admin dapat meninjau rating bintang dan menghapus komentar spam. |
| `/admin/announcements` | Admin | `src/app/admin/announcements/page.tsx` | Pembuatan dan penerbitan warta literasi yang tampil di bilah atas (*BroadcastBanner*). |
| `/admin/analytics` | Admin | `src/app/admin/analytics/page.tsx` | Laporan analitik literasi desa, rekapitulasi grafik, dan fasilitas unduh laporan CSV. |

---

## 4. Inventarisasi API Route Handlers (`Backend Endpoints`)

Sistem menyediakan 30 RESTful Route Handlers di bawah rute `/api/*`:

### A. Endpoint Publik & Warga
| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `GET` | `/api/books` | Mengambil daftar buku terfilter (search, category, sort) | Publik |
| `GET` | `/api/books/[id]` | Mengambil rincian 1 buku beserta bab dan ulasan | Publik |
| `GET` | `/api/categories` | Mengambil 8 kategori aktif terurut berdasarkan `order` | Publik |
| `GET` | `/api/dusuns` | Mengambil daftar 4 dusun resmi Desa Pangkalan | Publik |
| `GET` | `/api/announcements` | Mengambil warta pengumuman aktif untuk banner | Publik |
| `GET` | `/api/leaderboard` | Mengambil 10 pembaca teratas berdasarkan poin membaca | Publik |
| `POST` | `/api/auth/register` | Pendaftaran warga baru dengan enkripsi PIN bcrypt | Publik |
| `POST` | `/api/auth/[...nextauth]` | Endpoint NextAuth untuk autentikasi Credentials | Publik |
| `GET` | `/api/read/[chapterId]` | Mengambil konten teks bab bacaan | Warga |
| `POST` | `/api/reading-progress` | Menyimpan progres baca, menambah +10 poin, update streak | Warga |
| `GET`, `POST` | `/api/shelf` | Mengambil dan menambah buku ke rak pribadi warga | Warga |
| `GET`, `POST` | `/api/bookmarks` | Mengambil dan menyimpan penanda halaman bacaan | Warga |
| `GET`, `POST` | `/api/reviews` | Mengambil dan mengirim ulasan/rating buku | Warga |
| `GET`, `PUT` | `/api/user/profile` | Mengambil data kartu anggota dan mengedit profil pribadi | Warga |
| `POST` | `/api/ai/chat` | Asisten konsultasi interaktif Kades AI | Warga |

### B. Endpoint Khusus Administrator (`/api/admin/*`)
| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `GET` | `/api/admin/analytics` | Mengambil metrik analitik literasi dan rekap desa | Admin |
| `GET`, `POST` | `/api/admin/books` | Mengambil semua buku dan menambah buku baru | Admin |
| `GET`, `PUT`, `DELETE` | `/api/admin/books/[id]` | Mengambil, mengubah, atau menghapus koleksi buku | Admin |
| `GET`, `POST` | `/api/admin/categories` | Mengambil daftar kategori dan menambah kategori baru | Admin |
| `GET`, `PUT`, `DELETE` | `/api/admin/categories/[id]` | Edit kategori (cascade update buku) dan hapus aman | Admin |
| `GET`, `POST` | `/api/admin/chapters` | Mengambil bab dan menambah bab baru ke buku | Admin |
| `PUT`, `DELETE` | `/api/admin/chapters/[id]` | Mengubah isi teks bab atau menghapus bab | Admin |
| `GET`, `POST` | `/api/admin/circulation` | Mengambil riwayat sirkulasi dan mencatat pinjaman baru | Admin |
| `PATCH`, `DELETE` | `/api/admin/circulation` | Perpanjang pinjam (+7 hari), tandai kembali, atau hapus | Admin |
| `GET`, `POST` | `/api/admin/dusuns` | Mengambil daftar dusun dan menambah dusun baru | Admin |
| `PUT`, `DELETE` | `/api/admin/dusuns/[id]` | Mengubah nama dusun atau menghapus dusun | Admin |
| `GET` | `/api/admin/reviews` | Mengambil seluruh ulasan warga untuk keperluan moderasi | Admin |
| `DELETE` | `/api/admin/reviews` | Menghapus ulasan yang melanggar norma | Admin |
| `GET`, `PATCH` | `/api/admin/users` | Mengambil direktori warga dan fasilitas reset PIN warga | Admin |
| `GET`, `POST` | `/api/admin/announcements` | Mengambil warta admin dan menerbitkan warta baru | Admin |
| `PUT`, `DELETE` | `/api/admin/announcements/[id]` | Mengubah status tayang warta atau menghapus warta | Admin |

---

## 5. Kamus Data Basis Data (`Data Dictionary`)

Struktur skema PostgreSQL aktual yang didefinisikan pada `prisma/schema.prisma`:

### 1. Tabel `User`
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `email` | `VARCHAR(255)` | Unique (Menyimpan NIK 16 digit warga) |
| `name` | `VARCHAR(255)` | Nama lengkap warga |
| `password` | `VARCHAR(255)` | Bcrypt hash kata sandi / PIN 6 digit |
| `role` | `ENUM ('USER', 'ADMIN')` | Peran pengguna (Default: `'USER'`) |
| `image` | `VARCHAR(500)` | URL foto profil (opsional) |
| `phone` | `VARCHAR(30)` | Nomor telepon/WhatsApp (opsional) |
| `address` | `VARCHAR(255)` | Nama teks dusun (kompatibilitas tampilan) |
| `dusunId` | `VARCHAR(30)` | Foreign Key ke `Dusun.id` (`onDelete: SetNull`) |
| `occupation` | `VARCHAR(100)` | Profesi warga (Petani, Wiraswasta, Pelajar, dll.) |
| `points` | `INTEGER` | Akumulasi poin membaca gamifikasi (Default: 0) |
| `badge` | `VARCHAR(50)` | Gelar pembelajar (Default: `"Warga Pembelajar"`) |
| `isProfileComplete`| `BOOLEAN` | Indikator kelengkapan data diri profil |
| `createdAt` | `TIMESTAMP` | Waktu pembuatan akun |
| `updatedAt` | `TIMESTAMP` | Waktu pembaruan data terakhir |

### 2. Tabel `Dusun`
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `name` | `VARCHAR(100)` | Unique (Nama dusun resmi Desa Pangkalan) |
| `order` | `INTEGER` | Nomor urut tampilan |
| `createdAt`, `updatedAt` | `TIMESTAMP` | Timestamps audit |

### 3. Tabel `Category`
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `name` | `VARCHAR(100)` | Unique (Nama topik tematik desa) |
| `slug` | `VARCHAR(100)` | Unique (URL-friendly identifier) |
| `description` | `VARCHAR(255)` | Deskripsi ruang lingkup materi |
| `icon` | `VARCHAR(50)` | Nama preset ikon Lucide (misal: `Sprout`, `Cpu`) |
| `order` | `INTEGER` | Urutan penyortiran di katalog |
| `createdAt`, `updatedAt` | `TIMESTAMP` | Timestamps audit |

### 4. Tabel `Book`
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `title` | `VARCHAR(255)` | Judul buku |
| `author` | `VARCHAR(255)` | Penulis / Institusi penyusun |
| `description` | `TEXT` | Sinopsis lengkap buku |
| `coverUrl` | `VARCHAR(500)` | URL gambar sampul |
| `category` | `VARCHAR(100)` | Nama kategori string (kompatibilitas legacy) |
| `categoryId` | `VARCHAR(30)` | Foreign Key ke `Category.id` (`onDelete: SetNull`) |
| `pdfUrl` | `VARCHAR(500)` | Tautan dokumen PDF lengkap (opsional) |
| `isOffline` | `BOOLEAN` | Penanda ketersediaan fisik di balai desa |
| `pages` | `INTEGER` | Total halaman |
| `rating` | `FLOAT` | Rating rata-rata (Default: 0.0) |
| `createdAt`, `updatedAt` | `TIMESTAMP` | Timestamps audit |

### 5. Tabel `Chapter`
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `bookId` | `VARCHAR(30)` | Foreign Key ke `Book.id` (`onDelete: Cascade`) |
| `title` | `VARCHAR(255)` | Judul bab bacaan |
| `content` | `TEXT` | Isi lengkap teks bacaan bab |
| `order` | `INTEGER` | Nomor urut bab dalam buku |
| `createdAt`, `updatedAt` | `TIMESTAMP` | Timestamps audit |

### 6. Tabel `BorrowRecord` (Sirkulasi Balai Desa)
| Kolom | Tipe Data | Keterangan & Constraints |
|---|---|---|
| `id` | `VARCHAR(30)` | Primary Key (CUID) |
| `userId` | `VARCHAR(30)` | Foreign Key ke `User.id` peminjam (`onDelete: Cascade`) |
| `bookId` | `VARCHAR(30)` | Foreign Key ke `Book.id` buku fisik (`onDelete: Cascade`) |
| `borrowDate` | `TIMESTAMP` | Tanggal awal peminjaman |
| `dueDate` | `TIMESTAMP` | Batas akhir pengembalian (default +7 hari) |
| `returnDate` | `TIMESTAMP` | Tanggal riil pengembalian (NULL saat masih dipinjam) |
| `status` | `ENUM ('BORROWED', 'RETURNED', 'OVERDUE')` | Status sirkulasi |
| `notes` | `TEXT` | Catatan kondisi buku dari petugas balai desa |
| `createdAt`, `updatedAt` | `TIMESTAMP` | Timestamps audit |

---

## 6. Variabel Lingkungan (`Environment Variables Guide`)

Untuk kebutuhan replikasi lingkungan lokal dan deployment, berikut daftar variabel konfigurasi yang dibutuhkan.

> [!CAUTION]
> **Zero Secret Policy**: Nilai rahasia (*secret credentials*) dilarang keras ditulis dalam dokumentasi. Nilai riil hanya disimpan secara terisolasi pada dashboard Vercel Project Settings dan berkas lokal `.env` yang terdaftar pada `.gitignore`.

| Nama Variabel | Wajib | Contoh Format Nilai | Deskripsi & Tujuan |
|---|:---:|---|---|
| `DATABASE_URL` | Ya | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` | String koneksi terenkripsi ke klaster PostgreSQL Neon Serverless. |
| `NEXTAUTH_SECRET` | Ya | `d690... (string acak 32+ karakter)` | Kunci kriptografi simetris untuk enkripsi session cookie JWT NextAuth. |
| `NEXTAUTH_URL` | Ya | `https://perpus-pangkalan.vercel.app` | URL basis aplikasi untuk pembuatan callback URL redirect login yang sah. |
| `GEMINI_API_KEY` | Opsional | `AIzaSy...` | Kunci API Google AI Studio untuk mengaktifkan respons interaktif modul Kades AI. |

---

## 7. Prosedur Instalasi, Pengujian & Pemeliharaan Lokal

### Prasyarat
- Node.js versi 20.x atau lebih baru (direkomendasikan Node 24 LTS).
- Package manager `npm`.
- Akses basis data PostgreSQL aktif (dapat menggunakan Neon gratis atau PostgreSQL lokal).

### Langkah Instalasi
```bash
# 1. Kloning repositori
git clone https://github.com/ZephyrGraphic/pustaka-pangkalan.git
cd "Perpustakaan Digital"

# 2. Pasang seluruh dependensi proyek
npm install

# 3. Siapkan berkas konfigurasi lingkungan
cp .env.example .env
# Edit berkas .env dan lengkapi DATABASE_URL serta NEXTAUTH_SECRET

# 4. Sinkronisasi skema database & generate Prisma Client
npx prisma db push
npx prisma generate

# 5. Jalankan server pengembang lokal
npm run dev
# Buka http://localhost:3000 di browser
```

### Menjalankan Pengujian Otomatis (STQA Suite)
```bash
npm test
# Menjalankan tsx scratch/run_full_stqa_test.ts (48 test cases, 9 suites)
```

### Melakukan Build Produksi
```bash
npm run build
# Menjalankan prisma generate dan next build --webpack
```
