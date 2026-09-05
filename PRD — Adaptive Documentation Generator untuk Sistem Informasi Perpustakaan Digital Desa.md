# PRODUCT REQUIREMENTS DOCUMENT
## Adaptive Documentation Generator — Sistem Informasi Perpustakaan Digital Desa

### 1. PROJECT CONTEXT

Saya memiliki sebuah proyek KKN berupa **Sistem Informasi Perpustakaan Digital Desa**.

Aplikasi web **sudah selesai dikembangkan**, source code sudah tersedia di repository GitHub, dan aplikasi sudah pernah di-deploy menggunakan Vercel untuk kebutuhan testing/demo.

Tujuan pekerjaan ini **BUKAN membangun ulang aplikasi** dan **BUKAN menambahkan fitur baru ke aplikasi**, melainkan melakukan **reverse engineering terhadap sistem yang sudah ada** untuk menghasilkan dokumentasi proyek yang lengkap, akurat, dan siap digunakan untuk:

1. Dokumentasi program kerja KKN.
2. Dokumentasi teknis untuk pihak desa.
3. Panduan penggunaan bagi pihak desa.
4. Dokumentasi serah terima sistem.
5. Dokumentasi repository/developer agar sistem dapat dipelihara di kemudian hari.

---

# 2. PRINCIPLE UTAMA — ACTUAL SYSTEM FIRST

## WAJIB DIPATUHI

Seluruh dokumentasi HARUS dibuat berdasarkan kondisi aktual source code, database/schema, konfigurasi, UI, routing, komponen, API, dan fitur yang benar-benar terdapat di repository.

**JANGAN mengasumsikan fitur hanya karena aplikasi disebut "perpustakaan digital".**

Contoh:

Jika source code TIDAK memiliki sistem peminjaman buku, JANGAN membuat dokumentasi tentang peminjaman.

Jika TIDAK memiliki registrasi pengguna, JANGAN mendokumentasikan registrasi pengguna.

Jika TIDAK memiliki kategori buku, JANGAN membuat kategori buku.

Jika role yang tersedia hanya satu jenis administrator, JANGAN membuat role tambahan.

Jika database menggunakan struktur tertentu, dokumentasikan struktur aktual tersebut.

Jika teknologi berbeda dari contoh di bawah, gunakan teknologi aktual repository.

Contoh teknologi seperti Next.js, Prisma, PostgreSQL, Vercel, dan sebagainya **HANYA contoh** dan TIDAK BOLEH dianggap sebagai fakta sebelum repository diperiksa.

### Aturan prioritas informasi

Gunakan prioritas berikut:

```text
SOURCE CODE AKTUAL
       ↓
DATABASE / SCHEMA AKTUAL
       ↓
ROUTING & API AKTUAL
       ↓
UI / SCREEN AKTUAL
       ↓
CONFIGURATION AKTUAL
       ↓
README / DOCUMENTATION YANG SUDAH ADA
       ↓
ASUMSI
```

**Asumsi harus dihindari.**

Jika suatu informasi tidak dapat dipastikan dari repository, tandai sebagai:

> "Belum dapat diverifikasi dari source code."

Jangan mengarang.

---

# 3. TUGAS UTAMA

Lakukan proses berikut secara berurutan:

```text
PHASE 1
Repository Discovery
        ↓
PHASE 2
System Reverse Engineering
        ↓
PHASE 3
Feature & Flow Mapping
        ↓
PHASE 4
Database & Architecture Analysis
        ↓
PHASE 5
Documentation Planning
        ↓
PHASE 6
Documentation Generation
        ↓
PHASE 7
Consistency Validation
        ↓
PHASE 8
Final Documentation Package
```

---

# 4. PHASE 1 — REPOSITORY DISCOVERY

Pertama-tama, jangan langsung menulis dokumentasi.

Periksa repository secara menyeluruh.

Identifikasi minimal:

