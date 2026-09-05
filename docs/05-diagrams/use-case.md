# 🎯 Use Case Diagram — As-Built System

Diagram ini memetakan use case aktual yang disediakan oleh Sistem Informasi Perpustakaan Digital Desa Pangkalan berdasarkan implementasi antarmuka dan hak akses pengguna.

---

## 1. Diagram Use Case Utama

```mermaid
graph LR
    subgraph Aktor_Sistem
        Warga["👤 Warga Desa (Citizen)"]
        Admin["👮 Pengelola Desa (Admin)"]
    end

    subgraph Modul_Publik_dan_Warga["Area Publik & Warga"]
        UC01["UC-01: Registrasi Akun Berbasis NIK"]
        UC02["UC-02: Masuk / Login dengan NIK & PIN"]
        UC03["UC-03: Menjelajahi Katalog & Filter Kategori"]
        UC04["UC-04: Membaca Modul / E-Book per Bab"]
        UC05["UC-05: Menandai Halaman (Bookmark)"]
        UC06["UC-06: Memberikan Rating & Ulasan Buku"]
        UC07["UC-07: Mengelola Rak Bacaan Pribadi"]
        UC08["UC-08: Melihat Kartu Anggota Digital & QR"]
        UC09["UC-09: Mengganti Bahasa (ID / Basa Sunda)"]
        UC10["UC-10: Konsultasi Chat dengan Asisten Kades AI"]
        UC11["UC-11: Mengedit Profil & Mengganti PIN Pribadi"]
    end

    subgraph Modul_Admin_Balai_Desa["Area Pengelola Balai Desa (/admin)"]
        UC12["UC-12: Melihat Dashboard Metrik Literasi"]
        UC13["UC-13: Mengelola Data Buku & Bab Bacaan (CRUD)"]
        UC14["UC-14: Mengelola Sirkulasi Peminjaman Fisik (CRUD)"]
        UC15["UC-15: Memperpanjang Masa Pinjam Buku (+7 Hari)"]
        UC16["UC-16: Menandai Buku Fisik Kembali"]
        UC17["UC-17: Mengelola Kategori Buku Tematik (CRUD)"]
        UC18["UC-18: Mengelola Wilayah 4 Dusun Desa (CRUD)"]
        UC19["UC-19: Melihat Daftar Warga & Reset PIN Warga"]
        UC20["UC-20: Moderasi & Hapus Ulasan Negatif/Spam"]
        UC21["UC-21: Menerbitkan & Mengatur Warta Desa"]
    end

    %% Relasi Warga
    Warga --> UC01
    Warga --> UC02
    Warga --> UC03
    Warga --> UC04
    Warga --> UC05
    Warga --> UC06
    Warga --> UC07
    Warga --> UC08
    Warga --> UC09
    Warga --> UC10
    Warga --> UC11

    %% Relasi Admin
    Admin --> UC02
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
```

---

## 2. Rincian Aktor & Kewenangan

| Aktor | Deskripsi Peran | Batasan Akses |
|---|---|---|
| **Warga Desa (Citizen)** | Masyarakat umum dan warga dari 4 dusun (Pangkalan, Cikajang, Pasir Arangan, Pasir Gombong) | Mengakses modul membaca, menyimpan buku ke rak, memberikan ulasan, melihat leaderboard poin, serta berkonsultasi via Kades AI. Tidak dapat membuka rute `/admin`. |
| **Pengelola Desa (Admin)** | Perangkat/petugas balai desa yang bertugas mencatat sirkulasi dan memelihara konten | Memiliki seluruh hak akses warga ditambah akses penuh ke dashboard operasional `/admin/*`, manajemen master data buku, sirkulasi, dusun, kategori, dan reset PIN warga. |
| **Pengunjung Tamu (Guest)** | Pengguna yang belum login / baru mengunjungi web | Dapat melihat beranda, menjelajah katalog buku, dan membaca warta desa. Diarahkan masuk/mendaftar saat ingin membuka rak buku atau modul interaktif. |
