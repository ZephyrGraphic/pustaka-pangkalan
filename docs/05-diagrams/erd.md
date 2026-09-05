# 🗄️ Entity Relationship Diagram (ERD) — As-Built System

Diagram ini menggambarkan struktur relasional database aktual yang didefinisikan dalam [prisma/schema.prisma](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/prisma/schema.prisma) dan di-deploy pada klaster PostgreSQL Neon Serverless.

---

## 1. Diagram Relasi Entitas (Mermaid ERD)

```mermaid
erDiagram
    Dusun ||--o{ User : "memiliki warga"
    Category ||--o{ Book : "mengelompokkan buku"
    User ||--o{ Bookmark : "membuat"
    Book ||--o{ Bookmark : "ditandai di"
    User ||--o{ ReadingProgress : "mencatat"
    Book ||--o{ ReadingProgress : "dibaca di"
    User ||--o{ Review : "menulis"
    Book ||--o{ Review : "menerima"
    Book ||--o{ Chapter : "terdiri dari"
    User ||--o{ BorrowRecord : "meminjam fisik"
    Book ||--o{ BorrowRecord : "dipinjam fisik"

    User {
        String id PK "CUID"
        String email UK "NIK 16 Digit"
        String name "Nama Lengkap"
        String password "Bcrypt Hash PIN"
        Role role "USER / ADMIN"
        String image "Foto Profil URL"
        String phone "Nomor Telepon/WA"
        String address "Nama Dusun Teks"
        String dusunId FK "Relasi ke Dusun"
        String occupation "Pekerjaan"
        Int points "Poin Gamifikasi"
        String badge "Gelar Pembelajar"
        Boolean isProfileComplete "Status Data Diri"
        DateTime createdAt
        DateTime updatedAt
    }

    Dusun {
        String id PK "CUID"
        String name UK "Nama Dusun Resmi"
        Int order "Urutan Tampilan"
        DateTime createdAt
        DateTime updatedAt
    }

    Category {
        String id PK "CUID"
        String name UK "Nama Kategori Tematik"
        String slug UK "URL Friendly Slug"
        String description "Deskripsi Kategori"
        String icon "Preset Ikon Lucide"
        Int order "Urutan Tampilan"
        DateTime createdAt
        DateTime updatedAt
    }

    Book {
        String id PK "CUID"
        String title "Judul Buku"
        String author "Penulis / Penerbit"
        String description "Sinopsis / Deskripsi"
        String coverUrl "URL Sampul Buku"
        String category "String Nama Kategori"
        String categoryId FK "Relasi ke Category"
        String pdfUrl "URL Dokumen PDF"
        Boolean isOffline "Tersedia Fisik"
        Int pages "Total Halaman"
        Float rating "Rating Rata-rata"
        DateTime createdAt
        DateTime updatedAt
    }

    Chapter {
        String id PK "CUID"
        String bookId FK "Relasi ke Book"
        String title "Judul Bab"
        String content "Teks Lengkap Bab (db.Text)"
        Int order "Urutan Bab"
        DateTime createdAt
        DateTime updatedAt
    }

    Bookmark {
        String id PK "CUID"
        String userId FK "Relasi ke User"
        String bookId FK "Relasi ke Book"
        DateTime createdAt
    }

    ReadingProgress {
        String id PK "CUID"
        String userId FK "Relasi ke User"
        String bookId FK "Relasi ke Book"
        Int page "Nomor Bab/Halaman Terakhir"
        DateTime lastRead "Waktu Terakhir Baca"
    }

    Review {
        String id PK "CUID"
        String userId FK "Relasi ke User"
        String bookId FK "Relasi ke Book"
        Int rating "Bintang 1-5"
        String comment "Ulasan Warga (db.Text)"
        DateTime createdAt
        DateTime updatedAt
    }

    BorrowRecord {
        String id PK "CUID"
        String userId FK "Relasi ke User"
        String bookId FK "Relasi ke Book"
        DateTime borrowDate "Tanggal Peminjaman"
        DateTime dueDate "Batas Waktu Pengembalian"
        DateTime returnDate "Tanggal Pengembalian Riil"
        BorrowStatus status "BORROWED / RETURNED / OVERDUE"
        String notes "Catatan Tambahan Petugas"
        DateTime createdAt
        DateTime updatedAt
    }

    Announcement {
        String id PK "CUID"
        String title "Judul Warta"
        String content "Isi Pengumuman (db.Text)"
        String category "Kategori Warta"
        Boolean active "Status Tayang"
        DateTime createdAt
        DateTime updatedAt
    }
```

---

## 2. Definisi Tipe Enum Database

### `Role`
- `USER`: Pengguna reguler (warga desa dan pembaca umum).
- `ADMIN`: Petugas administrasi dan pengelola perpustakaan balai desa.

### `BorrowStatus`
- `BORROWED`: Buku sedang dipinjam secara fisik oleh warga dari balai desa.
- `RETURNED`: Buku telah dikembalikan ke balai desa dan disetujui petugas.
- `OVERDUE`: Masa peminjaman telah melewati tanggal `dueDate` dan belum dikembalikan.

---

## 3. Batasan Unik & Integritas Relasional (Constraints)

1. `Bookmark`: Memiliki constraint unik gabungan `@@unique([userId, bookId])` — seorang warga hanya memiliki 1 penanda aktif per buku.
2. `ReadingProgress`: Memiliki constraint unik gabungan `@@unique([userId, bookId])` — kemajuan membaca diperbarui per record buku.
3. `Review`: Memiliki constraint unik gabungan `@@unique([userId, bookId])` — seorang warga hanya dapat memberikan 1 ulasan resmi per judul buku.
4. `Dusun.name`: Unik (`@unique`) untuk mencegah duplikasi nama wilayah dusun.
5. `Category.name` & `Category.slug`: Unik (`@unique`) untuk keandalan routing dan pengkategorian.
6. **Cascade Action**:
   - Penghapusan `Book` akan menghapus seluruh `Chapter`, `Bookmark`, `ReadingProgress`, `Review`, dan `BorrowRecord` terkait (`onDelete: Cascade`).
   - Penghapusan `Dusun` atau `Category` bersifat aman (`onDelete: SetNull`), sehingga tidak menghapus data warga maupun koleksi buku yang sudah ada.