- Framework.
- Programming language.
- Package manager.
- Dependency utama.
- Frontend architecture.
- Backend architecture jika ada.
- Database.
- ORM jika ada.
- Authentication jika ada.
- Authorization/role jika ada.
- Storage jika ada.
- API/endpoints.
- Routing.
- Environment variables.
- Deployment configuration.
- Struktur folder.
- Struktur database.
- Model/entity.
- Komponen utama.
- Halaman utama.
- Dashboard.
- Admin area jika memang ada.
- Public area jika memang ada.
- Fitur yang benar-benar tersedia.
- Integrasi eksternal jika ada.

Jangan membuat perubahan terhadap source code pada tahap ini.

---

# 5. PHASE 2 — REVERSE ENGINEERING

Setelah repository dipahami, buat model internal mengenai sistem aktual.

Identifikasi:

## 5.1 Aktor

Temukan semua aktor berdasarkan implementasi aktual.

Contoh:

- Public user.
- Administrator.
- Staff.
- Guest.

Tetapi **jangan menggunakan contoh tersebut kecuali benar-benar ditemukan dalam sistem.**

Jika hanya ada satu aktor, dokumentasikan satu aktor.

---

## 5.2 Modul Sistem

Identifikasi modul berdasarkan source code.

Contoh kemungkinan:

- Authentication.
- Book management.
- Catalog.
- Category management.
- Dashboard.
- User management.

Tetapi daftar tersebut hanya contoh.

Gunakan **modul aktual**.

---

## 5.3 User Flow

Rekonstruksi alur aktual:

```text
User
 ↓
Landing / Entry Point
 ↓
Navigation
 ↓
Feature
 ↓
Action
 ↓
System Response
```

Buat flow terpisah jika terdapat beberapa aktor atau workflow.

---

## 5.4 Business Logic

Identifikasi aturan bisnis yang benar-benar diterapkan oleh aplikasi.

Contoh:

- Validation.
- Authentication requirement.
- Authorization.
- CRUD restrictions.
- Search/filter behavior.
- Data relationship.
- Status transitions.
- Upload restrictions.
- Error handling.

Jangan membuat business rule baru.

---

# 6. PHASE 3 — FEATURE MAPPING

Buat inventory seluruh fitur aktual.

Gunakan format:

| ID | Feature | Module | Actor | Description | Evidence |
|---|---|---|---|---|---|
| F-001 | [Actual Feature] | [Actual Module] | [Actual Actor] | [Actual behavior] | [File/route/component] |

Setiap fitur harus memiliki evidence dari repository jika memungkinkan.

Contoh evidence:

```text
/app/dashboard/page.tsx
/app/api/books/route.ts
/prisma/schema.prisma
/components/...
```

Jangan menciptakan fitur hanya untuk membuat tabel terlihat lengkap.

---

# 7. PHASE 4 — DATABASE ANALYSIS

Jika repository memiliki database/schema, analisis database aktual.

Identifikasi:

- Tables/models.
- Primary keys.
- Foreign keys.
- Relations.
- Required fields.
- Optional fields.
- Enum/status.
- Unique constraints.
- Important indexes jika relevan.

Kemudian buat **ERD berdasarkan database aktual**.

ERD harus menggambarkan:

> CURRENT / AS-BUILT DATABASE

Bukan rancangan database hipotetis.

Jika tidak ada database atau schema yang dapat dianalisis, jangan mengarang ERD.

Sebagai gantinya dokumentasikan bahwa struktur database tidak dapat direkonstruksi dari repository yang tersedia.

---

# 8. PHASE 5 — SYSTEM ARCHITECTURE

Buat diagram arsitektur berdasarkan implementasi aktual.

Diagram harus menjawab:

```text
User
  ↓
Client / Browser
  ↓
Application
  ↓
API / Server Logic
  ↓
Database / External Services
```

Namun bentuk akhirnya harus mengikuti arsitektur sebenarnya.

Jika aplikasi menggunakan serverless, jelaskan serverless.

Jika menggunakan monolith, jelaskan monolith.

