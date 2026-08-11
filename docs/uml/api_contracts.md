# API Contracts & REST API Specification

Dokumen ini mendefinisikan **Spesifikasi Kontrak REST API** antara **Flutter Mobile Client**, **Next.js Admin Panel**, dan **Next.js Backend API**.

---

## 1. Standar Format Respons API

Semua respons HTTP dari API Next.js dibungkus menggunakan format JSON seragam:

### 1.1 Respons Sukses (200 OK / 201 Created)
```json
{
  "success": true,
  "message": "Berhasil mengambil data katalog",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

### 1.2 Respons Gagal (4xx / 5xx Error)
```json
{
  "success": false,
  "message": "Kredensial tidak valid",
  "error": {
    "code": "UNAUTHORIZED",
    "details": [
      {
        "field": "phone",
        "message": "Nomor telepon atau password salah"
      }
    ]
  }
}
```

---

## 2. Autentikasi & Header HTTP

Setiap request yang membutuhkan otorisasi wajib mengirimkan **Bearer Token** pada HTTP Header:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

## 3. Ringkasan Endpoint API

| Method | Endpoint Route | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| **POST** | `/api/v1/auth/register` | ❌ Public | Registrasi akun warga baru |
| **POST** | `/api/v1/auth/login` | ❌ Public | Authenticate user & dapatkan JWT |
| **GET** | `/api/v1/auth/me` | 🔒 User | Dapatkan profil user logged-in |
| **GET** | `/api/v1/contents` | 🌐 Public/User | Ambil daftar koleksi (Pagination) |
| **GET** | `/api/v1/contents/:id` | 🌐 Public/User | Ambil detail koleksi & asset URL |
| **GET** | `/api/v1/search` | 🌐 Public/User | Cari buku berdasarkan keyword & filter |
| **GET** | `/api/v1/categories` | 🌐 Public/User | Ambil daftar kategori |
| **GET** | `/api/v1/me/reading-progress` | 🔒 User | Ambil progress membaca user saat ini |
| **POST** | `/api/v1/me/reading-progress` | 🔒 User | Upsert progress halaman membaca |
| **GET** | `/api/v1/me/bookshelf` | 🔒 User | Ambil buku di rak (Sedang dibaca, Bookmark, History) |
| **POST** | `/api/v1/me/bookmarks` | 🔒 User | Tambahkan bookmark ke halaman buku |
| **DELETE**| `/api/v1/me/bookmarks/:id` | 🔒 User | Hapus bookmark |
| **POST** | `/api/v1/admin/contents` | 🔑 Admin | Tambah koleksi baru + File Upload |
| **PATCH** | `/api/v1/admin/contents/:id` | 🔑 Admin | Update metadata / status publish |
| **GET** | `/api/v1/admin/analytics/dashboard` | 🔑 Admin | Statistik dashboard pembaca & koleksi |

---

## 4. Spesifikasi Payload Detail

### 4.1 `POST /api/v1/auth/login`
- **Description**: Authenticate user dengan Nomor Telepon & Password.
- **Request Body**:
```json
{
  "phone": "081234567890",
  "password": "Password123"
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_9921a",
      "name": "Kai Santoso",
      "phone": "081234567890",
      "role": "USER",
      "avatarUrl": "https://storage.desa.id/avatars/kai.jpg"
    }
  }
}
```

---

### 4.2 `GET /api/v1/contents`
- **Query Parameters**:
  - `page` (int, default: 1)
  - `limit` (int, default: 20)
  - `category` (string, optional)
  - `contentType` (string, optional: `BOOK`, `MODULE`, `LOCAL_HISTORY`)
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "Berhasil mengambil katalog",
  "data": [
    {
      "id": "book_001",
      "title": "Belajar Bertani Organik",
      "slug": "belajar-bertani-organik",
      "author": {
        "id": "auth_01",
        "name": "Budi Santoso"
      },
      "category": {
        "id": "cat_agri",
        "name": "Pertanian",
        "slug": "pertanian"
      },
      "contentType": "BOOK",
      "publicationYear": 2026,
      "coverUrl": "https://storage.desa.id/covers/bertani_300x450.jpg",
      "viewCount": 342
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
```

---

### 4.3 `POST /api/v1/me/reading-progress`
- **Description**: Menyimpan halaman terakhir yang dibaca pengguna secara realtime.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "contentId": "book_001",
  "currentPage": 35,
  "totalPages": 86
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "Progress membaca tersimpan",
  "data": {
    "contentId": "book_001",
    "currentPage": 35,
    "totalPages": 86,
    "progressPercent": 40.7,
    "status": "READING",
    "lastReadAt": "2026-08-08T18:15:00Z"
  }
}
```

---

### 4.4 `GET /api/v1/me/bookshelf`
- **Description**: Mengambil daftar buku di rak pribadi user (Sedang dibaca, Bookmark, dan Selesai).
- **Headers**: `Authorization: Bearer <token>`
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "Berhasil mengambil data rak",
  "data": {
    "currentlyReading": [
      {
        "contentId": "book_001",
        "title": "Belajar Bertani Organik",
        "coverUrl": "https://storage.desa.id/covers/bertani_300x450.jpg",
        "currentPage": 35,
        "totalPages": 86,
        "progressPercent": 40.7,
        "lastReadAt": "2026-08-08T18:15:00Z"
      }
    ],
    "bookmarks": [
      {
        "id": "bm_0192",
        "contentId": "book_001",
        "title": "Belajar Bertani Organik",
        "pageNumber": 35,
        "note": "Teknik pembuatan pupuk kompos cair",
        "createdAt": "2026-08-08T17:30:00Z"
      }
    ],
    "completed": []
  }
}
```

---

## 5. Matriks Status HTTP Error

| HTTP Code | Error Code | Skenario |
| :--- | :--- | :--- |
| **400** | `BAD_REQUEST` | Payload JSON tidak valid, field mandatory tidak diisi |
| **401** | `UNAUTHORIZED` | Token JWT tidak disertakan atau sudah kadaluarsa |
| **403** | `FORBIDDEN` | User biasa mencoba mengakses endpoint khusus Admin |
| **404** | `NOT_FOUND` | Konten / Buku / ID tidak ditemukan di PostgreSQL |
| **409** | `CONFLICT` | Registrasi dengan Nomor Telepon yang sudah terdaftar |
| **413** | `PAYLOAD_TOO_LARGE` | File PDF / Cover melebihi batas maksimum upload (e.g. > 50MB) |
| **500** | `INTERNAL_SERVER_ERROR` | Kegagalan internal database atau Object Storage |
