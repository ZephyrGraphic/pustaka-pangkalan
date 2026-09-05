# 📚 Pustaka Pangkalan — Dokumentasi Sistem

Selamat datang di repositori dokumentasi resmi **Sistem Informasi Perpustakaan Digital Desa Pangkalan**, Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat.

Dokumentasi ini disusun secara komprehensif berdasarkan kondisi sistem aktual yang telah selesai dibangun (*as-built system documentation*), tanpa mengasumsikan fitur fiktif, serta bebas dari kebocoran rahasia atau kredensial.

---

## 🗂️ Indeks & Peta Navigasi Dokumen

Seluruh dokumentasi dikelompokkan ke dalam direktori khusus sesuai kebutuhan peruntukannya:

```text
docs/
│
├── 01-project-report/
│   └── project-report.md          # Laporan Resmi Pengembangan Sistem (BAB I - BAB VI)
│                                  # Untuk pelaporan formal program kerja KKN
│
├── 02-user-manual/
│   └── user-manual.md             # Buku Panduan Penggunaan Sistem
│                                  # Untuk Warga Desa dan Petugas Balai Desa
│
├── 03-technical/
│   └── technical-documentation.md # Dokumentasi Teknis, Arsitektur, API, DB & Deployment
│                                  # Untuk Developer dan Pemelihara Sistem
│
├── 04-handover/
│   └── handover-document.md       # Dokumen & Berita Acara Serah Terima (BAST)
│                                  # Lembar serah terima resmi ke Pemerintah Desa
│
└── 05-diagrams/                   # Seluruh diagram sistem visual berbasis Mermaid
    ├── system-flow.md             # Alur Sistem Umum, Warga, dan Pengelola
    ├── architecture.md            # Arsitektur Jamstack / Serverless Next.js + Neon
    ├── erd.md                     # Entity Relationship Diagram (10 Tabel Relasional)
    ├── use-case.md                # Diagram Use Case Warga dan Administrator
    └── activity-diagram.md        # Activity Diagram Alur Kritis (Sirkulasi, Baca, Reset PIN)
```

---

## 🎯 Panduan Memilih Dokumen Berdasarkan Pembaca

| Siapa Anda? | Dokumen yang Disarankan untuk Dibaca |
|---|---|
| **Dosen Pembimbing / Penilai Akademik KKN** | 👉 [01-project-report/project-report.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/01-project-report/project-report.md) — Berisi latar belakang, metodologi, analisis kebutuhan fungsional/non-fungsional, arsitektur, tabel pengujian STQA (48 skenario), dan penutup. |
| **Warga Desa & Pembaca Buku** | 👉 [02-user-manual/user-manual.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/02-user-manual/user-manual.md) — Panduan non-teknis cara mendaftar dengan NIK, membaca per bab, mengumpulkan poin gamifikasi, dan bertanya ke Kades AI. |
| **Petugas / Pengelola Balai Desa** | 👉 [02-user-manual/user-manual.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/02-user-manual/user-manual.md) (Bagian 5) & [04-handover/handover-document.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/04-handover/handover-document.md) — Panduan melayani sirkulasi pinjam buku, mereset PIN warga yang lupa, serta naskah serah terima. |
| **Pengembang Software / System Maintainer** | 👉 [03-technical/technical-documentation.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/03-technical/technical-documentation.md) & [05-diagrams/](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/docs/05-diagrams/) — Berisi inventarisasi 19 rute halaman, 30 endpoint API, kamus data 10 model Prisma, konfigurasi env, dan alur CI/CD Vercel. |

---

## 🌐 Tautan Eksternal Sistem
- **Portal Produksi**: [https://perpus-pangkalan.vercel.app](https://perpus-pangkalan.vercel.app)
- **Repositori GitHub**: [https://github.com/ZephyrGraphic/pustaka-pangkalan.git](https://github.com/ZephyrGraphic/pustaka-pangkalan.git)
- **Laporan Audit Konsistensi**: [DOCUMENTATION-AUDIT.md](file:///d:/CODEX-PROJECT/Perpustakaan%20Digital/DOCUMENTATION-AUDIT.md)