Jika tidak memiliki backend terpisah, jangan menggambarkan backend sebagai server terpisah.

Jika menggunakan layanan eksternal, identifikasi layanan tersebut berdasarkan konfigurasi aktual.

---

# 9. PHASE 6 — SYSTEM FLOW DIAGRAM

Buat diagram alur sistem aktual.

Minimal dokumentasikan:

### A. General System Flow

```text
Entry
 ↓
Main Interface
 ↓
Navigation
 ↓
Feature
 ↓
Result
```

### B. Administrative Flow

Hanya jika sistem memiliki administrator/admin functionality.

### C. Public/User Flow

Hanya jika sistem memiliki public/user functionality.

### D. Important Business Flow

Tambahkan hanya workflow yang benar-benar penting dan tersedia.

---

# 10. PHASE 7 — USE CASE

Jika sistem memiliki aktor dan fitur yang cukup jelas, buat Use Case Diagram berdasarkan sistem aktual.

Use case harus berasal dari fitur yang benar-benar ada.

Contoh struktur:

```text
Actor
 │
 ├── Actual Use Case 1
 ├── Actual Use Case 2
 └── Actual Use Case 3
```

Jangan menambahkan use case yang tidak diimplementasikan.

Jika Use Case Diagram tidak memberikan nilai yang berarti karena sistem sangat sederhana, dokumentasikan alasannya dan gunakan System Flow sebagai dokumentasi utama.

---

# 11. PHASE 8 — ACTIVITY DIAGRAM

Buat Activity Diagram hanya untuk workflow yang benar-benar relevan.

Jangan membuat Activity Diagram untuk setiap tombol atau setiap halaman.

Prioritaskan workflow penting seperti:

- Authentication.
- Data management.
- Main user journey.
- Administrative workflow.

Jika suatu workflow tidak ada, jangan dibuat.

---

# 12. PHASE 9 — DOCUMENTATION PACKAGE

Hasil akhir harus dibagi menjadi beberapa dokumentasi.

## DOCUMENT 01 — LAPORAN PENGEMBANGAN SISTEM

Dokumen formal untuk kebutuhan program kerja KKN.

Struktur adaptif:

### BAB I — PENDAHULUAN

- Latar Belakang.
- Identifikasi Masalah.
- Tujuan.
- Manfaat.
- Sasaran.
- Ruang Lingkup.

### BAB II — ANALISIS KEBUTUHAN

- Kondisi/permasalahan.
- Kebutuhan sistem.
- Aktor.
- Kebutuhan fungsional.
- Kebutuhan non-fungsional jika dapat diverifikasi.

### BAB III — PERANCANGAN DAN ARSITEKTUR

- Gambaran sistem.
- System Flow.
- Use Case jika relevan.
- Activity Diagram jika relevan.
- Arsitektur.
- ERD/database.
- Struktur modul.

### BAB IV — IMPLEMENTASI

- Teknologi yang digunakan.
- Implementasi fitur.
- Implementasi database.
- Authentication/authorization jika ada.
- Deployment.

### BAB V — PENGUJIAN

Buat black-box testing berdasarkan fitur aktual.

Format:

| ID | Fitur | Skenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|

Jangan membuat hasil pengujian palsu.

Jika repository tidak menyediakan bukti bahwa pengujian tertentu pernah dilakukan, labeli sebagai:

> Test case yang perlu divalidasi secara manual.

Jangan menyatakan "berhasil" jika tidak dapat diverifikasi.

### BAB VI — PENUTUP

- Kesimpulan.
- Keterbatasan sistem.
- Rekomendasi pengembangan.

Rekomendasi hanya boleh berupa:

1. Improvement yang relevan dengan sistem aktual.
2. Kebutuhan operasional yang masuk akal.
3. Hal yang memang belum tersedia tetapi secara jelas relevan.

Jangan menambahkan roadmap produk yang tidak relevan.

---

# 13. DOCUMENT 02 — USER MANUAL

