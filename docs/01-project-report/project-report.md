# LAPORAN PENGEMBANGAN SISTEM INFORMASI
## Pustaka Pangkalan — Perpustakaan Digital Desa Pangkalan

**Lokasi Program**: Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat  
**Lingkungan Deployment**: [https://perpus-pangkalan.vercel.app](https://perpus-pangkalan.vercel.app)  
**Repositori Kode Sumber**: [https://github.com/ZephyrGraphic/pustaka-pangkalan.git](https://github.com/ZephyrGraphic/pustaka-pangkalan.git)  
**Sifat Dokumen**: *As-Built System Documentation* (Dokumentasi Sistem Terimplementasi)

---

## BAB I — PENDAHULUAN

### 1.1 Latar Belakang
Desa Pangkalan merupakan salah satu desa di wilayah Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat, yang memiliki potensi besar pada sektor pertanian, perkebunan, peternakan rakyat, serta pengembangan unit usaha mikro, kecil, dan menengah (UMKM). Meskipun infrastruktur telekomunikasi dan jaringan internet seluler telah menjangkau sebagian besar wilayah pemukiman di 4 dusun (Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, dan Dusun Pasir Gombong), ketersediaan sumber bacaan dan referensi ilmu pengetahuan terapan yang terkurasi bagi masyarakat pedesaan masih sangat terbatas.

Sebagian besar koleksi buku fisik yang dimiliki oleh balai desa masih dikelola secara konvensional, rentan mengalami kerusakan fisik, dan hanya dapat diakses pada jam kerja kantor desa. Di samping itu, literasi mengenai teknik budidaya pertanian modern, pengolahan pakan organik, sanitasi pencegahan stunting, pembukuan keuangan UMKM desa, serta pelestarian bahasa dan kearifan lokal Sunda belum terdistribusi secara merata kepada generasi muda dan masyarakat produktif desa.

Sebagai wujud kontribusi nyata program Kuliah Kerja Nyata (KKN), dikembangkan sebuah sistem informasi berbasis web yang adaptif, ringan, dan ramah pengguna bernama **Pustaka Pangkalan**. Sistem ini dirancang untuk mendemokratisasi akses literasi desa secara digital sekaligus memodernisasi tata kelola sirkulasi buku fisik yang ada di balai desa.

### 1.2 Identifikasi Masalah
Berdasarkan observasi dan identifikasi di lapangan, dirumuskan beberapa permasalahan utama:
1. **Keterbatasan Akses Bahan Bacaan**: Warga desa di dusun-dusun yang jauh dari balai desa kesulitan mengakses referensi buku cetak secara cepat dan berkala.
2. **Pencatatan Peminjaman Manual**: Pengelolaan sirkulasi buku fisik di balai desa belum terdata secara digital, menyulitkan monitoring buku yang sedang dipinjam, terlambat, atau hilang.
3. **Kendala Literasi Digital & Bahasa**: Warga memerlukan antarmuka yang sangat mudah dipahami (menggunakan NIK dan PIN 6 digit sederhana sebagai pengganti kata sandi rumit) serta dukungan dwibahasa (Bahasa Indonesia dan Basa Sunda) untuk kenyamanan warga lokal.
4. **Kurangnya Motivasi Membaca Mandiri**: Tidak adanya umpan balik langsung atau apresiasi capaian bagi warga yang telah menuntaskan modul pembelajaran.

### 1.3 Tujuan Proyek
1. Merancang dan membangun aplikasi perpustakaan digital desa berbasis web yang dapat diakses secara gratis oleh warga Desa Pangkalan melalui ponsel pintar maupun komputer.
2. Menyediakan modul digital terkurasi dalam 8 kategori tematik pedesaan (Pertanian, Sejarah Sunda, Bisnis UMKM, Kesehatan, Teknologi AI, Pendidikan Anak, Keterampilan Kreatif, dan Agama).
3. Mengembangkan sistem pencatatan sirkulasi peminjaman buku fisik balai desa dengan status otomatis (*Borrowed, Returned, Overdue*).
4. Menyediakan fitur gamifikasi literasi (poin membaca, lencana/badge, dan papan peringkat keaktifan warga).
5. Menyediakan asisten virtual berbasis kecerdasan buatan (*Kades AI*) untuk membantu menjawab pertanyaan warga seputar materi bacaan dan potensi desa.

### 1.4 Manfaat
- **Bagi Warga Desa**: Memperoleh akses ilmu pengetahuan praktis seputar tani, ternak, dan wirausaha desa secara gratis 24 jam tanpa batasan jarak.
- **Bagi Pengelola / Balai Desa**: Memiliki sistem inventarisasi koleksi buku, data peminjam yang tertib per dusun, dan metrik analitik keaktifan membaca masyarakat.
- **Bagi Program KKN & Akademisi**: Menghasilkan artefak sistem informasi pedesaan yang terdokumentasi rapi, teruji kualitasnya (*STQA verified*), dan siap dialihkelolakan kepada aparatur desa.

### 1.5 Sasaran
Sasaran pengguna sistem adalah:
1. Masyarakat umum dan pemuda dari 4 dusun di wilayah Desa Pangkalan, Kec. Cikidang.
2. Pengurus perpustakaan, karang taruna, dan aparatur Balai Desa Pangkalan.

### 1.6 Ruang Lingkup Sistem Terimplementasi (*As-Built Scope*)
Ruang lingkup sistem yang benar-benar terbangun mencakup:
- Portal katalog publik dengan pencarian instan dan filter 8 kategori tematik.
- Pembaca modul e-book berbasis bab (*chapter reader*) dengan penanda bacaan (*bookmark*) dan pencatat kemajuan baca (*reading progress*).
- Sistem autentikasi NIK 16 digit dan PIN 6 digit dengan kartu anggota digital ber-QR code.
- Sistem gamifikasi (Poin, Streak Membaca, dan 3 jenjang Lencana: *Pembaca Rajin, Cendekia Desa, Pelopor Literasi*).
- Panel manajemen pengelola desa (`/admin`) untuk mengelola buku, bab, sirkulasi peminjaman, kategori, dusun, reset PIN warga, warta desa, dan moderasi ulasan.
- Layanan tanya jawab terintegrasi *Kades AI*.
- Dukungan dwibahasa: Bahasa Indonesia (ID) dan Basa Sunda (SU).

---

## BAB II — ANALISIS KEBUTUHAN

### 2.1 Kondisi dan Permasalahan Eksisting
Sebelum sistem dibangun, pencatatan warga dan peminjaman buku cetak di balai desa mengandalkan buku tamu manual. Koleksi terbatas pada buku fisik yang jumlah eksemplarnya sedikit. Warga seringkali tidak mengetahui ketersediaan buku di balai desa sebelum datang langsung.

### 2.2 Aktor Sistem Aktual
Berdasarkan implementasi kode sumber dan basis data, sistem memiliki **2 aktor utama** dan **1 mode pengunjung**:
1. **Warga Desa (`USER`)**: Pengguna terdaftar menggunakan NIK dan PIN. Dapat membaca bab buku, memberi rating/ulasan, mengelola rak buku pribadi, memperoleh poin, dan berkonsultasi dengan Kades AI.
2. **Pengelola Balai Desa (`ADMIN`)**: Aparatur atau pengurus perpustakaan yang memiliki wewenang mengelola konten, melayani sirkulasi fisik, mereset PIN warga, dan memantau analitik.
3. **Tamu (Guest)**: Pengunjung yang belum melakukan login; dapat melihat beranda, katalog buku, dan warta desa.

### 2.3 Kebutuhan Fungsional (*Functional Requirements*)

| Kode | Kebutuhan Fungsional | Aktor Terkait | Bukti Implementasi Kode Sumber |
|---|---|---|---|
| **FR-01** | Pendaftaran warga baru dengan NIK 16 digit, Nama, PIN 6 digit, dan pemilihan Dusun | Warga | `src/app/login/page.tsx`, `src/app/onboarding/page.tsx`, `/api/auth/register` |
| **FR-02** | Masuk sistem (Login) menggunakan NIK dan PIN terenkripsi | Warga, Admin | `src/app/login/page.tsx`, `src/lib/auth.ts`, NextAuth Credentials |
| **FR-03** | Penjelajahan katalog buku dengan pencarian teks dan filter kategori dinamis | Tamu, Warga | `src/app/explore/page.tsx`, `/api/books`, `/api/categories` |
| **FR-04** | Pembacaan buku digital per bab dengan navigasi antar-bab | Warga | `src/app/read/[chapterId]/page.tsx`, `/api/read/[chapterId]` |
| **FR-05** | Penyimpanan penanda halaman baca (*bookmark*) dan riwayat kemajuan | Warga | `src/app/books/[id]/page.tsx`, `/api/bookmarks`, `/api/reading-progress` |
| **FR-06** | Pengelolaan rak buku favorit pribadi warga | Warga | `src/app/shelf/page.tsx`, `/api/shelf` |
| **FR-07** | Pemberian rating bintang (1-5) dan ulasan komentar pada buku | Warga | `src/app/books/[id]/page.tsx`, `/api/reviews` |
| **FR-08** | Kartu anggota digital warga ber-QR Code dengan ringkasan poin dan lencana | Warga | `src/app/profile/page.tsx`, `/api/user/profile` |
| **FR-09** | Pengalihan bahasa antarmuka antara Bahasa Indonesia dan Basa Sunda | Semua Aktor | `src/components/LanguageProvider.tsx`, `src/components/layout/TopAppBar.tsx` |
| **FR-10** | Konsultasi materi bacaan dan informasi desa dengan Kades AI | Warga | `src/components/KadesAIChatModal.tsx`, `/api/ai/chat` |
| **FR-11** | Manajemen katalog buku fisik dan digital (Tambah, Edit, Hapus) | Admin | `src/app/admin/books/page.tsx`, `src/app/admin/books/new/page.tsx` |
| **FR-12** | Manajemen konten bab bacaan buku (*chapter editor*) | Admin | `src/app/admin/books/[id]/chapters/page.tsx`, `/api/admin/chapters` |
| **FR-13** | Pencatatan sirkulasi peminjaman buku fisik balai desa | Admin | `src/app/admin/circulation/page.tsx`, `/api/admin/circulation` |
| **FR-14** | Perpanjangan masa pinjam buku (+7 hari) dan penandaan pengembalian buku | Admin | `src/app/admin/circulation/page.tsx`, `/api/admin/circulation` (PATCH) |
| **FR-15** | Manajemen 8 kategori tematik buku desa (CRUD) dengan cascade update nama buku | Admin | `src/app/admin/categories/page.tsx`, `/api/admin/categories` |
| **FR-16** | Manajemen data 4 dusun resmi dan penghitungan sebaran warga | Admin | `src/app/admin/dusuns/page.tsx`, `/api/admin/dusuns` |
| **FR-17** | Manajemen akun warga dan fasilitas reset PIN warga oleh pengelola | Admin | `src/app/admin/users/page.tsx`, `/api/admin/users` (PATCH reset-pin) |
| **FR-18** | Moderasi dan penghapusan ulasan yang tidak pantas | Admin | `src/app/admin/reviews/page.tsx`, `/api/admin/reviews` |
| **FR-19** | Publikasi dan pengelolaan warta maklumat literasi desa | Admin | `src/app/admin/announcements/page.tsx`, `/api/admin/announcements` |
| **FR-20** | Dashboard analitik literasi desa (total buku, warga, sirkulasi aktif, grafik) | Admin | `src/app/admin/page.tsx`, `src/app/admin/analytics/page.tsx` |

### 2.4 Kebutuhan Non-Fungsional (*Non-Functional Requirements*)
1. **Keamanan (Security)**:
   - Kata sandi (PIN 6 digit) disimpan dalam bentuk hash searah menggunakan algoritma **Bcrypt** (salt 10 rounds).
   - Seluruh rute administratif (`/admin/*`) dilindungi oleh proxy middleware; pengguna tanpa peran `ADMIN` akan ditolak dan diarahkan ke beranda.
   - Variabel rahasia database dan otentikasi diproteksi melalui environment variable Vercel dan tidak terpapar ke sisi klien.
2. **Kinerja & Skalabilitas (Performance)**:
   - Penggunaan arsitektur serverless Next.js dengan caching pintar SWR di sisi klien untuk meminimalkan beban koneksi database.
   - Gambar sampul dan logo dioptimalkan secara otomatis oleh Next.js Image Optimization.
   - Pemanfaatan pool koneksi WebSocket serverless Neon untuk ketahanan terhadap latensi jaringan seluler.
3. **Aksesibilitas & Responsivitas (Usability)**:
   - Tampilan responsif optimal untuk layar ponsel pintar (*mobile-first design*) mengingat mayoritas warga desa mengakses melalui smartphone.
   - Waktu muat halaman ringan dengan ukuran bundle JavaScript teroptimasi.

---

## BAB III — PERANCANGAN DAN ARSITEKTUR AS-BUILT

### 3.1 Gambaran Umum Sistem
Sistem Informasi Perpustakaan Digital Desa Pangkalan dibangun dengan paradigma **Fullstack Serverless Application** menggunakan framework Next.js App Router. Logika tampilan (React Server & Client Components) dan logika backend (Route Handlers) berada dalam satu kesatuan repository (*monolithic repo*), namun dieksekusi secara terdistribusi pada Vercel Edge/Serverless Infrastructure dan terhubung ke basis data PostgreSQL Neon.

### 3.2 System Flow
Alur penelusuran warga dan pengelola desa dirancang sesederhana mungkin:
1. Warga membuka tautan `https://perpus-pangkalan.vercel.app`.
2. Warga dapat langsung membaca sinopsis di katalog atau masuk menggunakan NIK dan PIN.
3. Saat membaca e-book, sistem secara otomatis menyimpan posisi halaman dan mencatat poin gamifikasi saat bab diselesaikan.
4. Petugas balai desa masuk melalui rute `/login`, kemudian sistem mendeteksi peran `ADMIN` dan memunculkan tombol akses langsung ke dashboard pengelola `/admin`.

*(Diagram lengkap terlampir pada [docs/05-diagrams/system-flow.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/system-flow.md))*

### 3.3 Use Case Sistem
Sistem membedakan secara tegas hak akses antara warga dan pengelola. Terdapat 11 use case utama bagi warga desa dan 10 use case khusus bagi pengelola desa.

*(Diagram lengkap terlampir pada [docs/05-diagrams/use-case.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/use-case.md))*

### 3.4 Arsitektur Sistem
Arsitektur terdiri dari 4 tingkatan (*tiers*):
- **Client Tier**: Web Browser pada smartphone warga dan PC balai desa.
- **Edge / CDN Tier**: Jaringan CDN Vercel untuk routing SSL/TLS, middleware keamanan, dan penyajian aset statis.
- **Application Tier**: Runtime Next.js 16 App Router yang mengeksekusi Server Components dan RESTful Route Handlers.
- **Database Tier**: Klaster PostgreSQL Neon Serverless dengan 10 tabel relasional yang dikelola melalui Prisma ORM.

*(Diagram lengkap terlampir pada [docs/05-diagrams/architecture.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/architecture.md))*

### 3.5 Basis Data & Entity Relationship Diagram (ERD)
Basis data mengimplementasikan 10 entitas saling berelasi:
- `User` 1-ke-N dengan `Bookmark`, `ReadingProgress`, `Review`, dan `BorrowRecord`.
- `Dusun` 1-ke-N dengan `User` (untuk segmentasi warga per dusun).
- `Category` 1-ke-N dengan `Book` (untuk pengelompokan tematik).
- `Book` 1-ke-N dengan `Chapter`, `Bookmark`, `ReadingProgress`, `Review`, dan `BorrowRecord`.
- `Announcement` berdiri mandiri untuk warta publik desa.

*(Diagram lengkap dan kamus data terlampir pada [docs/05-diagrams/erd.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/erd.md))*

---

## BAB IV — IMPLEMENTASI SISTEM

### 4.1 Teknologi Aktual yang Digunakan
- **Bahasa Pemrograman**: TypeScript v5.x
- **Framework Aplikasi**: Next.js v16.3.0 (React v19.2.8)
- **Framework Tampilan**: Tailwind CSS v4 dengan Material You token & Lucide React
- **ORM & Database**: Prisma ORM v7.9.1 dengan adapter `@prisma/adapter-neon` dan PostgreSQL Neon Serverless
- **Pustaka Autentikasi**: NextAuth.js v4.24.15 & `bcryptjs` v3.0.3
- **Validasi Data**: Zod v4.5.4
- **State Management & Fetching**: SWR v2.5.1

### 4.2 Struktur Direktori Proyek
```text
/
├── prisma/
│   └── schema.prisma            # Definisi 10 model Prisma dan enum
├── public/
│   ├── icon.svg                 # Favicon resmi Lambang Kabupaten Sukabumi
│   ├── logo_sukabumi.webp       # Logo transparan untuk UI
│   ├── og-image.png             # Thumbnail OpenGraph media sosial (1200x630)
│   └── manifest.json            # Konfigurasi PWA mobile
├── src/
│   ├── app/                     # 19 Halaman Rute dan 30 API Route Handlers
│   │   ├── admin/               # Area khusus pengelola balai desa
│   │   ├── api/                 # Endpoint RESTful backend
│   │   ├── books/               # Halaman detail buku publik
│   │   ├── explore/             # Katalog pencarian buku dinamis
│   │   ├── login/               # Halaman masuk & pendaftaran NIK
│   │   ├── onboarding/          # Panduan aktivasi akun warga baru
│   │   ├── profile/             # Profil & Kartu Anggota Digital
│   │   ├── read/                # E-Book reader per bab
│   │   └── shelf/               # Rak koleksi pribadi warga
│   ├── components/              # Komponen modular UI & penyedia konteks
│   ├── lib/                     # Inisialisasi Prisma, Auth, dan Zod schemas
│   └── middleware.ts            # Proxy pelindung akses rute berbasis sesi
└── docs/                        # Paket dokumentasi proyek lengkap
```

### 4.3 Implementasi Branding Desa
Sistem menggunakan lambang resmi **Kabupaten Sukabumi** (`Lambang_Kab_Sukabumi.svg` dan `.webp`) yang terpasang pada:
1. Ikon tab peramban web (*browser favicon* SVG tajam).
2. Header bilah navigasi atas (*Top App Bar*).
3. Bagian kepala sidebar navigasi admin balai desa.
4. Halaman utama autentikasi login warga.
5. Banner thumbnail media sosial beresolusi 1200x630 piksel untuk pratinjau tautan WhatsApp/Facebook dengan teks resmi: *"Gerbang Literasi Mandiri Desa Pangkalan, Kec. Cikidang"*.

---

## BAB V — PENGUJIAN SISTEM (STQA AUDIT)

Pengujian kualitas perangkat lunak (*Software Testing and Quality Assurance*) dilakukan secara otomatis menggunakan test runner `scratch/run_full_stqa_test.ts` yang mencakup 9 test suite dan 48 skenario uji fungsional, keamanan, integritas data, dan ketahanan transaksi.

### 5.1 Rangkuman Hasil Pengujian Otomatis

| Suite ID | Modul Pengujian | Jumlah Kasus | Lulus | Gagal | Tingkat Kelulusan |
|---|---|:---:|:---:|:---:|:---:|
| **SUITE 1** | Database & Schema Integrity Audit | 4 | 4 | 0 | 100.0% |
| **SUITE 2** | Authentication & RBAC Security Audit | 4 | 4 | 0 | 100.0% |
| **SUITE 3** | User CRUD & Dusun Synchronization | 7 | 7 | 0 | 100.0% |
| **SUITE 4** | Dusun Management & Cascade Update | 3 | 3 | 0 | 100.0% |
| **SUITE 5** | Live API Endpoint & Route Handler Health | 4 | 4 | 0 | 100.0% |
| **SUITE 6** | Relational Foreign Key Integrity | 4 | 4 | 0 | 100.0% |
| **SUITE 7** | Zod Runtime Schema Validation | 5 | 5 | 0 | 100.0% |
| **SUITE 8** | Physical Book Circulation CRUD Verification | 7 | 7 | 0 | 100.0% |
| **SUITE 9** | Book Category Management & Cascade Audit | 10 | 10 | 0 | 100.0% |
| **TOTAL** | **Pengujian Menyeluruh (Full STQA)** | **48** | **48** | **0** | **100.0%** |

### 5.2 Tabel Skenario Black-Box Testing Terverifikasi

| Test ID | Modul | Skenario Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|:---:|
| **TC-01** | Integritas DB | Pengecekan pendaftaran 4 dusun resmi desa di database | Terdaftar 4 dusun resmi (Pangkalan, Cikajang, Pasir Arangan, Pasir Gombong) | 4 dusun resmi ditemukan lengkap | ✅ PASS |
| **TC-02** | Keamanan RBAC | Verifikasi pencocokan kata sandi bcrypt admin | Bcrypt compare mengembalikan true untuk hash yang tersimpan | Hash cocok dengan PIN yang ditentukan | ✅ PASS |
| **TC-03** | Keamanan RBAC | Percobaan pengubahan role mandiri oleh akun warga biasa | Permintaan ditolak tanpa izin admin | Role warga tetap `USER` dan tidak tereskalasi | ✅ PASS |
| **TC-04** | User CRUD | Pembaruan alamat dusun warga antar-dusun resmi | Data alamat dan dusunId tersimpan konsisten di database | Alamat dusun warga berhasil diperbarui | ✅ PASS |
| **TC-05** | User Auth | Reset PIN akun warga oleh pengelola via bcrypt | PIN baru dapat digunakan untuk verifikasi login | Bcrypt compare berhasil pada PIN baru | ✅ PASS |
| **TC-06** | Sirkulasi | Pembuatan record peminjaman buku fisik (POST) | Record terbit dengan status BORROWED dan dueDate 7 hari | Data pinjam tersimpan dengan benar | ✅ PASS |
| **TC-07** | Sirkulasi | Perpanjangan masa pinjam (+7 hari) | Nilai `dueDate` bertambah tepat 7 hari kalender | Tanggal jatuh tempo bertambah 7 hari | ✅ PASS |
| **TC-08** | Sirkulasi | Pengembalian buku fisik (Tandai Kembali) | Status berubah menjadi RETURNED dan field `returnDate` terisi | Status sukses berubah dan returnDate tercatat | ✅ PASS |
| **TC-09** | Kategori | Pengecekan 8 kategori tematik Desa Pangkalan | Terdaftar 8 kategori resmi dengan slug unik | 8 kategori aktif ditemukan lengkap | ✅ PASS |
| **TC-10** | Kategori | Penghapusan kategori yang masih memiliki buku terkait | Buku terkait tidak terhapus, melainkan dialihkan ke "Umum" | Relasi buku aman dan kategori terhapus bersih | ✅ PASS |
| **TC-11** | Proteksi Login | Pengguna yang sudah login mengakses URL `/login` | Pengguna otomatis dialihkan ke halaman utama `/` | Sesi aktif mencegah rendering form login | ✅ PASS |

---

## BAB VI — PENUTUP

### 6.1 Kesimpulan
Proyek pengembangan **Pustaka Pangkalan** telah berhasil diselesaikan secara tuntas sesuai dengan kebutuhan nyata literasi masyarakat di Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi. Sistem ini berhasil menggabungkan kemudahan membaca modul digital tematik bagi warga desa dengan efisiensi pengelolaan sirkulasi buku fisik bagi pengurus balai desa. Berdasarkan hasil pengujian kualitas perangkat lunak (STQA) dengan 48 skenario uji, sistem dinyatakan andal, aman dari eskalasi hak akses ilegal, dan memiliki integritas data yang kokoh.

### 6.2 Keterbatasan Sistem Aktual
Sebagai dokumentasi sistem terimplementasi (*as-built*), dicatat beberapa batasan operasional yang ada saat ini:
1. **Penyimpanan Berkas Sampul & PDF**: Saat ini menggunakan URL berkas statis publik; belum terintegrasi dengan storage berbasis S3 bucket mandiri.
2. **Koneksi Internet**: Aplikasi memerlukan koneksi internet aktif untuk sinkronisasi database serverless Neon.
3. **Domain Saat Ini**: Beroperasi di bawah subdomain Vercel (`https://perpus-pangkalan.vercel.app`), belum menggunakan domain resmi pemerintah desa (`desa.id`).

### 6.3 Rekomendasi Operasional bagi Pihak Desa
Untuk menjamin keberlanjutan pemanfaatan sistem setelah serah terima program KKN:
1. **Penunjukan Operator Balai Desa**: Menugaskan 1 hingga 2 staf balai desa atau pengurus karang taruna sebagai administrator resmi untuk mencatat sirkulasi peminjaman buku fisik dan membantu warga yang lupa PIN.
2. **Sosialisasi Melalui Warta Desa**: Memanfaatkan fitur warta pengumuman desa untuk menginformasikan kegiatan literasi atau modul pertanian baru yang telah diunggah.
3. **Pendaftaran Domain Resmi Desa (Opsional)**: Jika anggaran desa memungkinkan, pihak desa dapat mengajukan domain resmi `pangkalan-sukabumi.desa.id` melalui Kementerian Kominfo/Dinas Kominfo Kabupaten Sukabumi untuk dihubungkan ke sistem Vercel yang telah berjalan.
