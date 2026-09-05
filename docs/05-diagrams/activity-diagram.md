# ⚡ Activity Diagram — As-Built System

Dokumen ini memodelkan aktivitas langkah-demi-langkah (*activity flow*) pada 3 proses operasional paling kritikal dalam Sistem Informasi Perpustakaan Digital Desa Pangkalan.

---

## 1. Aktivitas Sirkulasi Peminjaman & Pengembalian Buku Balai Desa

Proses pelayanan peminjaman buku fisik di Balai Desa Pangkalan:

```mermaid
stateDiagram-v2
    [*] --> WargaMendatangiBalaiDesa : Warga datang memilih buku fisik
    WargaMendatangiBalaiDesa --> PetugasBukaMenuCirculation : Petugas membuka menu /admin/circulation
    
    state "Pencatatan Peminjaman" as Pinjam {
        PetugasBukaMenuCirculation --> KlikCatatPeminjaman : Klik tombol '+ Catat Peminjaman Baru'
        KlikCatatPeminjaman --> PilihWargaDanBuku : Pilih nama warga & judul buku fisik
        PilihWargaDanBuku --> TentukanTenggat : Masukkan durasi pinjam (default 7 hari)
        TentukanTenggat --> SimpanPinjam : Simpan Peminjaman
    }

    SimpanPinjam --> StatusBorrowed : Record terbit dengan status 'BORROWED'
    
    state "Pemantauan & Aksi Sirkulasi" as Aksi {
        StatusBorrowed --> EvaluasiKondisi
        
        state EvaluasiKondisi <<choice>>
        EvaluasiKondisi --> PerpanjangPinjam : Warga minta perpanjangan waktu
        EvaluasiKondisi --> PengembalianBuku : Warga mengembalikan buku fisik
        EvaluasiKondisi --> MasaTerlewati : Tanggal melebihi dueDate
        
        PerpanjangPinjam --> Perpanjang7Hari : Petugas klik '+7 Hari' (PATCH EXTEND)
        Perpanjang7Hari --> StatusBorrowed : Due date bertambah 7 hari
        
        MasaTerlewati --> StatusOverdue : Ditandai badge merah 'Terlambat'
        StatusOverdue --> PengembalianBuku : Warga akhirnya mengembalikan
        
        PengembalianBuku --> KlikTandaiKembali : Petugas klik 'Tandai Kembali' (PATCH RETURN)
        KlikTandaiKembali --> IsiReturnDate : Sistem mengisi returnDate = now() dan status = 'RETURNED'
    }

    IsiReturnDate --> BukuTersediaKembali : Stok fisik tersedia kembali
    BukuTersediaKembali --> [*]
```

---

## 2. Aktivitas Membaca & Gamifikasi Literasi Warga

Alur membaca per bab dan akumulasi poin membaca:

```mermaid
stateDiagram-v2
    [*] --> BukaDetailBuku : Warga membuka buku di /books/[id]
    BukaDetailBuku --> KlikMulaiMembaca : Klik 'Mulai Membaca E-Book'
    KlikMulaiMembaca --> MuatBab1 : Sistem memuat bab pertama (/read/[chapterId])
    
    state "Sesi Membaca" as Baca {
        MuatBab1 --> GulirMembaca : Membaca konten teks materi
        GulirMembaca --> SimpanBookmark : Klik ikon Bookmark (Simpan posisi)
        GulirMembaca --> KlikSelesaiBab : Klik tombol 'Selesai & Bab Selanjutnya'
    }

    KlikSelesaiBab --> SimpanProgressAPI : Request ke /api/reading-progress
    SimpanProgressAPI --> TambahPoin : Poin bertambah +10
    TambahPoin --> CekAmbangBadge : Evaluasi total poin warga
    
    state CekAmbangBadge <<choice>>
    CekAmbangBadge --> NaikBadge : Poin mencapai ambang (50 / 150 / 300)
    CekAmbangBadge --> TetapBadge : Belum mencapai ambang baru
    
    NaikBadge --> MunculkanConfetti : Animasi selebrasi kenaikan badge
    MunculkanConfetti --> CekBabBerikutnya
    TetapBadge --> CekBabBerikutnya

    state CekBabBerikutnya <<choice>>
    CekBabBerikutnya --> BukaBabBerikutnya : Masih ada bab lanjutan
    CekBabBerikutnya --> TulisUlasan : Buku telah tamat (Bab Terakhir)
    
    BukaBabBerikutnya --> GulirMembaca
    TulisUlasan --> KirimRatingKomentar : Berikan rating bintang 1-5 dan saran
    KirimRatingKomentar --> [*]
```

---

## 3. Aktivitas Reset PIN Akun Warga oleh Administrator

Alur penanganan warga yang lupa PIN 6 digit:

```mermaid
stateDiagram-v2
    [*] --> WargaLupaPIN : Warga melapor lupa PIN ke petugas balai desa
    WargaLupaPIN --> PetugasVerifikasiKTP : Petugas mencocokkan identitas fisik (KTP/KK)
    PetugasVerifikasiKTP --> PetugasBukaAdminUsers : Petugas membuka menu /admin/users
    PetugasBukaAdminUsers --> CariNamaAtauNIK : Cari NIK warga di kotak pencarian
    CariNamaAtauNIK --> KlikTombolResetPIN : Klik tombol 'Reset PIN' pada baris warga
    KlikTombolResetPIN --> ModalInputPINBaru : Muncul modal 'Atur PIN Sementara'
    ModalInputPINBaru --> MasukkanPINBaru : Petugas memasukkan 6 digit PIN baru
    MasukkanPINBaru --> SubmitReset : Klik 'Simpan PIN Baru'
    SubmitReset --> EnkripsiBcrypt : API mengenkripsi PIN dengan bcrypt salt 10
    EnkripsiBcrypt --> DatabaseUpdate : Record User.password diperbarui
    DatabaseUpdate --> NotifikasiSukses : Muncul notifikasi hijau sukses
    NotifikasiSukses --> InformasikanWarga : Petugas menginformasikan PIN baru ke warga
    InformasikanWarga --> WargaLoginKembali : Warga berhasil masuk kembali
    WargaLoginKembali --> [*]
```