Buat panduan penggunaan untuk pihak desa.

Bahasa harus sederhana dan non-teknis.

Dokumen harus mengikuti fitur aktual.

Struktur:

### 1. Tentang Sistem

### 2. Cara Mengakses Sistem

### 3. Tampilan Utama

### 4. Panduan Setiap Fitur

Untuk setiap fitur:

```text
Nama Fitur

Tujuan:
[Penjelasan]

Langkah:
1. ...
2. ...
3. ...

Hasil:
...
```

Jika diperlukan, gunakan screenshot dari UI aktual.

### 5. Panduan Administrator

Hanya jika ada administrator.

### 6. Troubleshooting

Buat berdasarkan error/problem yang relevan dengan sistem aktual.

Jangan membuat daftar masalah generik yang tidak relevan.

### 7. FAQ

Buat berdasarkan penggunaan aktual sistem.

---

# 14. DOCUMENT 03 — TECHNICAL DOCUMENTATION

Dokumentasi untuk developer atau pihak yang nantinya melakukan maintenance.

Isi:

## System Overview

## Technology Stack

Gunakan teknologi aktual.

## Architecture

## Project Structure

Tampilkan struktur folder yang relevan.

## Routing

Dokumentasikan route aktual.

## API

Jika ada API.

## Database

Gunakan schema aktual.

## Authentication

Jika ada.

## Authorization

Jika ada.

## Environment Variables

Jelaskan fungsi setiap environment variable.

**JANGAN PERNAH menampilkan secret value.**

Jangan menampilkan:

- Password.
- API key.
- Secret.
- Token.
- Private credential.
- Database password.

## Deployment

Dokumentasikan deployment aktual yang dapat diverifikasi dari repository/configuration.

Jika Vercel digunakan, jelaskan hanya jika memang dapat diverifikasi.

## Maintenance

Jelaskan cara developer memahami dan memelihara sistem.

---

# 15. DOCUMENT 04 — HANDOVER DOCUMENT

Buat dokumen singkat yang ditujukan kepada pihak desa.

Judul:

> DOKUMEN SERAH TERIMA SISTEM INFORMASI PERPUSTAKAAN DIGITAL DESA

Isi:

### 1. Identitas Program

Gunakan informasi yang tersedia.

Jika nama desa/universitas/periode tidak tersedia di repository, gunakan placeholder.

### 2. Deskripsi Sistem

### 3. Tujuan Sistem

### 4. Fitur yang Diserahkan

Gunakan feature inventory aktual.

### 5. Akses Sistem

Dokumentasikan URL jika tersedia.

### 6. Source Code

Dokumentasikan repository jika URL tersedia.

### 7. Status Sistem

Jelaskan kondisi aktual.

Contoh konsep:

> Sistem telah dikembangkan dan tersedia dalam lingkungan deployment untuk kebutuhan pengujian/demonstrasi. Implementasi production permanen, domain resmi, hosting berbayar, backup, dan pengelolaan operasional selanjutnya dapat ditentukan bersama pihak desa sesuai kebutuhan.

**Jangan menyatakan production-ready jika tidak dapat diverifikasi.**

### 8. Batasan Sistem

Gunakan keterbatasan aktual.

### 9. Rekomendasi Operasional

Hanya yang relevan.

### 10. Pernyataan Serah Terima

Siapkan bagian untuk:

- Pihak mahasiswa/KKN.
- Pihak desa.
- Tanggal.
- Tanda tangan.

---

# 16. DOCUMENT 05 — README GITHUB

Periksa README yang sudah ada.

Jika README belum memadai, buat/revisi README berdasarkan repository aktual.

Minimal:

```text
Project Overview
Features
Technology Stack
Project Structure
Requirements
Installation
Environment Variables
Database Setup
Development
Build
Deployment
Maintenance
```

Jangan memasukkan credential.

Jangan mendokumentasikan command yang tidak sesuai dengan package manager/project aktual.

---

