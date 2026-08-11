# 🏛️ Pustaka Pangkalan — Sistem Perpustakaan Digital Desa

Platform Perpustakaan Digital Desa Pangkalan berbasis monorepo yang mengintegrasikan **Web Admin Portal (Next.js 15)**, **REST API Backend**, dan **Aplikasi Mobile (Flutter Cross-Platform)**.

---

## 📁 Struktur Folder Monorepo

```
pustaka-pangkalan/
├── backend/            # Web Admin Portal + REST API v1 (Next.js 15 + Prisma ORM)
│   ├── src/app/admin/  # Web Admin Dashboard (Katalog, Anggota, Statistik)
│   ├── src/app/api/v1/ # REST API Endpoints (Auth, Contents, Categories, Search)
│   ├── src/lib/        # Utilities (JWT, Prisma Client, API Response Helper)
│   ├── prisma/         # Database Schema & Seed Data
│   └── public/         # Aset statis & sampul buku digital
├── mobile/             # Aplikasi Mobile Warga (Flutter + Riverpod + GoRouter)
│   ├── lib/app/        # Router & Theme Configuration
│   ├── lib/core/       # Network Client, Storage, Constants
│   ├── lib/features/   # Feature Modules (Auth, Home, Catalog, Bookshelf, Reader, Profile)
│   └── lib/shared/     # Data Models & Reusable Widgets
├── docs/               # Dokumentasi (ERD, UI/UX Mockup, Use Cases, UML)
├── vercel.json         # Konfigurasi deployment Vercel (monorepo)
├── .env.example        # Template environment variables
└── README.md
```

---

## 🚀 Quick Start (Lokal)

### 1. Clone & Setup Backend
```bash
git clone https://github.com/ZephyrGraphic/pustaka-pangkalan.git
cd pustaka-pangkalan/backend

# Install dependencies
npm install

# Setup environment
cp ../.env.example .env
# Edit .env → isi DATABASE_URL dengan PostgreSQL connection string Anda

# Generate Prisma Client & push schema
npx prisma generate
npx prisma db push

# Seed database (opsional)
npm run db:seed

# Jalankan development server
npm run dev
```
Backend & API aktif di: `http://localhost:3000`

### 2. Setup Mobile (Flutter)
```bash
cd pustaka-pangkalan/mobile

# Install dependencies
flutter pub get

# Jalankan di Android Emulator / Chrome
flutter run
```

---

## 🌐 Deployment Vercel (Web Admin + REST API)

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**
2. Import repository GitHub `pustaka-pangkalan`
3. Vercel akan otomatis membaca `vercel.json` di root
4. Set **Environment Variables** di Vercel:
   | Variable | Contoh Nilai |
   |----------|-------------|
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` |
   | `JWT_SECRET` | *(string random yang panjang & unik)* |
5. Klik **Deploy** ✅

> **Catatan**: `vercel.json` sudah dikonfigurasi untuk mengenali `backend/` sebagai root directory Next.js. Prisma generate dijalankan otomatis saat build.

---

## 📱 Build APK Android

```bash
cd pustaka-pangkalan/mobile

# Sebelum build, pastikan API base URL di lib/core/constants/api_constants.dart
# sudah mengarah ke domain Vercel/hosting production

flutter build apk --release
```

Output APK: `mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## 🔌 REST API Endpoints

Base URL: `https://your-domain.vercel.app/api/v1`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Health check server |
| `POST` | `/auth/login` | Login (phone + password) |
| `POST` | `/auth/register` | Registrasi warga baru |
| `GET` | `/auth/me` | Profil user terautentikasi |
| `GET` | `/contents` | Katalog koleksi (paginated, filterable) |
| `GET` | `/contents/:id` | Detail koleksi + digital assets |
| `GET` | `/categories` | Daftar kategori |
| `GET` | `/search?q=...` | Pencarian koleksi |
| `GET` | `/me/bookshelf` | Rak buku user |
| `GET` | `/me/bookmarks` | Bookmark user |
| `GET` | `/me/reading-progress` | Progress membaca |

---

## 🔑 Akses Testing

Kredensial testing tersedia di file `.env` lokal dan seed data (`prisma/seed.ts`).  
Jalankan `npm run db:seed` di folder `backend/` untuk membuat akun testing otomatis.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend Framework** | Next.js 15 (App Router) |
| **Database ORM** | Prisma 6.4 |
| **Database** | PostgreSQL (NeonDB / Supabase) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Styling** | Tailwind CSS 4 |
| **Mobile Framework** | Flutter 3.12+ (Dart) |
| **State Management** | Riverpod 2.6 |
| **Navigation** | GoRouter 14.8 |
| **HTTP Client** | Dio 5.8 |
| **Deployment** | Vercel (web) + APK (mobile) |

---

## ⚙️ Lisensi & Hak Cipta
© 2026 Perpustakaan Digital Desa Pangkalan • Built with ❤️
