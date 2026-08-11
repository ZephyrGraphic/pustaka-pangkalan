# Sequence Diagrams - Perpustakaan Digital Desa

Dokumen ini berisi **Sequence Diagrams** menggunakan Mermaid untuk 4 alur kerja utama aplikasi **Perpustakaan Digital Desa**.

---

## 1. Sequence Diagram: Authentication & Token Storage Flow

Menjelaskan proses login warga dari aplikasi Flutter hingga token disimpan secara aman di `FlutterSecureStorage`.

```mermaid
sequenceDiagram
    autonumber
    actor User as 📱 Warga (User)
    participant UI as 📱 Login Screen
    participant AuthNotifier as ⚡ Auth State Notifier
    participant Repo as 📦 Auth Repository
    participant Storage as 🔒 FlutterSecureStorage
    participant API as 🚀 Next.js Auth API (/api/auth/login)
    participant DB as 🐘 PostgreSQL Database

    User->>UI: Input Nomor HP & Password
    User->>UI: Tekan Tombol "Masuk"
    UI->>AuthNotifier: login(phone, password)
    AuthNotifier->>Repo: login(phone, password)
    Repo->>API: POST /api/v1/auth/login { phone, password }
    API->>DB: Query User BY phone
    DB-->>API: Data User & PasswordHash
    API->>API: Verifikasi Password (Bcrypt)

    alt Password Valid
        API->>API: Generate Access Token (JWT)
        API-->>Repo: 200 OK { token, user: { id, name, role } }
        Repo->>Storage: write(key: 'jwt_token', value: token)
        Storage-->>Repo: Saved
        Repo-->>AuthNotifier: Success(User)
        AuthNotifier-->>UI: State Updated (Authenticated)
        UI-->>User: Redirect ke Beranda (Home)
    else Password / HP Invalid
        API-->>Repo: 401 Unauthorized { message: "Kredensial tidak valid" }
        Repo-->>AuthNotifier: Error("Kredensial tidak valid")
        AuthNotifier-->>UI: State Updated (Error)
        UI-->>User: Tampilkan SnackBar Error
    end
```

---

## 2. Sequence Diagram: Reading Progress Auto-Sync (PDF Reader)

Menjelaskan alur saat user membaca PDF, memindahkan halaman, dan progress disimpan ke backend secara otomatis (debounced).

```mermaid
sequenceDiagram
    autonumber
    actor User as 📱 Warga (User)
    participant ReaderUI as 📖 PDF Reader Screen
    participant Debouncer as ⏱️ Debounce Timer (2s)
    participant ProgressNotifier as ⚡ Reading Progress Notifier
    participant Repo as 📦 Reading Repository
    participant API as 🚀 Next.js API (/api/me/reading-progress)
    participant DB as 🐘 PostgreSQL (ReadingProgress)

    User->>ReaderUI: Usap / Balik ke Halaman 35
    ReaderUI->>ReaderUI: Update Local UI (CurrentPage = 35)
    ReaderUI->>Debouncer: trigger(currentPage: 35)
    
    note over Debouncer: Menunggu 2 detik tanpa pergeseran halaman baru

    Debouncer->>ProgressNotifier: syncProgress(contentId, page: 35, total: 86)
    ProgressNotifier->>Repo: saveProgress(contentId, page: 35, total: 86)
    Repo->>API: POST /api/v1/me/reading-progress<br/>{ contentId: "book_001", currentPage: 35, totalPages: 86 }
    API->>DB: UPSERT ReadingProgress<br/>WHERE userId = X AND contentId = "book_001"
    DB-->>API: Updated Record (progressPercent = 40.7%)
    
    alt Progress == 100% (Halaman Terakhir)
        API->>DB: Update status = 'COMPLETED'
    end

    API-->>Repo: 200 OK { progressPercent: 40.7, status: "READING" }
    Repo-->>ProgressNotifier: Success
    ProgressNotifier-->>ReaderUI: Synced State Icon (✓ Progress Tersimpan)
```

---

## 3. Sequence Diagram: Resume Reading Flow (Lanjutkan Membaca)

Menjelaskan alur ketika user kembali membuka buku yang pernah dibaca dan ditawari melanjutkan dari halaman terakhir.

```mermaid
sequenceDiagram
    autonumber
    actor User as 📱 Warga (User)
    participant DetailUI as 📑 Detail Buku Screen
    participant ReaderUI as 📖 PDF Reader Screen
    participant Repo as 📦 Reading Repository
    participant API as 🚀 Next.js API (/api/contents/:id/progress)
    participant DB as 🐘 PostgreSQL

    User->>DetailUI: Tekan Tombol "Baca Sekarang"
    DetailUI->>Repo: getReadingProgress(contentId)
    Repo->>API: GET /api/v1/contents/book_001/progress
    API->>DB: Query ReadingProgress WHERE userId = X AND contentId = book_001
    DB-->>API: { currentPage: 35, totalPages: 86, progressPercent: 40.7 }
    API-->>Repo: 200 OK Data Progress
    Repo-->>DetailUI: Return Progress (Page 35)

    alt Progress Ada (currentPage > 1)
        DetailUI->>User: Tampilkan Dialog Prompt:<br/>"Lanjutkan membaca dari halaman 35?"
        
        alt User Pilih "Lanjutkan"
            User->>DetailUI: Tekan "Lanjutkan"
            DetailUI->>ReaderUI: Buka Reader (initialPage: 35)
        else User Pilih "Dari Awal"
            User->>DetailUI: Tekan "Dari Awal"
            DetailUI->>ReaderUI: Buka Reader (initialPage: 1)
        end
    else Belum Ada Progress
        DetailUI->>ReaderUI: Buka Reader (initialPage: 1)
    end
    
    ReaderUI-->>User: Tampilkan PDF Viewer
```

---

## 4. Sequence Diagram: Admin Upload Asset & Publish Content Flow

Menjelaskan alur kerja pengelola perpustakaan dalam mengunggah buku baru ke sistem.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👨‍💼 Admin / Librarian
    participant AdminUI as 💻 Admin Web Form
    participant API as 🚀 Next.js Admin API
    participant Storage as 📦 Object Storage (S3 / Supabase)
    participant DB as 🐘 PostgreSQL (Content & DigitalAsset)

    Admin->>AdminUI: Isi Form Metadata Buku & Pilih File PDF + Cover
    Admin->>AdminUI: Tekan Tombol "Simpan & Publisir"
    AdminUI->>API: POST /api/v1/admin/contents (Multipart / Form-Data)
    
    rect rgb(245, 245, 245)
        note over API, Storage: Proses Upload File Digital
        API->>Storage: Upload Cover Image -> /images/covers/cover_001.jpg
        Storage-->>API: Return Cover Public URL
        API->>Storage: Upload PDF File -> /documents/books/book_001.pdf
        Storage-->>API: Return Storage Key & File Bytes
    end

    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO Content (title, categoryId, status='PUBLISHED', ...)
    DB-->>API: Created Content Record (id: "book_001")
    API->>DB: INSERT INTO DigitalAsset (contentId="book_001", storageKey, ...)
    DB-->>API: Created DigitalAsset Record
    API->>DB: COMMIT TRANSACTION

    API-->>AdminUI: 201 Created { success: true, contentId: "book_001" }
    AdminUI-->>Admin: Tampilkan Pesan Sukses "Buku Berhasil Dipublikasikan"
```