# 17. DOCUMENT 06 — DOCUMENTATION INDEX

Buat satu halaman index yang menjelaskan seluruh dokumentasi.

Contoh:

```text
Documentation
│
├── 01 - Laporan Pengembangan Sistem
├── 02 - User Manual
├── 03 - Technical Documentation
├── 04 - Handover Document
├── 05 - README
└── 06 - Diagrams
```

Sesuaikan nama file dengan hasil akhir.

---

# 18. DIAGRAM REQUIREMENTS

Diagram tidak boleh dibuat sekadar untuk memenuhi jumlah.

Prioritaskan diagram berikut:

### Required if applicable

1. System Flow Diagram.
2. Architecture Diagram.
3. ERD.

### Optional / conditional

4. Use Case Diagram.
5. Activity Diagram.
6. Sequence Diagram.

**Gunakan hanya jika diagram tersebut benar-benar membantu menjelaskan sistem.**

Jangan membuat Sequence Diagram jika tidak diperlukan.

Jangan membuat DFD hanya karena dokumentasi sistem informasi biasanya menggunakan DFD.

Jika DFD tidak cocok dengan arsitektur aktual, jangan dipaksakan.

---

# 19. AS-BUILT DOCUMENTATION

Dokumentasi ini harus secara eksplisit membedakan antara:

### Planned / Conceptual

dan

### Actual / Implemented

Jika tidak terdapat dokumentasi desain awal, jangan berpura-pura bahwa diagram tersebut merupakan desain sebelum implementasi.

Gunakan terminology:

> As-Built System Documentation

atau:

> Dokumentasi Sistem Terimplementasi

Artinya diagram dan dokumentasi menggambarkan sistem sebagaimana sistem tersebut benar-benar dibangun.

---

# 20. AI-ASSISTED DEVELOPMENT DISCLOSURE

Jangan mengubah dokumentasi menjadi pembahasan mengenai AI/agent.

Namun jika diperlukan untuk dokumentasi akademik, siapkan bagian opsional:

> Proses pengembangan memanfaatkan AI-assisted development sebagai alat bantu dalam proses implementasi, eksplorasi kode, debugging, dan pengembangan fitur. Validasi terhadap implementasi, fungsi sistem, dan hasil akhir dilakukan berdasarkan sistem yang telah dibangun.

Jangan menyatakan bahwa AI melakukan seluruh pekerjaan secara otomatis.

Jangan membuat klaim yang tidak dapat diverifikasi.

---

# 21. SCREENSHOT STRATEGY

Identifikasi halaman UI yang benar-benar ada.

Prioritaskan screenshot:

1. Landing/home.
2. Main feature.
3. Catalog/data view jika ada.
4. Detail view jika ada.
5. Authentication jika ada.
6. Dashboard jika ada.
7. Administrative feature jika ada.
8. Form utama.
9. Mobile/responsive view jika relevan.

Jangan membuat screenshot untuk fitur yang tidak ada.

Jika screenshot tidak dapat diambil secara otomatis, buat daftar screenshot yang perlu diambil secara manual.

Format:

```text
Screenshot S-001
Page:
Purpose:
What should be visible:
Used in:
```

---

# 22. DOCUMENTATION CONSISTENCY CHECK

Setelah semua dokumentasi dibuat, lakukan audit.

Periksa apakah:

- Nama fitur konsisten.
- Nama route konsisten.
- Nama model/database konsisten.
- Aktor konsisten.
- Diagram sesuai source code.
- User manual sesuai UI.
- Technical documentation sesuai project structure.
- README sesuai package.json/project configuration.
- Tidak ada fitur fiktif.
- Tidak ada credential.
- Tidak ada URL fiktif.
- Tidak ada teknologi fiktif.
- Tidak ada database entity fiktif.
- Tidak ada role fiktif.

Jika ditemukan konflik:

```text
SOURCE CODE > DOCUMENTATION
```

Source code menjadi sumber kebenaran utama untuk implementasi.

---

# 23. CHANGE CONTROL

