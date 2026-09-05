# BERITA ACARA SERAH TERIMA (BAST)
## SISTEM INFORMASI PERPUSTAKAAN DIGITAL DESA — PUSTAKA PANGKALAN

**Nomor Dokumen**: BAST/KKN-PANGKALAN/2026/09/001  
**Lokasi**: Kantor Balai Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat  
**Tanggal Pelaksanaan**: September 2026

---

Pada hari ini, disepakati dan dilaksanakan proses serah terima hasil karya teknologi program Kuliah Kerja Nyata (KKN) berupa **Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)** oleh dan antara pihak-pihak di bawah ini:

1. **PIHAK PERTAMA (Tim Pengembang / Mahasiswa KKN)**:  
   Mewakili Tim Mahasiswa Program Kuliah Kerja Nyata (KKN) Desa Pangkalan. Bertindak sebagai pengembang dan penyedia teknis sistem.

2. **PIHAK KEDUA (Pemerintah Desa Pangkalan)**:  
   Mewakili Pemerintah Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi. Bertindak sebagai penerima manfaat dan pengelola operasional sistem.

Kedua belah pihak secara bersama-sama telah memeriksa, menguji, dan menyepakati serah terima aplikasi web dengan ketentuan sebagai berikut:

---

### PASAL 1 — IDENTITAS PROGRAM DAN SISTEM
- **Nama Sistem**: Pustaka Pangkalan — Perpustakaan Digital Desa Pangkalan
- **Domain Publik Aktif**: [https://perpus-pangkalan.vercel.app](https://perpus-pangkalan.vercel.app)
- **Tautan Kode Sumber (Repository)**: [https://github.com/ZephyrGraphic/pustaka-pangkalan.git](https://github.com/ZephyrGraphic/pustaka-pangkalan.git) (Branch Utama: `main`)
- **Wilayah Cakupan Layanan**: 4 Dusun Desa Pangkalan (Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, Dusun Pasir Gombong), Kecamatan Cikidang, Kabupaten Sukabumi.

---

### PASAL 2 — DAFTAR MODUL & FITUR YANG DISERAHKAN
Sistem diserahterimakan dalam kondisi telah selesai dikembangkan (*as-built*) dengan modul fungsional yang mencakup:

1. **Modul Publik & Warga Desa**:
   - Pendaftaran warga baru berbasis NIK 16 digit dan PIN keamanan 6 digit.
   - Kartu Anggota Digital Desa ber-QR Code dengan gelar pembelajar (*Warga Pembelajar, Pembaca Rajin, Cendekia Desa, Pelopor Literasi*).
   - Katalog koleksi modul digital dengan filter 8 topik tematik pedesaan (Pertanian, Sejarah Sunda, Bisnis UMKM, Kesehatan, Teknologi AI, Pendidikan Anak, Keterampilan Kreatif, dan Agama).
   - Antarmuka pembaca e-book per bab (*chapter reader*) yang ringan dan ramah gawai.
   - Penanda halaman (*bookmark*) dan pencatat kemajuan membaca otomatis (+10 poin/bab).
   - Rak buku bacaan pribadi warga (`/shelf`).
   - Pemberian rating bintang (1-5) dan kolom ulasan komentar warga.
   - Pengalih dwibahasa: Bahasa Indonesia (ID) dan Basa Sunda (SU).
   - Asisten cerdas tanya jawab *Kades AI*.

2. **Modul Pengelola Balai Desa (Administrator / `/admin`)**:
   - Dashboard analitik aktivitas literasi dan ringkasan metrik buku desa.
   - Manajemen katalog buku fisik dan modul e-book digital (CRUD).
   - Editor konten teks bab bacaan (*chapter management*).
   - Layanan pencatatan sirkulasi peminjaman buku fisik balai desa dengan fitur perpanjangan pinjam (+7 hari) dan tombol pengembalian buku (*Tandai Kembali*).
   - Manajemen master data 8 kategori tematik desa lengkap dengan pemilih ikon dan cascade update.
   - Manajemen master data wilayah 4 dusun resmi beserta grafik sebaran warga pembaca.
   - Manajemen akun warga dan fasilitas pengelola untuk melakukan **Reset PIN Sementara** bagi warga yang lupa PIN.
   - Fasilitas moderasi dan penghapusan ulasan buku yang tidak pantas.
   - Penerbitan warta dan maklumat pengumuman literasi balai desa.
   - Fasilitas ekspor laporan data literasi desa berformat CSV.

---

### PASAL 3 — STATUS DAN LINGKUNGAN SISTEM
1. Sistem telah dideploy dan aktif pada platform komputasi awan **Vercel** dengan basis data **Neon Serverless PostgreSQL**.
2. Sistem telah melalui pengujian kualitas perangkat lunak (*Software Testing and Quality Assurance*) sebanyak 48 skenario uji otomatis dengan tingkat kelulusan 100% (*zero defect*).
3. Status penyerahan ini adalah sistem siap guna untuk kegiatan operasional dan demonstrasi literasi masyarakat Desa Pangkalan.

---

### PASAL 4 — BATASAN SISTEM DAN TANGGUNG JAWAB OPERASIONAL
1. Sistem membutuhkan koneksi internet aktif untuk sinkronisasi data antar-perangkat.
2. Penyimpanan berkas PDF dan sampul saat ini memanfaatkan URL berkas daring.
3. Kerahasiaan akun administrator balai desa menjadi tanggung jawab penuh petugas yang ditunjuk oleh Pemerintah Desa Pangkalan.
4. Apabila di masa mendatang pihak desa menghendaki penggunaan domain resmi instansi desa (misal: `pangkalan-sukabumi.desa.id`), pihak desa dapat menghubungkannya ke Vercel tanpa mengubah arsitektur kode sumber.

---

### PASAL 5 — PAKET DOKUMENTASI TERIKUT
Bersamaan dengan penyerahan sistem ini, PIHAK PERTAMA menyerahkan 1 (satu) paket dokumentasi digital lengkap yang tersimpan pada folder `/docs` di dalam repositori kode sumber, meliputi:
- `01-project-report/project-report.md`: Laporan Resmi Pengembangan Sistem (BAB I s.d. BAB VI).
- `02-user-manual/user-manual.md`: Buku Panduan Penggunaan untuk Warga dan Pengelola Balai Desa.
- `03-technical/technical-documentation.md`: Spesifikasi Teknis, Kamus Data, dan Panduan Pemeliharaan.
- `04-handover/handover-document.md`: Naskah Berita Acara Serah Terima (BAST).
- `05-diagrams/`: Diagram Alur Sistem, Arsitektur, ERD Basis Data, Use Case, dan Activity Diagram.

---

### LEMBAR PENGESAHAN TANDA TANGAN

Demikian Berita Acara Serah Terima ini dibuat dengan sebenar-benarnya dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya oleh kedua belah pihak.

<br />

| PIHAK PERTAMA <br />*(Tim Mahasiswa KKN Desa Pangkalan)* | PIHAK KEDUA <br />*(Pemerintah Desa Pangkalan)* |
| :---: | :---: |
| <br /><br /><br /><br /> | <br /><br /><br /><br /> |
| **(......................................................)**<br />Koordinator Tim KKN Mahasiswa | **(......................................................)**<br />Kepala Desa / Perwakilan Balai Desa Pangkalan |
| Tanggal: ....................................... | Tanggal: ....................................... |
