# 🔄 System Flow Diagram — Pustaka Pangkalan

Dokumen ini memetakan alur sistem aktual (*as-built system flow*) dari Sistem Informasi Perpustakaan Digital Desa Pangkalan, Kec. Cikidang, Kabupaten Sukabumi.

---

## 1. Alur Sistem Umum (General System Flow)

Alur penelusuran umum bagi setiap pengunjung website:

```mermaid
flowchart TD
    Start([Pengunjung Mengakses Website]) --> Landing["Halaman Utama / Beranda (/)"]
    Landing --> CheckAuth{Apakah Sudah Login?}
    
    CheckAuth -- Belum Login (Tamu) --> GuestView["Tampilan Mode Tamu (Wilujeng Sumping Warga & Tamu)"]
    GuestView --> ActionTamu{Pilihan Aksi}
    ActionTamu --> TelusuriBuku["Eksplorasi Katalog Buku (/explore)"]
    ActionTamu --> MenujuLogin["Masuk / Daftar Akun (/login)"]
    ActionTamu --> GantiBahasa["Ganti Bahasa (ID / SU)"]
    
    CheckAuth -- Sudah Login (Warga) --> CitizenView["Tampilan Mode Warga (Kartu Poin, Badge & Streak)"]
    CitizenView --> ActionWarga{Pilihan Aksi}
    ActionWarga --> BacaBuku["Membaca E-Book (/read/[chapterId])"]
    ActionWarga --> BukaRak["Kelola Rak Buku Saya (/shelf)"]
    ActionWarga --> ProfilWarga["Kartu Anggota & Edit Profil (/profile)"]
    ActionWarga --> ChatKades["Konsultasi Asisten Kades AI"]
    
    CitizenView --> CheckAdmin{Role Akun == ADMIN?}
    CheckAdmin -- Ya --> AdminBadge["Muncul Tombol Akses Dashboard Admin"]
    AdminBadge --> AdminArea["Masuk Dashboard Pengelola (/admin)"]
    CheckAdmin -- Tidak --> StayCitizen["Tetap di Area Warga"]
```

---

## 2. Alur Autentikasi Warga (Citizen Auth & Onboarding Flow)

Alur pendaftaran berbasis NIK dan pembuatan PIN 6 digit:

```mermaid
sequenceDiagram
    autonumber
    actor Warga as Warga Desa
    participant UI as Halaman Login & Daftar (/login)
    participant Onboarding as Step Onboarding (/onboarding)
    participant API as /api/auth/register
    participant DB as Neon PostgreSQL (Prisma)
    participant NextAuth as NextAuth (Credentials Provider)

    Warga->>UI: Masukkan Nama Lengkap & NIK (16 digit)
    UI->>UI: Validasi Format NIK (angka 16 digit)
    UI->>Onboarding: Redirect ke Wizard Onboarding
    Warga->>Onboarding: Masukkan & Konfirmasi PIN 6 digit
    Warga->>Onboarding: Pilih Dusun (Pangkalan, Cikajang, Pasir Arangan, Pasir Gombong) & No. HP
    Onboarding->>API: POST /api/auth/register (Nama, NIK, PIN, Dusun, HP)
    API->>API: Bcrypt Hash PIN (Salt 10 rounds)
    API->>DB: User.create / User.upsert
    DB-->>API: Data Akun Berhasil Disimpan
    API-->>Onboarding: HTTP 201 Created (Member ID & QR Card)
    Onboarding->>NextAuth: Otomatis signIn("credentials", { email: NIK, password: PIN })
    NextAuth-->>Warga: Session Terbit (Redirect ke Beranda /)
```

---

## 3. Alur Membaca & Gamifikasi Literasi (Reading & Gamification Flow)

```mermaid
flowchart TD
    Katalog["Katalog Buku (/explore)"] --> PilihBuku["Pilih Buku & Buka Detail (/books/[id])"]
    PilihBuku --> CekFormat{Format Koleksi}
    
    CekFormat -- Buku Fisik --> InfoFisik["Lihat Lokasi Rak Balai Desa & Ajukan Peminjaman"]
    CekFormat -- Digital E-Book --> MulaiBaca["Buka Reader Bab E-Book (/read/[chapterId])"]
    
    MulaiBaca --> NavigasiBab["Membaca Teks Bab Buku"]
    NavigasiBab --> TandaiBookmark["Simpan Penanda Bacaan (Bookmark)"]
    NavigasiBab --> SelesaiBab["Klik 'Tandai Selesai & Lanjut'"]
    
    SelesaiBab --> ProgressAPI["POST /api/reading-progress"]
    ProgressAPI --> HitungPoin["Tambah +10 Poin Membaca & Update Reading Streak"]
    HitungPoin --> EvaluasiBadge{Cek Total Poin}
    
    EvaluasiBadge -- >= 50 Poin --> B1["Badge: Pembaca Rajin"]
    EvaluasiBadge -- >= 150 Poin --> B2["Badge: Cendekia Desa"]
    EvaluasiBadge -- >= 300 Poin --> B3["Badge: Pelopor Literasi"]
    
    HitungPoin --> Leaderboard["Pembaruan Papan Peringkat Desa (/api/leaderboard)"]
```

---

## 4. Alur Manajemen Pengelola Balai Desa (Administrative Flow)

Alur kerja petugas/administrator di `/admin`:

```mermaid
flowchart LR
    subgraph Admin_Access["Autentikasi Petugas"]
        LoginAdmin["Login NIK + PIN Admin"] --> ProxyMiddleware{"Proxy Middleware Check"}
        ProxyMiddleware -- Role != ADMIN --> Kick["Redirect ke / (Home)"]
        ProxyMiddleware -- Role == ADMIN --> Dashboard["/admin (Ringkasan Metrik Desa)"]
    end

    subgraph Modul_Kelola["Modul Pengelolaan"]
        Dashboard --> M1["Kelola Buku & Bab (/admin/books)"]
        Dashboard --> M2["Sirkulasi Pinjam Balai Desa (/admin/circulation)"]
        Dashboard --> M3["Kategori Tematik Desa (/admin/categories)"]
        Dashboard --> M4["Wilayah 4 Dusun (/admin/dusuns)"]
        Dashboard --> M5["Akun Warga & Reset PIN (/admin/users)"]
        Dashboard --> M6["Moderasi Ulasan (/admin/reviews)"]
        Dashboard --> M7["Warta Desa (/admin/announcements)"]
    end
```