**Jangan melakukan perubahan pada aplikasi hanya untuk menyesuaikan dokumentasi.**

Jika menemukan:

- Bug.
- Missing feature.
- Inconsistency.
- Security concern.
- Deployment issue.

Dokumentasikan sebagai temuan.

Jangan memperbaiki source code kecuali saya secara eksplisit meminta perbaikan.

Tujuan pekerjaan ini adalah:

> DOCUMENT THE EXISTING SYSTEM

bukan:

> REDESIGN THE SYSTEM

---

# 24. ADAPTIVE CONTENT RULE

Dokumentasi harus bersifat adaptif.

Gunakan aturan:

```text
IF FEATURE EXISTS
    → DOCUMENT IT

IF FEATURE DOES NOT EXIST
    → DO NOT DOCUMENT IT

IF FEATURE STATUS IS UNCLEAR
    → MARK AS "NEEDS VERIFICATION"

IF TECHNOLOGY EXISTS
    → DOCUMENT ACTUAL TECHNOLOGY

IF TECHNOLOGY DOES NOT EXIST
    → DO NOT MENTION IT

IF ACTOR EXISTS
    → DOCUMENT ACTOR

IF ACTOR DOES NOT EXIST
    → DO NOT INVENT ACTOR
```

Dengan demikian, dokumentasi tidak boleh menggunakan template generik yang memaksakan fitur tertentu.

---

# 25. PLACEHOLDER RULE

Jika membutuhkan informasi yang tidak dapat ditemukan dari repository, gunakan placeholder yang jelas.

Contoh:

```text
[NAMA DESA]
[NAMA UNIVERSITAS]
[NAMA KELOMPOK KKN]
[PERIODE KKN]
[NAMA PEMBIMBING]
[URL WEBSITE]
[URL GITHUB]
```

Jangan mengarang informasi tersebut.

Buat satu daftar:

## INFORMATION REQUIRED FROM USER

yang berisi seluruh data yang perlu saya isi secara manual.

---

# 26. OUTPUT STRUCTURE

Buat struktur dokumentasi yang rapi.

Gunakan:

```text
/docs
│
├── README.md
│
├── 01-project-report/
│   └── project-report.md
│
├── 02-user-manual/
│   └── user-manual.md
│
├── 03-technical/
│   └── technical-documentation.md
│
├── 04-handover/
│   └── handover-document.md
│
├── 05-diagrams/
│   ├── system-flow
│   ├── architecture
│   ├── erd
│   └── other-diagrams-if-applicable
│
└── assets/
    └── screenshots/
```

**Namun jika repository sudah memiliki struktur `/docs`, jangan merusak struktur tersebut.**

Adaptasikan struktur dengan repository aktual.

---

# 27. IMPORTANT — DO NOT OVERENGINEER

Dokumentasi ditujukan untuk:

1. Mahasiswa KKN.
2. Pihak desa.
3. Developer/maintainer berikutnya.

Karena itu:

- Jangan membuat dokumentasi seperti enterprise software jika tidak diperlukan.
- Jangan membuat puluhan diagram tanpa nilai.
- Jangan menggunakan jargon berlebihan untuk pihak desa.
- Jangan membuat arsitektur kompleks yang tidak sesuai implementasi.
- Jangan membuat requirement fiktif.
- Jangan membuat roadmap bisnis yang tidak diminta.
- Jangan mengasumsikan sistem akan dikomersialkan.
- Jangan mengasumsikan hosting production tertentu.
- Jangan mengasumsikan jumlah pengguna tertentu.
- Jangan mengasumsikan skala sistem tertentu.

Dokumentasi harus **proporsional terhadap sistem aktual**.

---

# 28. SECURITY REVIEW

Sebelum finalisasi, lakukan pemeriksaan keamanan dasar terhadap dokumentasi.

Pastikan dokumentasi tidak membocorkan:

- `.env`.
- Secret.
- Password.
- Token.
- API key.
- Private URL.
- Database credential.
- Authentication secret.
- Sensitive user data.

Jika ditemukan credential di repository, **jangan menyalinnya ke dokumentasi**.

Laporkan sebagai security finding.

---

# 29. FINAL VALIDATION REPORT

Setelah seluruh dokumentasi selesai, buat file:

```text
DOCUMENTATION-AUDIT.md
```

Isi:

## Repository Analyzed

## Technologies Detected

## Features Detected

## Actors Detected

## Database Entities Detected

## Routes Detected

## Documents Generated

## Diagrams Generated

## Information Requiring Manual Verification

## Potential Inconsistencies

## Security Notes

## Final Documentation Status

Gunakan status:

```text
COMPLETE
PARTIALLY COMPLETE
REQUIRES MANUAL VERIFICATION
```

---

# 30. FINAL BEHAVIOR

Sebelum menghasilkan dokumentasi:

**ANALYZE FIRST.**

Jangan langsung menggunakan asumsi dari nama proyek.

Setelah analisis selesai:

**BUILD A FACTUAL MODEL OF THE EXISTING SYSTEM.**

Kemudian:

**GENERATE DOCUMENTATION FROM THAT MODEL.**

Terakhir:

**AUDIT THE DOCUMENTATION AGAINST THE REPOSITORY.**

Kesimpulan yang harus menjadi prinsip utama:

> **Repository adalah source of truth.**
>
> Dokumentasi harus mengikuti aplikasi, bukan aplikasi dipaksa mengikuti template dokumentasi.

---

# 31. EXECUTION INSTRUCTION

Mulai pekerjaan dengan:

### STEP 1
Scan dan pahami seluruh repository.

### STEP 2
Buat internal inventory mengenai:

- technology stack,
- architecture,
- routes,
- actors,
- features,
- database,
- APIs,
- authentication,
- deployment,
- project structure.

### STEP 3
Identifikasi bagian yang belum dapat diverifikasi.

### STEP 4
Susun dokumentasi berdasarkan sistem aktual.

### STEP 5
Buat diagram yang relevan.

### STEP 6
Buat user manual.

### STEP 7
Buat technical documentation.

### STEP 8
Buat handover documentation.

### STEP 9
Update README jika diperlukan.

### STEP 10
Lakukan consistency audit.

### STEP 11
Jangan mengubah source code aplikasi kecuali diminta secara eksplisit.

---

# DEFINITION OF DONE

Pekerjaan dianggap selesai apabila:

- [ ] Repository telah dianalisis.
- [ ] Technology stack telah diidentifikasi.
- [ ] Struktur sistem telah dipahami.
- [ ] Fitur aktual telah diinventarisasi.
- [ ] Aktor aktual telah diidentifikasi.
- [ ] Database telah dianalisis jika tersedia.
- [ ] System flow telah didokumentasikan jika relevan.
- [ ] Architecture telah didokumentasikan.
- [ ] ERD telah dibuat jika database tersedia.
- [ ] Use Case dibuat jika relevan.
- [ ] Activity Diagram dibuat jika relevan.
- [ ] Black-box test cases telah didokumentasikan tanpa memalsukan hasil.
- [ ] User Manual telah dibuat.
- [ ] Technical Documentation telah dibuat.
- [ ] Handover Document telah dibuat.
- [ ] README telah diperiksa.
- [ ] Security review telah dilakukan.
- [ ] Documentation audit telah dilakukan.
- [ ] Tidak terdapat fitur fiktif.
- [ ] Tidak terdapat teknologi fiktif.
- [ ] Tidak terdapat credential/sensitive secret.
- [ ] Tidak terdapat klaim yang tidak dapat diverifikasi.
- [ ] Seluruh dokumentasi konsisten dengan source code.

**Sekali lagi: jangan mengembangkan ulang aplikasi. Fokus utama adalah melakukan reverse engineering dan menghasilkan dokumentasi "as-built" yang akurat dari sistem yang sudah tersedia.**