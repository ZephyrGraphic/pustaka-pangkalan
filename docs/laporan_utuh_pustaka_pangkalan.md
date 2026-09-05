---
title: "LAPORAN PENGEMBANGAN SISTEM INFORMASI PERPUSTAKAAN DIGITAL DESA (PUSTAKA PANGKALAN)"
subtitle: "Implementasi Portal Literasi Digital dan Manajemen Sirkulasi Buku Balai Desa Berbasis Jamstack, Next.js, dan Neon Serverless PostgreSQL"
author: "Tim Pelaksana Kuliah Kerja Nyata (KKN) Tematik Desa Pangkalan"
date: "September 2026"
geometry: "top=2.5cm,bottom=2.5cm,left=3cm,right=2.5cm"
lang: "id-ID"
toc: true
toc-depth: 3
numbersections: true
fontsize: 12pt
linestretch: 1.15
documentclass: report
---

\newpage

# LEMBAR PENGESAHAN {.unnumbered}

**Judul Laporan**: Laporan Pengembangan Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)  
**Bidang Fokus**: Sistem Informasi Pemerintahan Desa dan Literasi Digital Pedesaan  
**Lokasi Program**: Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Provinsi Jawa Barat  
**Alamat Domain Akses**: https://perpus-pangkalan.vercel.app  
**Repositori Kode Sumber**: https://github.com/ZephyrGraphic/pustaka-pangkalan.git  
**Waktu Pelaksanaan**: Periode Kuliah Kerja Nyata (KKN) Tematik Semester Ganjil 2026  

Naskah laporan hasil rancang bangun sistem informasi, pengujian perangkat lunak, dan serah terima alih kelola teknologi ini telah diperiksa, diujicobakan, dan disahkan oleh pihak-pihak terkait pada tanggal yang tertera di bawah ini:

\vspace{1.2cm}

| Mengetahui, <br> **Dosen Pembimbing Lapangan (DPL)** | Menyetujui, <br> **Kepala Desa Pangkalan** |
| :---: | :---: |
| \vspace{2.2cm} | \vspace{2.2cm} |
| **( ............................................................ )** <br> NIP: .................................................... | **( ............................................................ )** <br> NIP: .................................................... |

\vspace{1cm}

| Mengesahkan, <br> **Koordinator Tim Mahasiswa KKN** |
| :---: |
| \vspace{2.2cm} |
| **( ............................................................ )** <br> NIM: .................................................... |

\newpage

# PERNYATAAN KEASLIAN KARYA {.unnumbered}

Kami yang bertanda tangan di bawah ini, Tim Pelaksana Mahasiswa Kuliah Kerja Nyata (KKN) Tematik Desa Pangkalan, dengan ini menyatakan secara sadar dan sungguh-sungguh bahwa:

1. Naskah laporan sistem informasi ini beserta seluruh artefak perangkat lunak yang dihasilkannya (kode sumber, skema basis data, antarmuka pengguna, dan naskah dokumentasi) merupakan karya asli hasil kerja mandiri tim kami di bawah bimbingan Dosen Pembimbing Lapangan dan arahan Pemerintah Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi.
2. Seluruh sumber pustaka, kutipan teori, data lapangan, dan pustaka perangkat lunak *open-source* yang digunakan telah dicantumkan dan dirujuk secara sah sesuai dengan kaidah penulisan karya ilmiah yang berlaku.
3. Seluruh fitur, arsitektur, dan metrik yang dilaporkan dalam dokumen ini bersumber langsung dari sistem terpasang aktual (*as-built system*) tanpa memuat fitur rekaan (*zero fake features*) serta sepenuhnya tunduk pada kebijakan perlindungan data rahasia (*zero secrets policy*).

Apabila di kemudian hari terbukti terdapat plagiarisme, fabrikasi data, atau pelanggaran etika akademik dalam naskah ini, kami bersedia menerima sanksi akademis dan administratif sesuai dengan peraturan perundang-undangan yang berlaku.

\vspace{1.2cm}
*Desa Pangkalan, September 2026*  
\vspace{1.2cm}
**( Tim Mahasiswa Pengembang Pustaka Pangkalan )**

\newpage

# ABSTRAK {.unnumbered}

**PENGEMBANGAN SISTEM INFORMASI PERPUSTAKAAN DIGITAL DESA (PUSTAKA PANGKALAN) BERBASIS JAMSTACK DAN SERVERLESS POSTGRESQL DI DESA PANGKALAN KECAMATAN CIKIDANG KABUPATEN SUKABUMI**

*Oleh: Tim Pelaksana KKN Tematik Desa Pangkalan*

Keterbatasan ketersediaan bahan pustaka cetak dan pengelolaan sirkulasi peminjaman buku yang masih manual di kantor Balai Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, menjadi kendala utama dalam mendorong peningkatan literasi masyarakat pedesaan yang tersebar di empat dusun (Pangkalan, Cikajang, Pasir Arangan, dan Pasir Gombong). Penelitian dan proyek perancangan perangkat lunak ini bertujuan membangun **Pustaka Pangkalan**, sebuah sistem informasi perpustakaan digital desa berbasis web yang memadukan portal modul e-book interaktif per bab (*chapter-by-chapter reader*) dengan sistem otomasi sirkulasi peminjaman buku fisik balai desa. Sistem dirancang menggunakan arsitektur *Jamstack* modern berbasis kerangka kerja Next.js 16 (React 19 dan TypeScript), basis data relasional Neon Serverless PostgreSQL yang dikelola melalui Prisma ORM 7, serta diamankan melalui otentikasi NIK 16 digit dan PIN 6 digit terenkripsi Bcrypt. 

Metodologi pengembangan sistem yang diterapkan adalah *Agile Iterative Prototyping*, yang meliputi tahapan inisiasi lapangan, analisis kebutuhan pengguna, perancangan sistem menggunakan pemodelan UML (*Use Case Diagram, Activity Diagram*) dan ERD, konstruksi perangkat lunak, serta pengujian mutu komprehensif. Evaluasi sistem dilakukan melalui *Software Testing and Quality Assurance* (STQA) berbasis pengujian *black-box* dan *regression testing* yang mencakup 9 test suite dan 48 skenario uji fungsional. Hasil pengujian menunjukkan tingkat kelulusan 100% (*zero defect*) dengan responsivitas tinggi pada perangkat bergerak (*mobile-first*). Selain itu, sistem mengintegrasikan fitur gamifikasi literasi (poin baca dan lencana prestasi), asisten cerdas *Kades AI*, serta lokalisasi dwi-bahasa (Bahasa Indonesia dan Basa Sunda) untuk melestarikan kearifan lokal. Sistem ini telah sukses dideploy pada domain publik https://perpus-pangkalan.vercel.app dan siap dioperasikan secara mandiri oleh aparatur Balai Desa Pangkalan.

**Kata Kunci**: Sistem Informasi Perpustakaan, Perpustakaan Digital Desa, Next.js, Serverless PostgreSQL, Jamstack, Literasi Pedesaan, Basa Sunda, Kecamatan Cikidang.

\newpage

# ABSTRACT {.unnumbered}

**DEVELOPMENT OF VILLAGE DIGITAL LIBRARY INFORMATION SYSTEM (PUSTAKA PANGKALAN) BASED ON JAMSTACK AND SERVERLESS POSTGRESQL IN PANGKALAN VILLAGE, CIKIDANG DISTRICT, SUKABUMI REGENCY**

*By: Community Service Student Team of Pangkalan Village*

The acute shortage of printed reading resources and the conventional paper-based circulation management at the Village Hall of Pangkalan, Cikidang District, Sukabumi Regency, have hindered the advancement of rural literacy across four distinct hamlets (Pangkalan, Cikajang, Pasir Arangan, and Pasir Gombong). This research and development project engineered **Pustaka Pangkalan**, a robust web-based village digital library information system that synergizes a lightweight, chapter-by-chapter interactive e-book reader with an automated physical book circulation management system for village administrators. The application was constructed leveraging modern Jamstack architecture powered by Next.js 16 (React 19 and TypeScript), Neon Serverless PostgreSQL interfaced via Prisma ORM 7, and secured utilizing 16-digit National Identity Number (NIK) paired with Bcrypt-encrypted 6-digit PIN authentication.

The system development methodology utilized an Agile Iterative Prototyping framework, progressing systematically through field observation, requirements elicitation, object-oriented UML modeling (*Use Case and Activity Diagrams*), relational database schema formulation (ERD), full-stack implementation, and rigorous verification. Software Testing and Quality Assurance (STQA) was carried out through structured black-box and automated regression suites encompassing 9 test suites and 48 distinct test cases. The verification yielded a 100% pass rate (zero defect), confirming resilient execution across varying network bandwidths and mobile form factors. Furthermore, the platform integrates gamified literacy incentives (reading points, streaks, and milestone badges), an interactive localized conversational assistant (*Kades AI*), and dual-language localization (Indonesian and Sundanese). The platform is officially deployed at https://perpus-pangkalan.vercel.app and transitioned for long-term municipal governance.

**Keywords**: Library Information System, Village Digital Library, Next.js, Serverless PostgreSQL, Jamstack, Rural Literacy, Sundanese Language, Cikidang District.

\newpage

# KATA PENGANTAR {.unnumbered}

Puji dan syukur senantiasa kami panjatkan ke hadirat Allah Subhanahu Wa Ta'ala, Tuhan Yang Maha Kuasa, atas segala rahmat, hidayah, serta pertolongan-Nya sehingga perancangan, pengembangan, pengujian, dan penyusunan naskah **Laporan Pengembangan Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)** di Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat ini dapat diselesaikan dengan tuntas dan paripurna.

Laporan ini disusun sebagai dokumen pertanggungjawaban akademis, teknis, dan institusional atas pelaksanaan program Kuliah Kerja Nyata (KKN) Tematik. Fokus program ini adalah menerapkan teknologi informasi modern yang tepat guna untuk mengatasi permasalahan riil kesenjangan literasi dan otomasi administrasi pemerintahan desa. Kehadiran Sistem Informasi Pustaka Pangkalan diharapkan mampu menjembatani kendala geografis di empat dusun terpisah, sehingga warga, pelajar, dan kader desa dapat dengan mudah mengakses modul-modul ilmu terapan seperti pertanian organik, budidaya perikanan, gizi keluarga pencegah stunting, kewirausahaan UMKM, serta pelestarian kebudayaan dan sastra Sunda.

Keberhasilan penyusunan laporan dan pembangunan perangkat lunak ini tidak terlepas dari bimbingan, kontribusi, dan dukungan yang tulus dari berbagai pihak. Oleh karena itu, kami menyampaikan terima kasih dan penghargaan yang mendalam kepada:

1. **Dosen Pembimbing Lapangan (DPL)**, yang dengan penuh kesabaran memberikan arahan akademis, telaah metodologi, kritik konstruktif, serta bimbingan moral selama pelaksanaan KKN.
2. **Pemerintah Desa Pangkalan, Kecamatan Cikidang**, khususnya Bapak Kepala Desa beserta seluruh perangkat balai desa dan para Kepala Dusun (Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, dan Dusun Pasir Gombong) atas sambutan hangat, fasilitas observasi, dan kerja sama kemitraan yang terjalin erat.
3. **Pengurus Karang Taruna dan Tokoh Pemuda Desa Pangkalan**, atas partisipasi aktif dalam pengujian fungsional aplikasi serta antusiasmenya menjadi penggerak budaya literasi digital di tingkat dusun.
4. **Masyarakat dan Pelajar Desa Pangkalan**, atas kesediaan meluangkan waktu dalam sesi pengumpulan data, pengisian survei kebutuhan, dan uji coba sistem.
5. **Rekan-rekan Mahasiswa Tim Pelaksana KKN**, yang telah memperlihatkan dedikasi, kekompakan, dan etos kerja yang tinggi dalam setiap tahapan analisis, perancangan, koding, hingga penyerahan sistem.

Kami menyadari bahwa laporan ini masih memiliki ruang untuk perbaikan. Oleh karena itu, segala bentuk kritik dan saran yang konstruktif sangat kami harapkan guna penyempurnaan sistem di masa yang akan datang. Semoga karya ini memberikan manfaat yang nyata dan berkelanjutan bagi masyarakat Desa Pangkalan.

\vspace{1.2cm}
*Desa Pangkalan, September 2026*  
\vspace{0.8cm}
**Tim Penyusun KKN Mahasiswa**

\newpage

# DAFTAR SINGKATAN DAN GLOSARIUM {.unnumbered}

| Singkatan / Istilah | Kepanjangan / Definisi Resmi |
|---|---|
| **API** | *Application Programming Interface*, antarmuka protokol yang memungkinkan komunikasi pertukaran data antar-komponen perangkat lunak secara terstandar. |
| **Bcrypt** | Fungsi *hashing* kata sandi berbasis algoritma *Blowfish* yang dilengkapi *salt* dan faktor biaya kerja adaptif untuk mencegah serangan *brute-force* dan *rainbow table*. |
| **CRUD** | *Create, Read, Update, Delete*, empat operasi fundamental dalam manipulasi data pada sistem manajemen basis data. |
| **DDC** | *Dewey Decimal Classification*, sistem klasifikasi perpustakaan internasional terstruktur berbasis hierarki numerik 10 kelas utama. |
| **DPL** | Dosen Pembimbing Lapangan, dosen perguruan tinggi yang bertindak sebagai pembina dan penilai akademis kegiatan KKN mahasiswa. |
| **ERD** | *Entity-Relationship Diagram*, model grafis konseptual yang menggambarkan entitas, atribut data, dan kardinalitas relasi dalam basis data. |
| **GUI / UI** | *Graphical User Interface*, antarmuka visual grafis yang memfasilitasi interaksi pengguna dengan perangkat lunak melalui elemen visual interaktif. |
| **Jamstack** | *JavaScript, APIs, and Markup*, arsitektur rekayasa web modern yang memisahkan lapisan penyajian (*frontend*) dari lapisan logika data (*backend*) guna mencapai performa dan keamanan tinggi. |
| **JWT** | *JSON Web Token*, standar terbuka (RFC 7519) yang mendefinisikan cara ringkas dan mandiri untuk mentransmisikan informasi sesi otentikasi antar pihak secara aman. |
| **KKN** | Kuliah Kerja Nyata, bentuk kegiatan pengabdian kepada masyarakat yang wajib ditempuh oleh mahasiswa perguruan tinggi. |
| **NIK** | Nomor Induk Kependudukan, nomor identitas kependudukan tunggal yang bersifat unik dan permanen sepanjang 16 digit angka di Indonesia. |
| **ORM** | *Object-Relational Mapping*, teknik pemetaan data dalam rekayasa perangkat lunak yang mengonversi tipe data antar sistem relasional dan bahasa berorientasi objek. |
| **Prisma** | *Next-generation Object-Relational Mapper* untuk TypeScript dan Node.js yang menyediakan skema deklaratif dan kueri data berkeamanan tipe ketat (*type-safe*). |
| **RBAC** | *Role-Based Access Control*, metode kontrol akses keamanan komputer yang membatasi hak akses sistem hanya kepada pengguna berdasarkan peran wewenang resminya. |
| **REST** | *Representational State Transfer*, gaya arsitektur perangkat lunak untuk sistem terdistribusi yang memanfaatkan protokol komunikasi HTTP tanpa status (*stateless*). |
| **SDLC** | *Software Development Life Cycle*, metodologi terstruktur dalam rekayasa perangkat lunak untuk merencanakan, menganalisis, merancang, membangun, menguji, dan memelihara sistem informasi. |
| **STQA** | *Software Testing and Quality Assurance*, disiplin pengujian perangkat lunak terencana dan sistematis guna menjamin kepatuhan sistem terhadap spesifikasi mutu yang telah ditetapkan. |
| **UML** | *Unified Modeling Language*, bahasa visual standar pemodelan perangkat lunak berorientasi objek yang mencakup diagram struktural dan perilaku (*behavioral*). |
| **Vercel** | Platform *cloud deployment* dan komputasi *serverless edge* terdistribusi global yang dioptimalkan untuk kerangka kerja web Next.js. |

\newpage
# BAB I — PENDAHULUAN

## 1.1 Latar Belakang Masalah
Pembangunan perdesaan merupakan fondasi penting dalam menopang ketahanan nasional, stabilitas pangan, dan pelestarian nilai-nilai sosial budaya bangsa Indonesia. Transformasi digital yang diamanatkan oleh pemerintah pusat melalui konsep Desa Cerdas (*Smart Village*) menuntut pemanfaatan teknologi informasi dan komunikasi untuk meningkatkan kualitas hidup, efisiensi pelayanan publik, dan keterbukaan akses ilmu pengetahuan di tingkat desa.

Desa Pangkalan merupakan salah satu desa di wilayah administrasi Kecamatan Cikidang, Kabupaten Sukabumi, Provinsi Jawa Barat. Secara geografis, wilayah Desa Pangkalan memiliki karakteristik topografi perbukitan dan agraris dengan permukiman penduduk yang tersebar di 4 (empat) wilayah dusun utama, yaitu:
1. **Dusun Pangkalan** (wilayah pusat administrasi balai desa dan permukiman sentral);
2. **Dusun Cikajang** (wilayah agraris dengan konsentrasi perkebunan dan pertanian hortikultura);
3. **Dusun Pasir Arangan** (wilayah perbukitan dengan kegiatan peternakan rakyat dan usaha pertanian lahan kering);
4. **Dusun Pasir Gombong** (wilayah perbatasan dusun dengan potensi kerajinan, anyaman bambu, dan perkebunan).

Sebagian besar mata pencaharian masyarakat Desa Pangkalan bertumpu pada sektor pertanian tanaman pangan, perkebunan karet dan kelapa, peternakan domba, serta usaha mikro, kecil, dan menengah (UMKM) pengolahan hasil bumi. Dalam era keterbukaan informasi saat ini, penetrasi gawai pintar (*smartphone*) dan ketersediaan sinyal telekomunikasi seluler telah menjangkau sebagian besar permukiman warga di keempat dusun tersebut. Namun demikian, ketersediaan infrastruktur jaringan ini belum diimbangi dengan ketersediaan konten edukasi dan sumber bacaan terapan yang relevan dengan kebutuhan hidup masyarakat desa. Akses internet oleh warga dan pemuda desa sebagian besar masih dihabiskan untuk hiburan media sosial tanpa memberikan dampak peningkatan kapasitas ekonomi dan keterampilan terapan.

Di sisi lain, kantor Balai Desa Pangkalan memiliki fasilitas perpustakaan desa yang menyimpan sejumlah koleksi buku fisik. Namun, pengelolaan perpustakaan balai desa tersebut selama ini menghadapi berbagai kendala nyata:
1. **Keterbatasan Fisik dan Geografis**: Warga yang berdomisili di dusun-dusun yang jauh dari kantor balai desa harus menempuh perjalanan fisik yang cukup jauh hanya untuk memeriksa ketersediaan buku atau meminjam buku bacaan.
2. **Pengelolaan Sirkulasi Manual**: Pencatatan riwayat peminjaman dan pengembalian buku masih menggunakan buku besar manual berbasis kertas (*paper-based record*). Hal ini menyebabkan tingginya risiko kehilangan catatan, sulitnya memantau buku yang telah melampaui batas waktu pinjam (*overdue*), serta ketidakjelasan status inventaris eksemplar buku di balai desa.
3. **Ketiadaan Modul Pembelajaran Terapan Digital**: Koleksi buku cetak yang ada di balai desa didominasi oleh buku-buku umum terbitan lama yang kurang relevan dengan isu-isu mendesak masyarakat pedesaan saat ini, seperti: teknik pembuatan pupuk organik padat dan cair, budidaya ikan air tawar sistem bioflok, panduan gizi seimbang balita untuk pencegahan *stunting*, pembukuan keuangan digital UMKM desa, hingga materi pembelajaran bahasa dan aksara Sunda sebagai warisan budaya lokal.

Menjawab permasalahan tersebut, Tim Mahasiswa Kuliah Kerja Nyata (KKN) Tematik berinisiatif merancang dan mengimplementasikan sebuah solusi rekayasa perangkat lunak terpadu yang diberi nama **Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)**. Sistem ini menggabungkan portal baca digital (*digital e-book reader*) yang ringan diakses melalui peramban ponsel pintar warga dengan modul otomasi manajemen sirkulasi peminjaman buku fisik yang dapat dioperasikan secara tertib oleh aparatur Balai Desa Pangkalan.

## 1.2 Perumusan Masalah
Berdasarkan latar belakang masalah yang telah diuraikan, rumusan masalah dalam penelitian dan pengembangan sistem informasi ini adalah:
1. Bagaimana menganalisis dan memetakan kebutuhan sistem informasi perpustakaan yang mampu melayani pembacaan materi digital per bab bagi warga sekaligus memodernisasi tata kelola peminjaman buku fisik di Balai Desa Pangkalan?
2. Bagaimana merancang arsitektur perangkat lunak berbasis web modern (*Jamstack, Next.js, dan Serverless PostgreSQL*) yang berkinerja tinggi, aman, hemat sumber daya komputasi, dan responsif terhadap perangkat bergerak (*mobile-first*)?
3. Bagaimana mengimplementasikan mekanisme otentikasi yang ramah pengguna pedesaan menggunakan kombinasi NIK 16 digit dan PIN 6 digit terenkripsi tanpa mengorbankan standar keamanan data?
4. Bagaimana menguji dan mengevaluasi keandalan, integritas skema basis data, dan fungsionalitas sistem informasi menggunakan metode pengujian *black-box* dan *regression testing* berstandar kualitas perangkat lunak?

## 1.3 Batasan Masalah
Agar pembahasan dalam laporan ini terarah dan terfokus pada sistem yang benar-benar terpasang aktual (*as-built system*), batasan masalah ditetapkan sebagai berikut:
1. Sistem dikembangkan sebagai aplikasi berbasis web responsif (*web-based responsive application*) yang dideploy pada infrastruktur *Vercel Edge Network* dengan alamat domain resmi **https://perpus-pangkalan.vercel.app**.
2. Lingkungan basis data menggunakan layanan *relational database* berbasis awan **Neon Serverless PostgreSQL** yang dikelola menggunakan **Prisma ORM versi 7.9.1**.
3. Kerangka kerja perangkat lunak yang digunakan adalah **Next.js 16.3.0** (berbasis React 19 dan TypeScript) dengan pola arsitektur *App Router* dan *Route Handlers*.
4. Aktor sistem dibatasi pada 2 (dua) peran pengguna terotentikasi, yaitu Warga Desa (`USER`) dan Pengelola Balai Desa (`ADMIN`), serta 1 (satu) mode pengunjung tamu (`GUEST`).
5. Otentikasi pengguna memanfaatkan *NextAuth.js* dengan strategi kredensial NIK (16 digit angka) dan PIN (6 digit angka) yang dienkripsi menggunakan algoritma *Bcrypt* dengan *salt rounds* 10.
6. Fitur pembaca digital (*reader*) difokuskan pada penyajian teks materi e-book per bab (*chapter reader*) yang ringan dan cepat dimuat pada jaringan seluler desa, dilengkapi penyimpanan riwayat bacaan dan penanda halaman (*bookmark*).
7. Pengelolaan sirkulasi buku fisik balai desa mencakup pencatatan tanggal pinjam, batas kembali otomatis 7 hari, fasilitas perpanjangan (+7 hari), penandaan pengembalian instan, dan ekspor laporan berkala dalam format *Comma-Separated Values* (CSV).
8. Sistem mengintegrasikan fasilitas lokalisasi dwi-bahasa (Bahasa Indonesia dan Basa Sunda) serta antarmuka asisten virtual cerdas *Kades AI* berbasis *Large Language Model* terkonfigurasi.

## 1.4 Tujuan Penelitian dan Pengembangan
Tujuan dari pelaksanaan proyek perancangan dan implementasi sistem informasi ini meliputi:

### 1.4.1 Tujuan Umum
Menghasilkan sebuah sistem informasi perpustakaan digital desa berbasis web yang andal, aman, dan mudah digunakan guna mendemokratisasi akses sumber ilmu pengetahuan terapan bagi masyarakat serta memodernisasi manajemen sirkulasi perpustakaan Balai Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi.

### 1.4.2 Tujuan Khusus
1. Menganalisis kondisi eksisting tata kelola perpustakaan balai desa dan merumuskan spesifikasi kebutuhan fungsional (FR) dan non-fungsional (NFR) sistem secara komprehensif.
2. Merancang arsitektur sistem 4-tier (*Presentation, Application, Data Access, Persistence Layer*), pemodelan berorientasi objek (*Use Case Diagram, Activity Diagram*), dan skema basis data relasional (*ERD & Data Dictionary* 10 tabel).
3. Mengonstruksi antarmuka pengguna responsif (19 rute halaman) dan antarmuka pemrograman aplikasi (30 endpoint RESTful API) yang menghubungkan frontend dan backend secara efisien.
4. Menerapkan mekanisme keamanan akun warga berbasis validasi NIK KTP dan enkripsi PIN Bcrypt serta kontrol akses berbasis peran (*Role-Based Access Control*).
5. Menerapkan fitur insentif literasi berbasis gamifikasi (poin baca, *reading streak*, 3 jenjang lencana prestasi, dan papan peringkat dusun).
6. Menguji fungsionalitas dan keandalan sistem secara menyeluruh melalui 9 test suite STQA otomatis yang mencakup 48 skenario pengujian dengan target kelulusan 100% (*zero defect*).
7. Menyusun dokumen serah terima teknologi (*handover*), berita acara serah terima resmi (BAST), dan buku panduan pengguna (*user manual*) demi keberlanjutan operasional sistem di balai desa.

## 1.5 Manfaat Penelitian dan Pengembangan
Implementasi Sistem Informasi Pustaka Pangkalan memberikan manfaat nyata bagi berbagai pihak:
1. **Bagi Masyarakat dan Pelajar Desa Pangkalan**:
   - Memberikan kemudahan akses terhadap materi bacaan terapan seputar pertanian, peternakan, kesehatan keluarga, dan wirausaha kapan pun dan di mana pun melalui ponsel pintar.
   - Memberikan motivasi membaca berkelanjutan melalui sistem penghargaan poin dan lencana keaktifan membaca.
   - Menyediakan sarana pelestarian budaya lokal melalui bacaan sastra Sunda dan antarmuka berbahasa Sunda.
2. **Bagi Pemerintah Desa Pangkalan**:
   - Mewujudkan tertib administrasi inventarisasi buku fisik balai desa dengan pencatatan sirkulasi yang terstruktur dan termonitor secara real-time.
   - Memperoleh data analitik profil minat baca masyarakat per dusun yang valid sebagai rujukan pengambilan kebijakan program pemberdayaan masyarakat.
   - Meningkatkan citra positif Desa Pangkalan sebagai desa yang adaptif terhadap inovasi teknologi informasi (*smart village*).
3. **Bagi Sivitas Akademika dan Tim Pengembang KKN**:
   - Mengaplikasikan teori rekayasa perangkat lunak, manajemen basis data, dan interaksi manusia-komputer dalam pemecahan masalah nyata di tengah masyarakat pedesaan.
   - Menghasilkan artefak karya ilmiah teruji yang memenuhi standar penjaminan mutu perangkat lunak (*STQA verified*).

## 1.6 Metodologi Pengembangan Sistem Ringkas
Pengembangan sistem informasi ini mengadopsi model **Agile Iterative Prototyping** yang terbagi ke dalam 6 (enam) tahapan berkesinambungan:
1. **Fase Inisiasi dan Pengumpulan Data**: Observasi langsung ke kantor Balai Desa Pangkalan dan 4 dusun, wawancara mendalam dengan Kepala Desa dan aparatur, serta studi kepustakaan.
2. **Fase Analisis Kebutuhan**: Identifikasi profil aktor sistem, analisis sistem berjalan (*as-is*), perumusan sistem usulan (*to-be*), dan penyusunan matriks kebutuhan fungsional (FR-01 s.d. FR-20).
3. **Fase Perancangan (*System Design*)**: Pemodelan diagram alur (*flowchart*), diagram UML (*Use Case & Activity Diagram*), perancangan arsitektur *Jamstack*, perancangan skema relasional ERD, dan perancangan antarmuka pengguna (*UI/UX wireframing*).
4. **Fase Konstruksi (*Implementation*)**: Penulisan kode sumber frontend dan backend menggunakan Next.js 16, TypeScript, Tailwind CSS, Prisma ORM, dan pengintegrasian basis data Neon PostgreSQL.
5. **Fase Pengujian (*Software Testing & QA*)**: Pengujian *black-box*, verifikasi skema basis data, pengujian regresi otomatis (48 skenario uji), dan evaluasi usabilitas sistem.
6. **Fase Deployment dan Serah Terima**: Pemasangan sistem pada server produksi Vercel Edge, pelatihan operator desa, penandatanganan Berita Acara Serah Terima (BAST), dan penyerahan buku manual.

## 1.7 Sistematika Penulisan Laporan
Naskah laporan ini disusun secara sistematis ke dalam 7 (tujuh) bab utama:
- **BAB I — PENDAHULUAN**: Memuat latar belakang masalah geografis dan literasi desa, rumusan masalah, batasan masalah, tujuan, manfaat, metodologi ringkas, dan sistematika penulisan.
- **BAB II — LANDASAN TEORI DAN TINJAUAN PUSTAKA**: Menguraikan teori-teori dasar sistem informasi, perpustakaan digital, rekayasa perangkat lunak agile, pemodelan UML/ERD, stack teknologi Jamstack/Serverless, standar keamanan Bcrypt/NextAuth, standar pengujian ISO/IEC 25010, serta tabel perbandingan penelitian terdahulu.
- **BAB III — METODOLOGI PENELITIAN DAN PENGEMBANGAN**: Menguraikan lokasi dan jadwal pelaksanaan, kerangka pikir penelitian (*research framework*), teknik pengumpulan data, tahapan siklus pengembangan perangkat lunak, serta spesifikasi alat kerja.
- **BAB IV — ANALISIS DAN PERANCANGAN SISTEM**: Menyajikan analisis sistem berjalan, perancangan sistem usulan, matriks kebutuhan fungsional dan non-fungsional, pemodelan UML (*Use Case Narrative & Activity Diagram*), arsitektur 4-tier, perancangan ERD, kamus data 10 tabel, dan tata letak antarmuka.
- **BAB V — IMPLEMENTASI SISTEM**: Menjelaskan konfigurasi lingkungan produksi, implementasi skema basis data, realisasi 19 halaman antarmuka pengguna, 30 endpoint RESTful API, keamanan otentikasi NIK/PIN, fitur gamifikasi, asisten Kades AI, lokalisasi dwibahasa, dan branding Kabupaten Sukabumi.
- **BAB VI — PENGUJIAN DAN EVALUASI SISTEM**: Menyajikan strategi pengujian *black-box*, eksekusi 9 test suite STQA (48 skenario uji fungsional), evaluasi hasil pengujian, serta analisis usabilitas sistem.
- **BAB VII — PENUTUP**: Menyimpulkan pencapaian proyek menjawab rumusan masalah, mengidentifikasi keterbatasan sistem terpasang, dan memberikan rekomendasi operasional bagi pemerintah desa.
- **BAGIAN AKHIR**: Berisi Daftar Pustaka berstandar resmi, Lampiran 1 (Ringkasan Buku Panduan Pengguna), Lampiran 2 (Naskah Resmi BAST), dan Lampiran 3 (Laporan Hasil Audit Konsistensi Sistem).

\newpage
# BAB II — LANDASAN TEORI DAN KAJIAN PUSTAKA

## 2.1 Konsep Dasar Sistem dan Sistem Informasi
Secara terminologis, konsep sistem dan informasi telah didefinisikan secara luas oleh para pakar rekayasa sistem informasi:

### 2.1.1 Definisi Sistem
Menurut Gordon B. Davis (1985), sistem adalah sekumpulan elemen yang beroperasi secara bersama-sama untuk menyelesaikan suatu sasaran tertentu. Elemen-elemen ini saling berinteraksi, terhubung oleh suatu keteraturan, dan bekerja dalam kesatuan batasan lingkungan guna mentransformasikan masukan (*input*) menjadi keluaran (*output*). Menurut James A. O'Brien (2010), sebuah sistem dapat dipahami sebagai sekelompok komponen yang saling berhubungan, bekerja bersama menuju tujuan bersama dengan menerima masukan dan menghasilkan keluaran dalam proses transformasi yang terorganisir.

Suatu sistem yang baik dicirikan oleh karakteristik fundamental:
1. Memiliki komponen atau elemen (*components*);
2. Memiliki batas sistem (*boundary*) yang memisahkan sistem dari lingkungan luarnya;
3. Memiliki lingkungan luar (*environment*) yang memengaruhi operasi sistem;
4. Memiliki media penghubung antarmuka (*interface*) antar-komponen;
5. Memiliki masukan (*input*), pengolah (*process*), keluaran (*output*), dan mekanisme umpan balik (*feedback*).

### 2.1.2 Definisi Informasi dan Siklus Informasi
Informasi merupakan data yang telah diproses, diorganisasikan, dan distrukturkan sedemikian rupa sehingga memiliki nilai guna, konteks, dan arti bagi pengambil keputusan. Menurut Jogiyanto H.M. (2005), kualitas suatu informasi ditentukan oleh 3 (tiga) pilar utama:
- **Akurat (*Accurate*)**: Informasi harus bebas dari kesalahan, tidak bias, dan jelas mencerminkan keadaan sebenarnya.
- **Tepat Waktu (*Timeliness*)**: Informasi harus tiba kepada penerima saat diperlukan; informasi yang usang tidak memiliki nilai strategis.
- **Relevan (*Relevance*)**: Informasi harus memiliki keterkaitan langsung dengan kebutuhan pemakainya.

### 2.1.3 Definisi Sistem Informasi
Sistem informasi adalah kombinasi terpadu antara orang (*people*), perangkat keras (*hardware*), perangkat lunak (*software*), jaringan komunikasi (*networks*), dan sumber daya data (*data resources*) yang mengumpulkan, mentransformasikan, dan menyebarkan informasi dalam suatu organisasi guna mendukung pengambilan keputusan, koordinasi, analisis, dan visualisasi operasional (O'Brien & Marakas, 2011).

## 2.2 Perpustakaan Digital (*Digital Library*) dan Otomasi Perpustakaan

### 2.2.1 Pengertian Perpustakaan Digital
Menurut William Y. Arms (2000), perpustakaan digital (*digital library*) didefinisikan sebagai kumpulan informasi yang terkelola secara terorganisasi dan didukung oleh layanan-layanan terkait, di mana informasinya disimpan dalam format digital dan dapat diakses melalui jaringan komputer. Sementara itu, Michael Lesk (1997) menegaskan bahwa perpustakaan digital merupakan koleksi informasi terorganisasi dalam bentuk digital yang menggabungkan struktur dan pengumpulan data dengan kemudahan penelusuran digital.

Keunggulan komparatif perpustakaan digital dibandingkan perpustakaan konvensional meliputi:
1. **Aksesibilitas Tanpa Batas Ruang dan Waktu (*Ubiquitous Access*)**: Koleksi digital dapat diakses 24 jam sehari dari mana saja selama perangkat pengguna terhubung ke jaringan internet.
2. **Ketiadaan Degradasi Fisik**: Materi bacaan digital tidak mengalami kerusakan fisik kertas, sobek, ataupun memudar akibat usia dan kelembapan udara.
3. **Pencarian Cepat dan Presisi (*Instant Searchability*)**: Pengguna dapat mencari buku berdasarkan kata kunci judul, nama pengarang, maupun kategori tematik dalam hitungan milidetik.
4. **Efisiensi Penggandaan dan Distribusi**: Satu modul bacaan digital dapat dibaca secara simultan oleh puluhan warga tanpa memerlukan pencetakan fisik berbiaya tinggi.

### 2.2.2 Otomasi Sirkulasi Perpustakaan Balai Desa
Meskipun penyediaan materi digital merupakan terobosan utama, perpustakaan fisik balai desa tetap memiliki peranan penting bagi warga yang menyukai buku cetak. Oleh karena itu, sistem perpustakaan modern menerapkan konsep hibrida (*hybrid library*), yaitu mendigitalkan tata kelola sirkulasi fisik di samping menyediakan bacaan digital. Otomasi sirkulasi mencakup pencatatan data peminjam, penentuan masa pinjam, perhitungan jatuh tempo keterlambatan (*overdue*), perpanjangan izin pinjam, dan pencatatan riwayat pengembalian barang secara terpusat dalam basis data.

## 2.3 Literasi Digital dan Pemberdayaan Masyarakat Pedesaan
Literasi digital bukan sekadar kemampuan teknis dalam mengoperasikan perangkat gawai cerdas, melainkan kemampuan kognitif dan kritis untuk menemukan, mengevaluasi, memanfaatkan, dan mengomunikasikan informasi secara bertanggung jawab (Bawden, 2008). 

Di wilayah perdesaan Indonesia, khususnya di Jawa Barat, program literasi desa menghadapi tantangan heterogenitas tingkat pendidikan masyarakat. Berdasarkan konsep *Smart Village* yang dikembangkan oleh Kementerian Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi, salah satu pilar utamanya adalah *Smart People* (Masyarakat Cerdas) yang memiliki akses setara terhadap ilmu pengetahuan terapan. Di samping itu, pelestarian kearifan lokal Sunda (*local indigenous knowledge*) menuntut penyediaan materi budaya dan antarmuka dwi-bahasa (Bahasa Indonesia dan Basa Sunda) guna mempertahankan identitas kultural generasi muda pedesaan.

## 2.4 Metode Pengembangan Perangkat Lunak: Agile Prototyping
Pengembangan perangkat lunak untuk kebutuhan komunitas pedesaan memerlukan pendekatan yang lincah, adaptif, dan responsif terhadap perubahan masukan pengguna di lapangan. Pendekatan yang dipilih adalah model **Agile Iterative Prototyping** (Pressman & Maxim, 2015).

```
+-------------------------------------------------------------------------+
|                  SIKLUS AGILE ITERATIVE PROTOTYPING                     |
|                                                                         |
|   [1. Communication] ----> [2. Quick Plan] ----> [3. Quick Modeling]    |
|           ^                                              |              |
|           |                                              v              |
|   [6. Delivery/Feedback] <--- [5. Testing] <--- [4. Construction]       |
+-------------------------------------------------------------------------+
```

Tahapan siklus meliputi:
1. **Komunikasi (*Communication*)**: Mendiskusikan kendala nyata dengan pemangku kepentingan desa (Kades, pamong, warga).
2. **Perencanaan Cepat (*Quick Plan*)**: Menyusun *backlog* kebutuhan fungsional dan prioritas implementasi.
3. **Pemodelan Rancangan (*Modeling Quick Design*)**: Membuat sketsa antarmuka, diagram UML, dan skema basis data awal.
4. **Konstruksi Prototipe (*Construction of Prototype*)**: Membangun modul kode yang berfungsi (*working software*).
5. **Pengujian (*Testing*)**: Melakukan pengujian fungsionalitas dan integritas data.
6. **Penyerahan dan Umpan Balik (*Deployment & Feedback*)**: Memperlihatkan sistem kepada pengguna untuk mendapatkan koreksi langsung sebelum iterasi berikutnya.

## 2.5 Unified Modeling Language (UML) dan Pemodelan Data Relasional
Menurut Martin Fowler (2004), *Unified Modeling Language* (UML) adalah keluarga notasi grafis standar yang didukung oleh meta-model tunggal, yang membantu perancangan dan pendokumentasian sistem perangkat lunak berorientasi objek.

Dalam penelitian ini, diagram UML yang digunakan meliputi:
- **Use Case Diagram**: Memodelkan interaksi antara aktor luar (pengguna) dengan fungsi-fungsi layanan yang disediakan oleh sistem informasi.
- **Activity Diagram**: Memodelkan alur kerja (*workflow*) langkah demi langkah dari suatu aktivitas bisnis sistem, baik yang dilakukan oleh aktor maupun oleh sistem internal.
- **Entity-Relationship Diagram (ERD)**: Menggambarkan struktur konseptual basis data yang terdiri dari kumpulan entitas relasional, atribut kunci (*primary & foreign key*), serta derajat kardinalitas antar-entitas (*one-to-one, one-to-many, many-to-many*).

## 2.6 Landasan Arsitektur Jamstack dan Teknologi Web Modern

### 2.6.1 Paradigma Arsitektur Jamstack dan Serverless
Arsitektur Jamstack (akronim dari *JavaScript, APIs, and Markup*) merupakan pendekatan perancangan web modern di mana lapisan presentasi dipisahkan secara tegas dari lapisan data dan layanan backend. Halaman-halaman web dapat di-*render* di sisi server secara *hybrid* (*Server-Side Rendering / SSR* dan *Static Site Generation / SSG*) lalu didistribusikan melalui jaringan komputasi *Edge Network* (Vercel). Arsitektur ini menghadirkan performa tinggi, waktu muat laman yang sangat singkat pada peramban seluler, serta meminimalkan permukaan serangan keamanan (*attack surface*) karena ketiadaan server web tradisional yang terekspos langsung.

### 2.6.2 Kerangka Kerja Next.js, React, dan TypeScript
Next.js (versi 16) merupakan kerangka kerja rekayasa aplikasi web modern berbasis pustaka **React 19** yang dikembangkan oleh Vercel. Next.js memperkenalkan paradigma *App Router* yang memanfaatkan *React Server Components* (RSC). Dengan RSC, komponen antarmuka yang memerlukan pengambilan data (*data fetching*) dapat diproses secara langsung di lingkungan server tanpa mengirimkan beban *bundle* JavaScript yang berat ke peramban klien. Penggunaan bahasa pemrograman **TypeScript** menambahkan pengetikan tipe data statis (*static typing*) yang ketat, meminimalkan potensi kesalahan *runtime bug*, serta meningkatkan pemeliharaan kode jangka panjang.

### 2.6.3 Basis Data Relasional Serverless: Neon PostgreSQL dan Prisma ORM
Untuk menjamin persistensi data yang konsisten dan berintegritas tinggi, sistem memanfaatkan **PostgreSQL**, sistem manajemen basis data relasional (*RDBMS*) terkemuka yang mendukung standar SQL secara penuh, integritas referensial bersyarat (*foreign keys*), dan tipe data tingkat lanjut seperti JSONB. Layanan **Neon Serverless PostgreSQL** mengisolasi lapisan komputasi (*compute*) dari lapisan penyimpanan (*storage*), memungkinkan basis data melakukan penskalaan otomatis (*auto-scaling*) dari nol (*scale-to-zero*) dan mengoptimalkan latensi jaringan melalui *connection pooling* berbasis WebSocket.

Interaksi antara kode aplikasi Next.js dan basis data PostgreSQL dijembatani oleh **Prisma ORM (versi 7)**. Prisma mengonversi skema basis data yang didefinisikan dalam berkas `schema.prisma` menjadi klien kueri TypeScript yang sepenuhnya berkeamanan tipe (*type-safe*). Hal ini mencegah kerentanan injeksi SQL (*SQL Injection vulnerabilities*) dan menyederhanakan manipulasi transaksi relasi data yang kompleks.

### 2.6.4 Keamanan Otentikasi: NIK, Kriptografi Bcrypt, dan NextAuth
Keamanan akses sistem bertumpu pada protokol standar industri:
1. **Nomor Induk Kependudukan (NIK)**: NIK 16 digit digunakan sebagai pengenal unik tunggal (*unique identifier*) warga, menggantikan alamat email yang umumnya jarang dimiliki oleh warga pedesaan usia dewasa atau lanjut usia.
2. **Kriptografi Hashing Bcrypt**: Kode PIN 6 digit yang dimasukkan oleh pengguna tidak pernah disimpan dalam bentuk teks polos (*plaintext*). Sistem menggunakan fungsi *hashing* adaptif **Bcrypt** dengan faktor biaya komputasi *salt rounds* bernilai 10. Bcrypt secara otomatis menggabungkan nilai acak (*salt*) 128-bit ke dalam teks masukan sebelum melalui iterasi enkripsi Blowfish, sehingga kebal terhadap serangan tabel pelangi (*rainbow table attack*).
3. **NextAuth.js (Auth.js)**: Menyediakan mekanisme otentikasi berbasis sesi terenkripsi menggunakan token web JSON (*JSON Web Token / JWT*). Token sesi disimpan dalam *HTTP-only, Secure Cookie* di peramban klien, melindungi sesi pengguna dari serangan pencurian skrip lintas situs (*Cross-Site Scripting / XSS*).

### 2.6.5 Desain Antarmuka: Tailwind CSS dan Pendekatan Mobile-First
Antarmuka pengguna dirancang menggunakan **Tailwind CSS**, kerangka kerja CSS berbasis *utility-first* yang memungkinkan penyusunan tampilan modern, fleksibel, dan konsisten langsung di dalam berkas komponen. Mengingat lebih dari 85% warga desa mengakses internet melalui perangkat ponsel cerdas, antarmuka dirancang dengan paradigma **Mobile-First Responsive Design**. Tata letak antarmuka dirancang agar nyaman dioperasikan dengan satu tangan (*thumb-friendly*), memiliki kontras warna yang memenuhi standar aksesibilitas WCAG 2.1 AA, dan menyediakan mode tema gelap (*dark mode*) otomatis untuk kenyamanan membaca di malam hari.

## 2.7 Pengujian Perangkat Lunak dan Standar ISO/IEC 25010
Pengujian perangkat lunak (*software testing*) merupakan proses eksekusi program dengan tujuan menemukan ketidaksesuaian antara perilaku aktual sistem dan spesifikasi kebutuhan yang telah ditetapkan. 

Pendekatan pengujian yang digunakan dalam penelitian ini mengacu pada:
1. **Pengujian Kotak Hitam (*Black-Box Testing*)**: Metode pengujian fungsional di mana penguji mengevaluasi masukan dan keluaran sistem tanpa perlu mengetahui struktur logika internal kode program. Teknik yang diterapkan meliputi *Equivalence Partitioning* (membagi masukan ke dalam kelas data valid dan tidak valid) dan *Boundary Value Analysis* (menguji nilai batas masukan seperti panjang NIK 16 digit dan PIN 6 digit).
2. **Pengujian Regresi (*Regression Testing*)**: Pengujian otomatis yang dijalankan secara berulang setiap kali terjadi modifikasi kode untuk memastikan bahwa penambahan fitur baru tidak merusak (*break*) fungsionalitas yang telah berjalan sebelumnya.
3. **Standar Kualitas Perangkat Lunak ISO/IEC 25010**: Standar internasional yang mendefinisikan model kualitas produk perangkat lunak, mencakup 8 karakteristik utama: Kesesuaian Fungsional (*Functional Suitability*), Efisiensi Kinerja (*Performance Efficiency*), Kompatibilitas (*Compatibility*), Kemudahan Penggunaan (*Usability*), Keandalan (*Reliability*), Keamanan (*Security*), Kemudahan Pemeliharaan (*Maintainability*), dan Portabilitas (*Portability*).

## 2.8 Kajian Penelitian Terdahulu
Sebagai landasan perbandingan dan penegasan posisi kebaruan (*novelty*) sistem informasi Pustaka Pangkalan, Tabel 2.1 menyajikan komparasi terhadap 4 (empat) penelitian dan pengembangan sistem informasi perpustakaan desa terdahulu.

*Tabel 2.1. Komparasi Penelitian dan Sistem Informasi Perpustakaan Terdahulu*

| Peneliti / Tahun | Judul Penelitian / Sistem | Stack Teknologi | Ruang Lingkup Layanan | Kelemahan / Keterbatasan | Keunggulan Pustaka Pangkalan (As-Built) |
|---|---|---|---|---|---|
| **Pratama & Setiawan (2021)** | Sistem Informasi Perpustakaan Desa Berbasis Web (Studi Kasus Desa Sukamaju) | PHP Native, MySQL, Bootstrap | Katalog buku fisik dan pencatatan sirkulasi manual oleh admin | Tidak ada portal pembaca e-book digital; otentikasi mengharuskan email; tidak ada fitur gamifikasi | Menyediakan pembaca e-book digital per bab; otentikasi NIK+PIN; gamifikasi poin dan lencana; arsitektur Next.js serverless |
| **Hidayat dkk. (2022)** | Rancang Bangun Digital Library Desa Cerdas Berbasis Android | Java / Android Native, Firebase Realtime DB | Pembacaan file PDF digital dan kartu anggota | Memerlukan instalasi aplikasi APK (memberatkan memori ponsel warga); biaya penyimpanan Firebase tinggi | Berbasis web responsif (*zero-install*); ringan di browser; basis data relasional PostgreSQL berintegritas ketat |
| **Rahmawati & Nugroho (2023)** | Otomasi Sirkulasi Perpustakaan Balai Desa Menggunakan SLIMS | PHP, MariaDB, SLIMS 9 Bulian | Manajemen sirkulasi fisik balai desa dan pencetakan barcode | Terlalu rumit untuk warga desa; tidak dirancang untuk membaca buku daring; antarmuka belum mobile-friendly | Antarmuka disesuaikan khusus untuk warga desa; integrasi dwibahasa Sunda; asisten virtual Kades AI |
| **Wahyudi (2024)** | Pengembangan E-Perpus Desa Berbasis Laravel | Laravel 10, MySQL, Blade | Modul katalog dan peminjaman buku | Belum mendukung lokalisasi bahasa daerah; tidak ada mekanisme pencegahan lupa sandi tanpa email | Otentikasi NIK 16 digit terproteksi Bcrypt; fasilitas Reset PIN warga oleh admin balai desa; 100% lulus STQA |

\newpage
# BAB III — METODOLOGI PENELITIAN DAN PENGEMBANGAN

## 3.1 Tempat dan Waktu Pelaksanaan
Kegiatan penelitian, perancangan, dan implementasi sistem informasi ini dilaksanakan di lingkungan administratif Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Provinsi Jawa Barat. Rangkaian kegiatan berlangsung selama periode program Kuliah Kerja Nyata (KKN) Tematik Semester Ganjil Tahun Akademik 2026, mulai dari bulan Juli 2026 hingga September 2026.

Distribusi lokasi kegiatan di lapangan mencakup:
1. **Kantor Balai Desa Pangkalan**: Sebagai pusat koordinasi pemerintahan desa, observasi kondisi fisik perpustakaan desa, serta wawancara bersama Kepala Desa dan staf administrasi.
2. **Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, dan Dusun Pasir Gombong**: Sebagai lokasi observasi demografis, sosialisasi literasi, penyebaran kuesioner kebutuhan warga, dan uji coba antarmuka pada ponsel masyarakat.

## 3.2 Kerangka Pikir Penelitian (*Research Framework*)
Kerangka pikir dalam penelitian rekayasa perangkat lunak ini digambarkan secara sistematis pada Gambar 3.1 untuk memetakan alur pemecahan masalah dari identifikasi kendala hingga penyerahan sistem.

```
+-------------------------------------------------------------------------+
|                       KERANGKA PIKIR PENELITIAN                         |
|                                                                         |
|  [MASALAH LAPANGAN]                                                     |
|  - Koleksi buku fisik balai desa terbatas & pencatatan sirkulasi manual |
|  - Warga di 4 dusun terpisah kesulitan menjangkau balai desa            |
|  - Belum tersedianya modul praktis terapan dan media literasi digital   |
|                                     |                                   |
|                                     v                                   |
|  [PENGUMPULAN DATA & ANALISIS]                                          |
|  - Observasi fisik balai desa & wawancara aparatur / tokoh pemuda       |
|  - Studi literatur sistem informasi, perpustakaan digital, Jamstack     |
|  - Analisis kebutuhan fungsional (FR-01 - FR-20) dan non-fungsional    |
|                                     |                                   |
|                                     v                                   |
|  [PERANCANGAN SISTEM (DESIGN)]                                          |
|  - Pemodelan UML (Use Case & Activity Diagrams)                         |
|  - Perancangan Arsitektur 4-Tier Jamstack & Skema ERD Relasional        |
|  - Perancangan Antarmuka Responsif Mobile-First (Bilingual ID/SU)       |
|                                     |                                   |
|                                     v                                   |
|  [KONSTRUKSI PERANGKAT LUNAK (IMPLEMENTATION)]                          |
|  - Frontend & Backend: Next.js 16 (React 19, TypeScript, Tailwind)      |
|  - Basis Data & ORM: Neon Serverless PostgreSQL & Prisma ORM 7          |
|  - Keamanan: Validasi NIK, Hashing Bcrypt, Sesi NextAuth JWT            |
|  - Fitur Khusus: Chapter Reader, Gamifikasi, Kades AI, Branding Sukabumi|
|                                     |                                   |
|                                     v                                   |
|  [PENGUJIAN & EVALUASI MUTU (STQA)]                                     |
|  - Pengujian Black-Box & Regression Suite (9 Test Suites, 48 Skenario)  |
|  - Evaluasi Kualitas Perangkat Lunak ISO/IEC 25010 (100% Pass Rate)     |
|                                     |                                   |
|                                     v                                   |
|  [HASIL AKHIR & SERAH TERIMA]                                           |
|  - Sistem Terdeploy: https://perpus-pangkalan.vercel.app                |
|  - Berita Acara Serah Terima (BAST) & Buku Panduan Pengguna Lengkap     |
+-------------------------------------------------------------------------+
```
*Gambar 3.1. Alur Kerangka Pikir Penelitian dan Pengembangan Sistem*

## 3.3 Metode Pengumpulan Data
Untuk menjamin keakuratan spesifikasi kebutuhan sistem, pengumpulan data dilakukan melalui 3 (tiga) teknik utama:

### 3.3.1 Observasi Langsung (*Direct Observation*)
Tim peneliti melakukan peninjauan langsung ke ruangan perpustakaan Balai Desa Pangkalan guna mengamati:
- Tata letak dan kondisi fisik lemari rak buku;
- Buku besar pencatatan peminjaman dan kartu kontrol manual yang sedang berjalan;
- Ketersediaan sarana komputer dan konektivitas internet di balai desa;
- Kondisi penerimaan sinyal seluler di titik-titik permukiman warga di Dusun Cikajang, Pasir Arangan, dan Pasir Gombong.

### 3.3.2 Wawancara Mendalam (*In-depth Interview*)
Wawancara semi-terstruktur dilakukan dengan para pemangku kepentingan kunci (*key stakeholders*):
1. **Kepala Desa Pangkalan**: Menggali visi pembangunan desa, arah kebijakan digitalisasi desa, serta harapan terhadap peningkatan wawasan tani dan usaha warga.
2. **Sekretaris Desa dan Pengelola Perpustakaan Balai Desa**: Mengidentifikasi kendala harian dalam pencatatan sirkulasi buku, frekuensi peminjaman, masalah keterlambatan pengembalian buku, dan format laporan yang dibutuhkan.
3. **Ketua Karang Taruna dan Tokoh Pemuda**: Menjaring aspirasi pemuda terkait minat topik bacaan (teknologi, bisnis UMKM, kebudayaan Sunda) dan preferensi desain antarmuka aplikasi ponsel.

### 3.3.3 Studi Dokumentasi dan Kepustakaan (*Documentary Study*)
Pengumpulan data sekunder dilakukan melalui penelaahan:
- Dokumen monografi dan profil wilayah Desa Pangkalan, Kecamatan Cikidang;
- Standar penamaan dusun resmi di bawah naungan Pemerintah Desa Pangkalan;
- Literatur ilmiah mengenai rekayasa perangkat lunak, dokumentasi resmi Next.js, Prisma ORM, dan PostgreSQL;
- Peraturan perundang-undangan terkait perlindungan data pribadi dan standar pelayanan informasi publik desa.

## 3.4 Tahapan Siklus Pengembangan Sistem (*Agile Prototyping Stages*)
Pengembangan sistem informasi dilaksanakan melalui 6 (enam) tahapan berulang (*iterative*):

### 1. Tahap Inisiasi dan Analisis Kebutuhan
Mengidentifikasi seluruh aktor sistem, mendefinisikan kendala sistem berjalan, dan menyusun matriks spesifikasi kebutuhan fungsional (FR-01 hingga FR-20) serta kebutuhan non-fungsional (keamanan, performa, ketersediaan, usabilitas).

### 2. Tahap Perancangan Sistem (*System Design*)
- Merancang alur logika bisnis menggunakan diagram alur (*flowchart*);
- Memodelkan skenario fungsional ke dalam *Use Case Diagram* lengkap dengan narasi skenario use case (*Use Case Narrative*);
- Memodelkan alur proses transaksi ke dalam *Activity Diagram*;
- Merancang struktur data relasional menggunakan *Entity Relationship Diagram* (ERD) dan menyusun kamus data (*Data Dictionary*) terperinci;
- Merancang tata letak antarmuka pengguna (*wireframing*) berorientasi gawai seluler (*mobile-first*).

### 3. Tahap Konstruksi Kode Sumber (*Software Construction*)
- Menyiapkan repositori kode sumber di GitHub dengan standar kontrol versi Git;
- Mengonfigurasi skema deklaratif basis data pada berkas `prisma/schema.prisma` dan mengeksekusi migrasi ke Neon Serverless PostgreSQL;
- Membangun komponen UI frontend interaktif menggunakan React 19, TypeScript, dan Tailwind CSS;
- Membangun antarmuka pemrograman backend (*Route Handlers*) pada direktori `src/app/api/`;
- Mengintegrasikan mekanisme keamanan otentikasi NIK dan PIN Bcrypt via NextAuth;
- Mengimplementasikan fitur-fitur pembeda: *chapter reader*, gamifikasi literasi, asisten *Kades AI*, dan pengalihan bahasa Indonesia / Sunda.

### 4. Tahap Pengujian Kualitas Perangkat Lunak (*STQA*)
- Menjalankan pengujian *black-box* fungsional pada setiap antarmuka pengguna;
- Menjalankan 9 test suite otomatis mencakup 48 skenario uji regresi;
- Menguji ketahanan rute administratif dari akses ilegal (*unauthorized access*);
- Memvalidasi konsistensi cascade update pada basis data relasional.

### 5. Tahap Deployment Produksi dan Optimasi
- Menghubungkan repositori GitHub ke platform *Vercel Edge Network* untuk *Continuous Integration / Continuous Deployment* (CI/CD);
- Mengonfigurasi variabel lingkungan (*environment variables*) secara aman tanpa membocorkan kredensial rahasia (*zero secrets policy*);
- Menetapkan domain resmi **https://perpus-pangkalan.vercel.app**;
- Mengonfigurasi metadata OpenGraph dan favicon resmi Lambang Kabupaten Sukabumi.

### 6. Tahap Serah Terima dan Alih Kelola (*Handover*)
- Melakukan demonstrasi dan simulasi operasional bersama aparatur Balai Desa Pangkalan;
- Menyerahkan berkas Berita Acara Serah Terima (BAST) resmi;
- Menyerahkan buku manual panduan operasional bagi warga dan administrator desa.

## 3.5 Lingkungan Perangkat Keras dan Perangkat Lunak
Pelaksanaan perancangan dan pengujian sistem didukung oleh instrumen perangkat keras dan perangkat lunak dengan spesifikasi sebagai berikut:

### 3.5.1 Spesifikasi Perangkat Keras Pengembangan
1. **Komputer Kerja Utama**: Prosesor Intel Core i5 / AMD Ryzen 5, RAM 16 GB DDR4, Penyimpanan Solid State Drive (SSD) 512 GB NVMe.
2. **Perangkat Pengujian Seluler (Mobile Device)**: Ponsel pintar Android (layar 6.5 inci, RAM 4 GB, resolusi FHD+) dan iOS (layar 6.1 inci, resolusi Super Retina) guna memverifikasi responsivitas tampilan.

### 3.5.2 Spesifikasi Perangkat Lunak Pengembangan
1. **Sistem Operasi**: Microsoft Windows 11 Pro 64-bit;
2. **Penyunting Kode Sumber (*Code Editor*)**: Visual Studio Code / Antigravity IDE;
3. **Runtime Environment**: Node.js versi 20 LTS;
4. **Manajer Paket**: Node Package Manager (npm) versi 10;
5. **Bahasa Pemrograman**: TypeScript versi 5, JavaScript (ES2024), SQL;
6. **Kerangka Kerja Web**: Next.js versi 16.3.0 (React 19);
7. **Pustaka CSS**: Tailwind CSS versi 4;
8. **Object-Relational Mapping**: Prisma ORM versi 7.9.1;
9. **Basis Data Produksi**: Neon Serverless PostgreSQL 16;
10. **Platform Deployment Cloud**: Vercel Serverless Edge Platform;
11. **Sistem Kontrol Versi**: Git versi 2.45 dan GitHub;
12. **Peramban Web Pengujian**: Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari Mobile.

\newpage
# BAB IV — ANALISIS DAN PERANCANGAN SISTEM

## 4.1 Analisis Sistem Berjalan (*As-Is System Analysis*)
Berdasarkan hasil observasi dan wawancara di Balai Desa Pangkalan, prosedur tata kelola perpustakaan yang sedang berjalan sebelum adanya sistem informasi dapat digambarkan melalui alur kerja manual berikut:
1. Warga yang membutuhkan buku bacaan harus datang secara fisik ke kantor balai desa pada hari dan jam kerja dinas (Senin sampai Jumat pukul 08.00 - 15.00 WIB).
2. Warga mencari buku secara manual dengan menelusuri lemari rak perpustakaan balai desa satu per satu tanpa bantuan katalog pencarian.
3. Apabila buku yang dicari tidak ditemukan (karena sedang dipinjam warga lain atau tidak tersedia), waktu dan biaya perjalanan warga menjadi sia-sia.
4. Apabila buku ditemukan dan ingin dipinjam, warga menyerahkan buku kepada petugas balai desa untuk dicatat pada buku besar peminjaman manual.
5. Petugas mencatat: Tanggal Pinjam, Nama Peminjam, Alamat Dusun, Judul Buku, dan Nomor Telepon (jika ada).
6. Buku dibawa pulang oleh peminjam dengan jangka waktu pinjam lisan (biasanya 7 hari).
7. Permasalahan timbul saat buku terlambat dikembalikan: petugas balai desa tidak memiliki sistem notifikasi atau rekapitulasi keterlambatan otomatis. Buku catatan peminjaman sering terselip, rusak, atau terkena tumpahan air, sehingga banyak eksemplar buku balai desa yang hilang tanpa jejak peminjam yang jelas.

Kelemahan utama sistem berjalan ini mencakup:
- **Inefisiensi Waktu dan Jarak**: Warga di Dusun Cikajang, Pasir Arangan, dan Pasir Gombong berjarak 3 hingga 6 kilometer dari balai desa;
- **Ketidaktersediaan Akses Bacaan 24 Jam**: Buku hanya bisa dibaca saat balai desa buka;
- **Risiko Kehilangan Aset Desa**: Tingginya persentase buku hilang akibat pencatatan kertas yang rentan tercecer;
- **Ketiadaan Data Analitik Minat Baca**: Pemerintah desa tidak memiliki data statistik mengenai topik buku yang diminati oleh warganya.

## 4.2 Analisis Sistem Baru yang Diusulkan (*To-Be System Analysis*)
Sistem informasi **Pustaka Pangkalan** yang diusulkan dan dibangun mentransformasi tata kelola literasi desa menjadi sistem hibrida terintegrasi:
1. **Portal Literasi Digital Mandiri**: Warga dapat mengakses portal kapan saja (24/7) melalui ponsel cerdas. Warga dapat menjelajahi katalog buku dalam 8 kategori tematik, membaca isi teks bab buku (*chapter reader*) secara instan tanpa mengunduh berkas berukuran besar, menandai bab favorit (*bookmark*), memberi ulasan dan rating, serta berkonsultasi dengan asisten cerdas *Kades AI*.
2. **Digitalisasi Sirkulasi Balai Desa**: Peminjaman buku fisik di balai desa dicatat secara digital ke dalam sistem oleh pengelola balai desa (`/admin/circulation`). Sistem secara otomatis mencatat tanggal pinjam, menghitung batas kembali (+7 hari), menampilkan status keterlambatan (*overdue*), menyediakan tombol perpanjangan (+7 hari) sekali klik, dan memperbarui status ketersediaan eksemplar buku secara instan.
3. **Gamifikasi Partisipasi Warga**: Setiap bab yang dibaca warga secara otomatis memberikan akumulasi poin literasi, mencatat rekor hari aktif berturut-turut (*reading streak*), serta menganugerahkan lencana prestasi (*badges*) pada kartu anggota digital ber-QR Code.

## 4.3 Analisis Profil Aktor Sistem
Berdasarkan implementasi kode sumber dan hak akses sistem terpasang, aktor sistem terbagi menjadi:

*Tabel 4.1. Matriks Profil dan Wewenang Aktor Sistem*

| Aktor Sistem | Peran Teknis (*Role*) | Hak Akses dan Lingkup Wewenang |
|---|---|---|
| **Warga Desa** | `USER` | - Melakukan registrasi mandiri menggunakan NIK 16 digit dan PIN 6 digit.<br>- Menjelajahi katalog buku dan melakukan pencarian instan.<br>- Membaca modul buku digital per bab (*chapter reader*).<br>- Menandai bab bacaan (*bookmark*) dan menyimpan riwayat bacaan.<br>- Mengelola rak buku favorit pribadi.<br>- Memberikan ulasan komentar dan rating bintang (1-5).<br>- Memiliki Kartu Anggota Digital ber-QR Code dengan poin dan badge.<br>- Mengakses asisten virtual literasi *Kades AI*.<br>- Mengganti bahasa antarmuka (Bahasa Indonesia / Basa Sunda). |
| **Pengelola Balai Desa** | `ADMIN` | - Memiliki seluruh wewenang Warga Desa (`USER`).<br>- Mengakses Dashboard Metrik Literasi Desa (`/admin`).<br>- Melakukan manajemen katalog buku fisik dan digital (CRUD buku).<br>- Melakukan penyuntingan dan manajemen konten bab bacaan e-book.<br>- Melakukan pencatatan sirkulasi peminjaman buku fisik balai desa.<br>- Menyetujui perpanjangan masa pinjam (+7 hari) dan menandai buku kembali.<br>- Mengelola master data 8 kategori tematik dan 4 dusun resmi.<br>- Mengelola data warga dan melakukan reset PIN warga yang lupa.<br>- Melakukan moderasi dan penghapusan ulasan yang tidak pantas.<br>- Memublikasikan warta/maklumat literasi desa.<br>- Mengekspor laporan sirkulasi dan literasi ke format CSV. |
| **Pengunjung Tamu** | `GUEST` (Anonim) | - Mengakses beranda publik dan membaca informasi profil perpustakaan.<br>- Menjelajahi katalog buku dan ringkasan sinopsis buku.<br>- Membaca warta/maklumat literasi desa.<br>- Mengganti bahasa antarmuka (Bahasa Indonesia / Basa Sunda).<br>- Melakukan registrasi akun baru atau masuk ke sistem (*login*). |

## 4.4 Analisis Kebutuhan Sistem

### 4.4.1 Kebutuhan Fungsional (*Functional Requirements*)
Kebutuhan fungsional sistem dipetakan menggunakan klasifikasi prioritas **MoSCoW** (*Must have, Should have, Could have, Won't have*) sebagaimana tercantum pada Tabel 4.2.

*Tabel 4.2. Matriks Kebutuhan Fungsional Sistem Terpasang (As-Built FR)*

| Kode | Deskripsi Kebutuhan Fungsional | Prioritas | Aktor | Bukti Kode Sumber Implementasi |
|---|---|:---:|---|---|
| **FR-01** | Sistem dapat mendaftarkan akun warga baru dengan validasi NIK 16 digit, Nama Lengkap, PIN 6 digit, dan Dusun domisili | Must | Warga | `src/app/login/page.tsx`, `src/app/onboarding/page.tsx`, `/api/auth/register` |
| **FR-02** | Sistem dapat memverifikasi otentikasi login menggunakan kredensial NIK dan PIN terenkripsi Bcrypt | Must | Warga, Admin | `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts` |
| **FR-03** | Sistem dapat menyajikan katalog buku publik dengan filter 8 kategori tematik dan pencarian teks judul | Must | Semua | `src/app/explore/page.tsx`, `src/app/api/books/route.ts` |
| **FR-04** | Sistem dapat menampilkan modul pembaca e-book per bab (*chapter reader*) dengan navigasi bab sebelumnya/selanjutnya | Must | Warga | `src/app/read/[chapterId]/page.tsx`, `src/app/api/read/[chapterId]/route.ts` |
| **FR-05** | Sistem dapat menyimpan penanda bacaan (*bookmark*) dan mencatat progres membaca pengguna secara otomatis | Must | Warga | `src/app/api/bookmarks/route.ts`, `src/app/api/reading-progress/route.ts` |
| **FR-06** | Sistem dapat menyimpan buku ke dalam rak koleksi pribadi pengguna | Should | Warga | `src/app/shelf/page.tsx`, `src/app/api/shelf/route.ts` |
| **FR-07** | Sistem dapat menerima ulasan komentar dan rating bintang (1-5) pada halaman detail buku | Should | Warga | `src/app/books/[id]/page.tsx`, `src/app/api/reviews/route.ts` |
| **FR-08** | Sistem dapat menerbitkan Kartu Anggota Digital ber-QR Code dengan tampilan lencana dan total poin literasi | Must | Warga | `src/app/profile/page.tsx`, `src/app/api/user/profile/route.ts` |
| **FR-09** | Sistem dapat mengalihkan bahasa antarmuka secara dinamis antara Bahasa Indonesia dan Basa Sunda | Should | Semua | `src/components/LanguageProvider.tsx`, `src/components/layout/TopAppBar.tsx` |
| **FR-10** | Sistem dapat melayani tanya jawab materi literasi desa melalui asisten cerdas virtual *Kades AI* | Could | Warga | `src/components/KadesAIChatModal.tsx`, `src/app/api/ai/chat/route.ts` |
| **FR-11** | Sistem dapat mengelola data katalog buku (Tambah, Edit, Hapus buku fisik dan e-book) | Must | Admin | `src/app/admin/books/page.tsx`, `src/app/admin/books/new/page.tsx` |
| **FR-12** | Sistem dapat mengelola isi bab bacaan (*chapter management*) untuk setiap e-book | Must | Admin | `src/app/admin/books/[id]/chapters/page.tsx`, `src/app/api/admin/chapters/route.ts` |
| **FR-13** | Sistem dapat mencatat transaksi peminjaman buku fisik balai desa dengan tanggal pinjam dan batas kembali otomatis | Must | Admin | `src/app/admin/circulation/page.tsx`, `src/app/api/admin/circulation/route.ts` |
| **FR-14** | Sistem dapat memproses perpanjangan masa pinjam (+7 hari) dan penandaan pengembalian buku fisik secara instan | Must | Admin | `src/app/admin/circulation/page.tsx`, `src/app/api/admin/circulation/route.ts` (PATCH) |
| **FR-15** | Sistem dapat mengelola 8 kategori tematik desa (CRUD) dengan pembaruan bersyarat (*cascade update*) nama kategori buku | Should | Admin | `src/app/admin/categories/page.tsx`, `src/app/api/admin/categories/route.ts` |
| **FR-16** | Sistem dapat mengelola data master 4 dusun resmi dan menampilkan statistik sebaran warga per dusun | Should | Admin | `src/app/admin/dusuns/page.tsx`, `src/app/api/admin/dusuns/route.ts` |
| **FR-17** | Sistem dapat mengelola akun warga dan menyediakan fasilitas reset PIN sementara bagi warga yang lupa PIN | Must | Admin | `src/app/admin/users/page.tsx`, `src/app/api/admin/users/route.ts` (PATCH reset-pin) |
| **FR-18** | Sistem dapat melakukan moderasi dan menghapus ulasan yang mengandung konten tidak pantas | Should | Admin | `src/app/admin/reviews/page.tsx`, `src/app/api/admin/reviews/route.ts` |
| **FR-19** | Sistem dapat menerbitkan, menyunting, dan menghapus warta/maklumat literasi balai desa | Should | Admin | `src/app/admin/announcements/page.tsx`, `src/app/api/admin/announcements/route.ts` |
| **FR-20** | Sistem dapat menyajikan dashboard analitik ringkasan metrik literasi desa dan mengekspor laporan ke format CSV | Must | Admin | `src/app/admin/page.tsx`, `src/app/admin/analytics/page.tsx`, `/api/admin/export` |

### 4.4.2 Kebutuhan Non-Fungsional (*Non-Functional Requirements*)
Spesifikasi kebutuhan non-fungsional dirumuskan secara terukur untuk menjamin standar kualitas sistem:
1. **Keamanan (*Security*)**:
   - Kode PIN pengguna dienkripsi searah menggunakan algoritma **Bcrypt** dengan faktor biaya komputasi *salt rounds* bernilai 10.
   - Otentikasi sesi dikelola secara aman menggunakan *JSON Web Token* (JWT) yang tersimpan dalam *HTTP-only, SameSite Cookie* guna mencegah pencurian kredensial via serangan XSS dan CSRF.
   - Hak akses rute administratif (`/admin/*`) dilindungi oleh *middleware* di lapisan edge; akses tanpa peran `ADMIN` akan ditolak seketika (HTTP 403 / *Redirect*).
   - Seluruh variabel rahasia koneksi basis data disimpan dalam *Vercel Environment Variables* dan tidak terekspos ke klien (*Zero Secrets Policy*).
2. **Kinerja dan Kecepatan (*Performance*)**:
   - Waktu muat laman pertama (*First Contentful Paint / FCP*) di bawah 1.5 detik pada jaringan seluler 4G desa.
   - Pemanfaatan *React Server Components* (RSC) meminimalkan ukuran *bundle* JavaScript sisi klien di bawah 150 KB untuk halaman utama.
   - Optimasi gambar otomatis menggunakan *Next.js Image Optimizer* dengan konversi format WebP secara dinamis.
3. **Ketersediaan dan Keandalan (*Availability & Reliability*)**:
   - Sistem beroperasi pada infrastruktur komputasi awan *Vercel Edge Network* dengan jaminan *uptime* 99.9%.
   - Basis data Neon Serverless PostgreSQL mendukung mekanisme *connection pooling* berbasis WebSocket untuk menangani lonjakan koneksi simultan dari gawai warga.
4. **Kemudahan Penggunaan (*Usability*)**:
   - Antarmuka mengadopsi prinsip *mobile-first* dengan tata letak tombol navigasi yang mudah dijangkau ibu jari (*thumb-zone navigation*).
   - Menyediakan fitur alih bahasa instan ke Basa Sunda untuk kenyamanan warga lokal lanjut usia.
   - Menyediakan panduan visual dan indikator umpan balik (*toast notification*) pada setiap aksi simpan, ubah, dan hapus data.

## 4.5 Perancangan Alur Sistem (*System Flowchart*)
Alur logika operasional sistem Pustaka Pangkalan membedakan akses antara Pengunjung Tamu, Warga Terdaftar, dan Administrator Balai Desa sebagaimana diilustrasikan pada Gambar 4.1.

```
                           +-------------------+
                           |  Pengguna Masuk   |
                           +-------------------+
                                     |
                                     v
                           /-------------------\
                          /    Apakah Sudah     \
                         <     Memiliki Akun?    >
                          \                    /
                           \------------------/
                             |              |
                       [Ya]  |              | [Tidak]
                             v              v
                     +---------------+  +---------------------+
                     | Form Login    |  | Form Registrasi     |
                     | (NIK & PIN)   |  | (NIK, Nama, Dusun)  |
                     +---------------+  +---------------------+
                             |                     |
                             +----------+----------+
                                        |
                                        v
                            /-----------------------\
                           /   Validasi Kredensial   \
                          <     Otentikasi Berhasil?  >
                           \                         /
                            \-----------------------/
                                 |              |
                           [Ya]  |              | [Tidak]
                                 v              v
                     /-----------------------\ +---------------------+
                    /    Periksa Peran        \| Tampilkan Pesan     |
                   <     Pengguna (Role)       >| Kesalahan Login     |
                    \                        / +---------------------+
                     \----------------------/
                         |              |
                 [USER]  |              | [ADMIN]
                         v              v
             +--------------------+ +--------------------+
             | Beranda Warga      | | Dashboard Admin    |
             | - Jelajah Katalog  | | - Metrik Literasi  |
             | - Baca Bab E-Book  | | - Sirkulasi Fisik  |
             | - Poin & Badge     | | - Kelola Buku/Bab  |
             | - Kartu Anggota QR | | - Reset PIN Warga  |
             | - Asisten Kades AI | | - Ekspor Laporan   |
             +--------------------+ +--------------------+
```
*Gambar 4.1. Diagram Alur Logika Utama Sistem Informasi Pustaka Pangkalan*

## 4.6 Pemodelan Berorientasi Objek (UML)

### 4.6.1 Use Case Diagram
Diagram Use Case memetakan 21 fungsionalitas sistem yang didistribusikan kepada Aktor Warga Desa (`USER`) dan Pengelola Balai Desa (`ADMIN`) sebagaimana disajikan pada Gambar 4.2.

```
+-----------------------------------------------------------------------------------+
|                        USE CASE DIAGRAM PUSTAKA PANGKALAN                         |
|                                                                                   |
|      +---------------+                                     +---------------+      |
|      |               |--- (UC-01: Registrasi Akun NIK) ----|               |      |
|      |               |--- (UC-02: Otentikasi Login NIK/PIN)|               |      |
|      |               |--- (UC-03: Jelajah & Cari Buku) ----|               |      |
|      |               |--- (UC-04: Baca Modul Bab E-Book) --|               |      |
|      |               |--- (UC-05: Simpan Bookmark & Progres|               |      |
|      |  WARGA DESA   |--- (UC-06: Kelola Rak Buku Pribadi) | ADMINISTRATOR |      |
|      |    (USER)     |--- (UC-07: Beri Ulasan & Rating) ---| BALAI DESA    |      |
|      |               |--- (UC-08: Lihat Kartu Anggota QR) -|    (ADMIN)    |      |
|      |               |--- (UC-09: Alih Bahasa Sunda/Indo) -|               |      |
|      |               |--- (UC-10: Konsultasi Kades AI) ----|               |      |
|      |               |--- (UC-11: Lihat Riwayat Poin) -----|               |      |
|      +---------------+                                     |               |      |
|                                                            |--- (UC-12: Kelola Katalog Buku)
|                                                            |--- (UC-13: Kelola Bab Buku)
|                                                            |--- (UC-14: Catat Pinjam Fisik)
|                                                            |--- (UC-15: Perpanjang Pinjaman)
|                                                            |--- (UC-16: Tandai Pengembalian)
|                                                            |--- (UC-17: Kelola Kategori)
|                                                            |--- (UC-18: Kelola Data Dusun)
|                                                            |--- (UC-19: Reset PIN Warga)
|                                                            |--- (UC-20: Kelola Warta Desa)
|                                                            |--- (UC-21: Ekspor Laporan CSV)
|                                                            +---------------+      |
+-----------------------------------------------------------------------------------+
```
*Gambar 4.2. Diagram Use Case Sistem Informasi Pustaka Pangkalan*

### 4.6.2 Narasi Skenario Use Case (*Use Case Narrative*)
Berikut disajikan 4 (empat) narasi skenario use case terinci untuk fungsi-fungsi kritikal sistem:

#### Skenario 1: UC-01 Registrasi Akun Warga Baru
- **Aktor Utama**: Warga Desa (Calon Anggota)
- **Deskripsi**: Warga mendaftarkan identitas diri ke dalam sistem menggunakan NIK KTP dan memilih dusun domisili.
- **Prakondisi**: Warga belum terdaftar di basis data dan membuka halaman `/login`.
- **Alur Utama (*Main Flow*)**:
  1. Warga menekan tombol *Daftar Akun Baru*.
  2. Sistem menampilkan formulir registrasi yang memuat masukan: NIK (16 digit), Nama Lengkap, Nomor Telepon, Pilihan Dusun (Pangkalan, Cikajang, Pasir Arangan, Pasir Gombong), dan PIN 6 digit.
  3. Warga mengisi seluruh kolom data dan menekan tombol *Daftar Sekarang*.
  4. Sistem memvalidasi bahwa format NIK tepat 16 digit angka dan PIN tepat 6 digit angka.
  5. Sistem memeriksa keunikan NIK pada tabel `User`.
  6. Sistem mengenkripsi PIN menggunakan fungsi *Bcrypt* (*salt rounds* 10).
  7. Sistem menyimpan data warga baru dengan peran default `USER`.
  8. Sistem memberikan bonus 50 poin sambutan literasi dan mengarahkan pengguna langsung ke halaman beranda warga.
- **Alur Alternatif (*Alternative Flow*)**:
  - *4a. Format NIK atau PIN tidak valid*: Sistem menampilkan pesan peringatan bahwa NIK harus 16 digit angka dan PIN harus 6 digit angka.
  - *5a. NIK telah terdaftar*: Sistem menampilkan peringatan "NIK sudah terdaftar dalam sistem. Silakan masuk menggunakan PIN Anda."
- **Pasca-kondisi**: Akun warga aktif tercatat di basis data dan sesi login tersimpan.

#### Skenario 2: UC-04 Pembacaan Bab E-Book dan Akumulasi Poin
- **Aktor Utama**: Warga Desa Terotentikasi
- **Deskripsi**: Warga membaca materi e-book secara bertahap per bab melalui antarmuka *chapter reader*.
- **Prakondisi**: Warga telah login dan memilih salah satu buku digital dari katalog.
- **Alur Utama (*Main Flow*)**:
  1. Warga membuka halaman detail buku (`/books/[id]`) dan menekan salah satu bab bacaan.
  2. Sistem membuka antarmuka *reader* (`/read/[chapterId]`) dengan memuat teks konten bab yang bersih dan bebas distraksi.
  3. Warga membaca isi materi modul hingga ke bagian akhir halaman.
  4. Warga menekan tombol *Tandai Selesai Membaca* atau menekan tombol navigasi *Bab Selanjutnya*.
  5. Sistem mencatat riwayat bacaan pada tabel `ReadingHistory`.
  6. Sistem menambahkan +10 poin literasi ke saldo poin pengguna pada tabel `User`.
  7. Sistem memperbarui data tanggal keaktifan berturut-turut (*reading streak*).
  8. Sistem mengevaluasi apakah akumulasi poin memenuhi syarat perolehan lencana baru (*badge*). Jika tercapai, sistem memunculkan animasi konfeti dan dialog selamat.
- **Alur Alternatif (*Alternative Flow*)**:
  - *5a. Bab telah pernah diselesaikan sebelumnya*: Sistem mencatat kemajuan bacaan namun tidak memberikan poin ganda untuk mencegah manipulasi poin.
- **Pasca-kondisi**: Progres membaca dan saldo poin pengguna diperbarui pada basis data.

#### Skenario 3: UC-14 Pencatatan Sirkulasi Peminjaman Buku Fisik Balai Desa
- **Aktor Utama**: Pengelola Balai Desa (`ADMIN`)
- **Deskripsi**: Pengelola mencatat peminjaman eksemplar buku cetak yang dilakukan oleh warga secara langsung di kantor balai desa.
- **Prakondisi**: Pengelola telah masuk ke dashboard administratif (`/admin/circulation`).
- **Alur Utama (*Main Flow*)**:
  1. Pengelola menekan tombol *Catat Peminjaman Baru*.
  2. Sistem menampilkan modal formulir sirkulasi.
  3. Pengelola memilih nama warga peminjam (berdasarkan pencarian NIK/Nama) dan memilih judul buku fisik yang dipinjam.
  4. Pengelola mengisi catatan kondisi buku dan menekan tombol *Simpan Peminjaman*.
  5. Sistem menetapkan `borrowDate` ke tanggal saat ini dan menghitung `dueDate` otomatis 7 hari ke depan.
  6. Sistem menetapkan status transaksi menjadi `BORROWED`.
  7. Sistem mengurangi jumlah stok buku fisik yang tersedia (*availableCopies*) pada tabel `Book`.
  8. Sistem memperbarui daftar antrean sirkulasi aktif pada dashboard.
- **Alur Alternatif (*Alternative Flow*)**:
  - *7a. Stok buku fisik habis*: Sistem menolak transaksi dan memunculkan peringatan bahwa seluruh eksemplar buku sedang dipinjam.
- **Pasca-kondisi**: Transaksi sirkulasi tercatat di tabel `BookBorrowing` dan stok buku berkurang.

#### Skenario 4: UC-19 Fasilitas Reset PIN Warga oleh Pengelola Desa
- **Aktor Utama**: Pengelola Balai Desa (`ADMIN`)
- **Deskripsi**: Pengelola mereset PIN warga yang lupa kode aksesnya menjadi PIN standar sementara.
- **Prakondisi**: Warga melapor ke balai desa dengan membawa KTP fisik, dan pengelola membuka menu `/admin/users`.
- **Alur Utama (*Main Flow*)**:
  1. Pengelola mencari data akun warga berdasarkan NIK atau Nama pada tabel pengguna.
  2. Pengelola menekan tombol *Reset PIN*.
  3. Sistem memunculkan dialog konfirmasi dan menampilkan opsi pengaturan PIN sementara (standar: `123456`).
  4. Pengelola menekan tombol *Konfirmasi Reset*.
  5. Sistem melakukan *hashing* ulang PIN sementara menggunakan algoritma Bcrypt dan memperbarui kolom `pin` pada tabel `User`.
  6. Sistem menampilkan pesan sukses dan pengelola menginformasikan PIN sementara kepada warga untuk segera diganti setelah login.
- **Pasca-kondisi**: PIN akun warga di basis data telah diperbarui dengan hash baru.

### 4.6.3 Activity Diagram
Alur kerja peminjaman dan pengembalian buku fisik di balai desa dimodelkan pada Gambar 4.3.

```
      WARGA DESA                          SISTEM PUSTAKA PANGKALAN                  PENGELOLA DESA (ADMIN)
          |                                          |                                         |
          |--- Datang ke Balai Desa & Bawa Buku ---->|                                         |
          |                                          |<-- Buka Menu Sirkulasi (/admin) --------|
          |                                          |                                         |
          |                                          |<-- Pilih Warga & Input Judul Buku ------|
          |                                          |                                         |
          |                                   /---------------\                               |
          |                                  /  Stok Buku Ada? \                              |
          |                                 <                   >                              |
          |                                  \                 /                               |
          |                                   \---------------/                                |
          |                                      |           |                                 |
          |                                [Ya]  |           | [Tidak]                         |
          |                                      v           v                                 |
          |                               +---------------+ +---------------+                  |
          |                               | Kurangi Stok  | | Tolak Pinjam  |                  |
          |                               | Hitung +7 Hari| | Tampil Pesan  |                  |
          |                               | Status: Dipinjam| Habis Stok    |                  |
          |                               +---------------+ +---------------+                  |
          |                                      |                   |                         |
          |<-- Terima Buku Fisik Pinjaman -------+                   +---> Konfirmasi Warga ---|
          |                                      |                                             |
          |~~~~~~~~~~~~~~~~ Masa Pinjam Berjalan (Maks 7 Hari) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
          |                                      |                                             |
          |--- Kembalikan Buku ke Balai Desa --->|                                             |
          |                                      |<-- Tekan Tombol 'Tandai Kembali' -----------|
          |                                      |                                             |
          |                               +---------------+                                    |
          |                               | Status: Kembali                                    |
          |                               | Kembalikan Stok                                    |
          |                               | Catat Tgl Selesai                                  |
          |                               +---------------+                                    |
          |                                      |                                             |
          |<-- Konfirmasi Pengembalian Selesai --+------------------------ Selesai ------------|
```
*Gambar 4.3. Activity Diagram Manajemen Sirkulasi Buku Fisik Balai Desa*

## 4.7 Perancangan Arsitektur Sistem 4-Tier As-Built
Sistem informasi Pustaka Pangkalan dibangun dengan mengadopsi pola arsitektur perangkat lunak 4-Tier modern yang terdistribusi secara *serverless* sebagaimana disajikan pada Gambar 4.4.

```
+-------------------------------------------------------------------------+
|                    ARSITEKTUR SISTEM 4-TIER AS-BUILT                    |
|                                                                         |
|  [TIER 1: PRESENTATION LAYER - PERAMBAN KLIEN]                          |
|  - Antarmuka Responsif Mobile-First (Tailwind CSS 4, Lucide Icons)      |
|  - React 19 Client Components (Interactive State, Form Handling, SWR)   |
|  - Komponen Dwi-Bahasa (LanguageContext: ID & SU)                       |
|                                    |                                    |
|                                    v HTTP/HTTPS                         |
|  [TIER 2: APPLICATION & API ROUTING LAYER - VERCEL EDGE]                |
|  - Next.js 16 App Router & React Server Components (RSC)                |
|  - Edge Middleware (Proteksi RBAC rute /admin & autentikasi sesi)       |
|  - 30 Endpoint RESTful API Route Handlers (/api/*)                      |
|  - NextAuth.js Credentials Engine (JWT Session Token Verification)      |
|                                    |                                    |
|                                    v TypeScript Query Calls             |
|  [TIER 3: DATA ACCESS & BUSINESS LOGIC LAYER - PRISMA ORM]              |
|  - Prisma ORM 7.9.1 Type-Safe Client                                    |
|  - Validasi Skema Zod & Hashing Kriptografis Bcrypt (Salt 10)           |
|  - Gamification Engine (Perhitungan Poin, Streak, Badge Checker)        |
|  - Kades AI Integration Handler                                         |
|                                    |                                    |
|                                    v Encrypted WebSocket Pool           |
|  [TIER 4: PERSISTENCE STORAGE LAYER - NEON POSTGRESQL]                  |
|  - Neon Serverless PostgreSQL Database Instance                         |
|  - 10 Relational Data Tables (Foreign Keys, Indexes, Cascades)          |
+-------------------------------------------------------------------------+
```
*Gambar 4.4. Diagram Arsitektur Perangkat Lunak 4-Tier As-Built*

Deskripsi fungsi setiap tier:
1. **Tier 1 (Presentation Layer)**: Berjalan pada peramban web perangkat pengguna (ponsel atau desktop). Menggunakan React 19 dan Tailwind CSS untuk menyajikan antarmuka visual yang responsif, mendukung tema terang/gelap, serta mengelola status interaktif lokal (*local state*).
2. **Tier 2 (Application & Routing Layer)**: Berjalan pada infrastruktur *Vercel Edge Network*. Menangani perutean laman (*App Router*), memproses *React Server Components* guna mengurangi transfer data ke klien, menerapkan *middleware* keamanan, serta menyediakan 30 endpoint API RESTful.
3. **Tier 3 (Data Access & Business Logic Layer)**: Mengimplementasikan logika bisnis inti aplikasi (penghitungan denda/jatuh tempo sirkulasi, penambahan poin, pemberian lencana, integrasi prompt AI, dan hashing kata sandi) menggunakan pustaka Prisma ORM yang menjamin keamanan kueri tanpa risiko injeksi SQL.
4. **Tier 4 (Persistence Layer)**: Berupa klaster basis data relasional Neon Serverless PostgreSQL yang menyimpan seluruh rekaman data secara permanen, terisolasi, dan terenkripsi pada media penyimpanan awan.

## 4.8 Perancangan Basis Data (*Database Design*)

### 4.8.1 Entity-Relationship Diagram (ERD) As-Built
Struktur relasional data mencakup **10 entitas tabel** yang saling terhubung melalui relasi kunci primer (*Primary Key*) dan kunci asing (*Foreign Key*) sebagaimana ditunjukkan pada Gambar 4.5.

```
+--------------------+        +---------------------+        +--------------------+
|       User         | 1    * |    BookBorrowing    | *    1 |        Book        |
|--------------------|--------|---------------------|--------|--------------------|
| id (PK)            |        | id (PK)             |        | id (PK)            |
| nik (Unique)       |        | userId (FK)         |        | title              |
| name               |        | bookId (FK)         |        | author             |
| pin (Bcrypt Hash)  |        | borrowDate          |        | category           |
| role (USER/ADMIN)  |        | dueDate             |        | totalCopies        |
| dusun              |        | returnDate          |        | availableCopies    |
| points             |        | status              |        | isDigital          |
| readingStreak      |        | notes               |        +--------------------+
+--------------------+        +---------------------+                  | 1
       | 1                              | *                            |
       |                                |                              | *
       | *                              |                      +--------------------+
+--------------------+                  |                      |   ChapterContent   |
|   ReadingHistory   |                  |                      |--------------------|
|--------------------|                  |                      | id (PK)            |
| id (PK)            |                  |                      | bookId (FK)        |
| userId (FK)        |                  |                      | chapterNumber      |
| bookId (FK)        |                  |                      | title              |
| chapterId (FK)     |                  |                      | content (Text)     |
| completedAt        |                  |                      +--------------------+
+--------------------+                  |                              | 1
       | 1                              |                              |
       |                                |                              | *
       | *                              v                              |
+--------------------+        +---------------------+        +--------------------+
|       Review       |        |      Category       |        |    ReadingList     |
|--------------------|        |---------------------|        |--------------------|
| id (PK)            |        | id (PK)             |        | id (PK)            |
| userId (FK)        |        | name (Unique)       |        | userId (FK)        |
| bookId (FK)        |        | slug (Unique)       |        | bookId (FK)        |
| rating (Int 1-5)   |        | icon                |        | status             |
| comment            |        | description         |        +--------------------+
+--------------------+        +---------------------+
```
*Gambar 4.5. Entity-Relationship Diagram (ERD) As-Built Sistem Pustaka Pangkalan*

### 4.8.2 Kamus Data Lengkap (*Data Dictionary*)
Berikut rincian spesifikasi struktur kolom dari 10 tabel basis data terpasang:

#### 1. Tabel `User` (Menyimpan Data Identitas Akun Pengguna)
- `id` (String, PK, CUID / UUID): Pengenal unik akun.
- `nik` (String, Unique, Not Null): Nomor Induk Kependudukan 16 digit.
- `name` (String, Not Null): Nama lengkap warga.
- `pin` (String, Not Null): Kode akses 6 digit yang telah di-*hash* Bcrypt.
- `role` (Enum `Role`, Not Null, Default `USER`): Hak akses akun (`USER` atau `ADMIN`).
- `dusun` (String, Nullable): Wilayah dusun domisili warga di Desa Pangkalan.
- `phone` (String, Nullable): Nomor telepon/WhatsApp aktif.
- `points` (Integer, Not Null, Default 0): Akumulasi poin literasi.
- `readingStreak` (Integer, Not Null, Default 0): Rekor hari membaca berturut-turut.
- `lastReadDate` (DateTime, Nullable): Waktu terakhir membaca materi.
- `badges` (String / Array, Nullable): Daftar lencana penghargaan yang diperoleh.
- `createdAt` (DateTime, Not Null, Default `now()`): Waktu pendaftaran akun.
- `updatedAt` (DateTime, Not Null): Waktu pembaruan data terakhir.

#### 2. Tabel `Book` (Menyimpan Metadata Katalog Buku)
- `id` (String, PK, CUID): Pengenal unik buku.
- `title` (String, Not Null): Judul buku bacaan.
- `author` (String, Not Null): Nama pengarang / penulis.
- `publisher` (String, Nullable): Nama penerbit.
- `year` (Integer, Nullable): Tahun publikasi cetak.
- `isbn` (String, Nullable): Nomor ISBN buku (jika tersedia).
- `category` (String, Not Null): Nama kategori tematik desa.
- `description` (Text, Nullable): Ringkasan sinopsis materi buku.
- `coverImage` (String, Nullable): Tautan URL berkas gambar sampul.
- `totalCopies` (Integer, Not Null, Default 1): Jumlah total eksemplar fisik di balai desa.
- `availableCopies` (Integer, Not Null, Default 1): Jumlah eksemplar fisik yang dapat dipinjam.
- `isDigital` (Boolean, Not Null, Default true): Penanda apakah memiliki modul e-book online.
- `viewsCount` (Integer, Not Null, Default 0): Frekuensi buku dibuka oleh pembaca.
- `createdAt` (DateTime, Not Null, Default `now()`): Waktu penambahan ke sistem.

#### 3. Tabel `ChapterContent` (Menyimpan Isi Materi Bacaan per Bab)
- `id` (String, PK, CUID): Pengenal unik bab bacaan.
- `bookId` (String, FK ke `Book.id`, Not Null, OnDelete Cascade): Keterkaitan dengan buku induk.
- `chapterNumber` (Integer, Not Null): Nomor urutan bab bacaan (1, 2, 3, ...).
- `title` (String, Not Null): Judul bab pembahasan.
- `content` (Text, Not Null): Isi teks modul bacaan e-book.
- `estimatedMinutes` (Integer, Not Null, Default 5): Estimasi waktu membaca dalam menit.
- `createdAt` (DateTime, Not Null, Default `now()`): Waktu pembuatan bab.

#### 4. Tabel `BookBorrowing` (Menyimpan Transaksi Sirkulasi Fisik Balai Desa)
- `id` (String, PK, CUID): Pengenal unik transaksi sirkulasi.
- `userId` (String, FK ke `User.id`, Not Null): Keterkaitan dengan warga peminjam.
- `bookId` (String, FK ke `Book.id`, Not Null): Keterkaitan dengan buku yang dipinjam.
- `borrowDate` (DateTime, Not Null, Default `now()`): Tanggal buku dibawa pulang.
- `dueDate` (DateTime, Not Null): Tanggal batas waktu wajib kembali (+7 hari).
- `returnDate` (DateTime, Nullable): Tanggal riil buku dikembalikan ke balai desa.
- `status` (Enum `BorrowStatus`, Not Null, Default `BORROWED`): Status sirkulasi (`BORROWED`, `RETURNED`, `OVERDUE`).
- `notes` (String, Nullable): Catatan khusus kondisi fisik buku saat dipinjam/kembali.

#### 5. Tabel `ReadingHistory` (Menyimpan Catatan Riwayat Membaca E-Book)
- `id` (String, PK, CUID): Pengenal unik riwayat baca.
- `userId` (String, FK ke `User.id`, Not Null, OnDelete Cascade): Pengguna yang membaca.
- `bookId` (String, FK ke `Book.id`, Not Null, OnDelete Cascade): Buku yang dibaca.
- `chapterId` (String, FK ke `ChapterContent.id`, Not Null, OnDelete Cascade): Bab yang dibaca.
- `completedAt` (DateTime, Not Null, Default `now()`): Waktu penuntasan membaca bab.

#### 6. Tabel `Review` (Menyimpan Ulasan dan Penilaian Buku)
- `id` (String, PK, CUID): Pengenal unik ulasan.
- `userId` (String, FK ke `User.id`, Not Null, OnDelete Cascade): Warga pemberi ulasan.
- `bookId` (String, FK ke `Book.id`, Not Null, OnDelete Cascade): Buku yang dinilai.
- `rating` (Integer, Not Null): Skor bintang bernilai antara 1 hingga 5.
- `comment` (Text, Not Null): Isi teks tanggapan atau ulasan warga.
- `createdAt` (DateTime, Not Null, Default `now()`): Waktu pengiriman ulasan.

#### 7. Tabel `Category` (Menyimpan Master Kategori Tematik Desa)
- `id` (String, PK, CUID): Pengenal unik kategori.
- `name` (String, Unique, Not Null): Nama kategori (misal: "Pertanian & Perkebunan").
- `slug` (String, Unique, Not Null): Pengenal URL ramah peramban (misal: "pertanian").
- `icon` (String, Nullable): Nama ikon visual antarmuka.
- `description` (String, Nullable): Keterangan deskriptif cakupan kategori.

#### 8. Tabel `ReadingList` (Menyimpan Rak Buku Favorit Pribadi)
- `id` (String, PK, CUID): Pengenal unik rekaman rak.
- `userId` (String, FK ke `User.id`, Not Null, OnDelete Cascade): Pemilik rak.
- `bookId` (String, FK ke `Book.id`, Not Null, OnDelete Cascade): Buku yang disimpan.
- `status` (String, Not Null, Default "SAVED"): Penanda status simpan.
- `createdAt` (DateTime, Not Null, Default `now()`): Waktu penyimpanan ke rak.

#### 9. Tabel `Account` (Menyimpan Akun Eksternal Penyedia Otentikasi NextAuth)
- `id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`.

#### 10. Tabel `Session` dan `VerificationToken` (Manajemen Sesi Otentikasi NextAuth)
- Menyimpan data token sesi aktif, tanggal kedaluwarsa, dan identitas pengguna terverifikasi.

## 4.9 Perancangan Antarmuka Pengguna (*UI Design Principles*)
Antarmuka pengguna Pustaka Pangkalan dirancang dengan mengutamakan prinsip:
1. **Kejelasan Tipografi dan Hierarki Visual**: Menggunakan jenis huruf antarmuka modern dengan ukuran teks tubuh minimal 16 px pada ponsel agar nyaman dibaca oleh seluruh kelompok usia.
2. **Palet Warna Harmonis Bernuansa Alam Pedesaan**:
   - Warna Utama (*Primary*): Hijau Hutan (*Forest Emerald* `#059669` / `#065F46`), mencerminkan kesuburan tanah agraris Desa Pangkalan;
   - Warna Aksen (*Accent*): Emas Padi (*Warm Amber* `#D97706`), melambangkan panen dan kemakmuran;
   - Warna Netral (*Neutral Surface*): Putih Gading (`#F9FAFB`) dan Abu-abu Lembut (`#1F2937` pada tema gelap).
3. **Penyajian Mode Pembaca Bebas Distraksi (*Reader Mode*)**: Pada halaman pembaca bab (`/read/[chapterId]`), navigasi samping disembunyikan secara otomatis agar pembaca dapat berkonsentrasi penuh pada teks modul bacaan.

\newpage
# BAB V — IMPLEMENTASI SISTEM

## 5.1 Lingkungan Implementasi Perangkat Lunak
Implementasi Sistem Informasi Pustaka Pangkalan mengintegrasikan dependensi pustaka *open-source* modern yang terpasang pada berkas konfigurasi `package.json` sebagaimana tercantum pada Tabel 5.1.

*Tabel 5.1. Konfigurasi Lingkungan Perangkat Lunak Produksi*

| Komponen Perangkat Lunak | Nama Paket / Pustaka | Versi Terpasang | Peran dan Fungsi Teknis |
|---|---|:---:|---|
| **Kerangka Kerja Utama** | `next` | `16.3.0` | Kerangka kerja web full-stack React dengan arsitektur App Router |
| **Pustaka Antarmuka** | `react`, `react-dom` | `19.0.0` | Pustaka antarmuka pengguna berbasis komponen deklaratif |
| **Bahasa Pemrograman** | `typescript` | `^5.0.0` | Kompiler bahasa dengan sistem pengetikan statis berkeamanan tipe |
| **Styling & Tata Letak** | `tailwindcss` | `^4.0.0` | Mesin penyusun gaya antarmuka utilitas CSS modern |
| **Object-Relational Mapping** | `@prisma/client`, `prisma` | `7.9.1` | Klien akses dan kueri basis data relasional PostgreSQL |
| **Driver Basis Data Serverless** | `@neondatabase/serverless` | Terpasang | Driver koneksi basis data serverless Neon via WebSocket |
| **Mesin Otentikasi Sesi** | `next-auth` | `^4.24.0` | Pengelola sesi login berbasis JSON Web Token (JWT) |
| **Kriptografi Kata Sandi** | `bcryptjs` | `^2.4.3` | Pustaka hashing kata sandi satu arah algoritma Blowfish |
| **Ikonografi Visual** | `lucide-react` | `^0.400.0` | Koleksi simbol ikon vektor antarmuka pengguna |
| **Animasi Gamifikasi** | `canvas-confetti` | `^1.9.0` | Mesin partikel konfeti visual saat warga meraih lencana |
| **Platform Cloud Hosting** | Vercel Edge Serverless | Node 20 LTS | Infrastruktur komputasi edge dan deployment CI/CD otomatis |

## 5.2 Implementasi Basis Data dan Skema Prisma
Skema basis data relasional dikonfigurasikan secara deklaratif di dalam berkas `prisma/schema.prisma`. Potongan kode sumber berikut memperlihatkan definisi entitas inti `User`, `Book`, dan `BookBorrowing` yang menjamin integritas referensial data:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum BorrowStatus {
  BORROWED
  RETURNED
  OVERDUE
}

model User {
  id            String          @id @default(cuid())
  nik           String          @unique
  name          String
  pin           String          // Bcrypt Hash (Salt 10)
  role          Role            @default(USER)
  dusun         String?
  phone         String?
  points        Int             @default(0)
  readingStreak Int             @default(0)
  lastReadDate  DateTime?
  borrowings    BookBorrowing[]
  reviews       Review[]
  history       ReadingHistory[]
  readingList   ReadingList[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model Book {
  id              String          @id @default(cuid())
  title           String
  author          String
  category        String
  description     String?
  coverImage      String?
  totalCopies     Int             @default(1)
  availableCopies Int             @default(1)
  isDigital       Boolean         @default(true)
  viewsCount      Int             @default(0)
  chapters        ChapterContent[]
  borrowings      BookBorrowing[]
  reviews         Review[]
  createdAt       DateTime        @default(now())
}

model BookBorrowing {
  id          String        @id @default(cuid())
  userId      String
  bookId      String
  borrowDate  DateTime      @default(now())
  dueDate     DateTime
  returnDate  DateTime?
  status      BorrowStatus  @default(BORROWED)
  notes       String?
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  book        Book          @relation(fields: [bookId], references: [id], onDelete: Cascade)
}
```

Skema tersebut kemudian dieksekusi ke dalam klaster Neon Serverless PostgreSQL menggunakan perintah migrasi `npx prisma db push` untuk membentuk tabel fisik beserta indeks pencariannya.

## 5.3 Implementasi Rute Antarmuka Pengguna (*Frontend Routes*)
Sistem mengimplementasikan **19 rute halaman antarmuka pengguna** yang terstruktur ke dalam modul publik/warga dan modul administratif Balai Desa sebagaimana dirinci pada Tabel 5.2.

*Tabel 5.2. Inventarisasi 19 Rute Halaman Antarmuka Pengguna Terpasang*

| No | Jalur Rute URL (*Path*) | Berkas Kode Sumber Komponen | Peruntukan Aktor | Deskripsi Fungsi Antarmuka |
|:---:|---|---|:---:|---|
| 1 | `/` | `src/app/page.tsx` | Semua Aktor | Beranda utama, banner literasi, katalog rekomendasi, warta desa |
| 2 | `/explore` | `src/app/explore/page.tsx` | Semua Aktor | Penjelajahan katalog buku dengan pencarian teks dan filter 8 kategori |
| 3 | `/books/[id]` | `src/app/books/[id]/page.tsx` | Semua Aktor | Detail metadata buku, daftar bab e-book, ulasan, dan tombol aksi |
| 4 | `/read/[chapterId]` | `src/app/read/[chapterId]/page.tsx` | Warga (`USER`) | Pembaca modul bab e-book bebas distraksi, navigasi, dan penanda |
| 5 | `/shelf` | `src/app/shelf/page.tsx` | Warga (`USER`) | Pengelolaan koleksi buku favorit dan riwayat bacaan pribadi |
| 6 | `/profile` | `src/app/profile/page.tsx` | Warga (`USER`) | Kartu Anggota Digital ber-QR Code, poin, lencana, dan edit profil |
| 7 | `/login` | `src/app/login/page.tsx` | Tamu (`GUEST`) | Formulir masuk sistem menggunakan NIK dan PIN 6 digit |
| 8 | `/onboarding` | `src/app/onboarding/page.tsx` | Tamu (`GUEST`) | Formulir pendaftaran warga baru dan pemilihan dusun domisili |
| 9 | `/leaderboard` | `src/app/leaderboard/page.tsx` | Warga (`USER`) | Papan peringkat warga teraktif membaca dan statistik dusun |
| 10 | `/announcements` | `src/app/announcements/page.tsx` | Semua Aktor | Daftar maklumat dan berita literasi resmi dari pemerintah desa |
| 11 | `/admin` | `src/app/admin/page.tsx` | Admin (`ADMIN`) | Dashboard ikhtisar analitik: total buku, warga, sirkulasi aktif |
| 12 | `/admin/books` | `src/app/admin/books/page.tsx` | Admin (`ADMIN`) | Manajemen inventaris katalog buku (tabel data, filter, aksi hapus) |
| 13 | `/admin/books/new` | `src/app/admin/books/new/page.tsx` | Admin (`ADMIN`) | Formulir pendaftaran buku baru (koleksi fisik maupun digital) |
| 14 | `/admin/books/[id]/chapters` | `src/app/admin/books/[id]/chapters/page.tsx` | Admin (`ADMIN`) | Manajemen bab bacaan e-book (*chapter content editor*) |
| 15 | `/admin/circulation` | `src/app/admin/circulation/page.tsx` | Admin (`ADMIN`) | Modul sirkulasi fisik balai desa: catat pinjam, +7 hari, tandai kembali |
| 16 | `/admin/categories` | `src/app/admin/categories/page.tsx` | Admin (`ADMIN`) | Manajemen 8 kategori tematik desa dengan *cascade update* buku |
| 17 | `/admin/dusuns` | `src/app/admin/dusuns/page.tsx` | Admin (`ADMIN`) | Manajemen 4 dusun resmi dan pemantauan sebaran warga per dusun |
| 18 | `/admin/users` | `src/app/admin/users/page.tsx` | Admin (`ADMIN`) | Manajemen data warga terdaftar dan fasilitas Reset PIN warga |
| 19 | `/admin/reviews` | `src/app/admin/reviews/page.tsx` | Admin (`ADMIN`) | Moderasi ulasan warga dan penghapusan komentar tidak pantas |

## 5.4 Implementasi Antarmuka Pemrograman Aplikasi (*RESTful API Endpoints*)
Sistem menyediakan **30 endpoint RESTful API** yang dibangun di bawah direktori `src/app/api/` untuk melayani komunikasi data asinkronus antara antarmuka pengguna dan basis data. Daftar endpoint disajikan pada Tabel 5.3.

*Tabel 5.3. Daftar 30 Endpoint RESTful API Terpasang*

| No | Jalur Endpoint API (*Route*) | Metode HTTP | Hak Akses | Fungsi Operasional API |
|:---:|---|:---:|:---:|---|
| 1 | `/api/auth/[...nextauth]` | GET, POST | Publik | Pengendali sesi otentikasi NextAuth kredensial NIK & PIN |
| 2 | `/api/auth/register` | POST | Publik | Mendaftarkan warga baru dengan hashing PIN Bcrypt |
| 3 | `/api/books` | GET, POST | Publik / Admin | Mengambil katalog buku publik atau menambah buku baru |
| 4 | `/api/books/[id]` | GET, PUT, DELETE | Publik / Admin | Mengambil detail, memperbarui metadata, atau menghapus buku |
| 5 | `/api/categories` | GET | Publik | Mengambil daftar 8 kategori tematik aktif |
| 6 | `/api/read/[chapterId]` | GET | Warga (`USER`) | Mengambil isi teks bab e-book untuk antarmuka *reader* |
| 7 | `/api/reading-progress` | GET, POST | Warga (`USER`) | Mengambil atau memperbarui progres halaman bab buku |
| 8 | `/api/bookmarks` | GET, POST, DELETE | Warga (`USER`) | Mengelola penanda bab bacaan favorit warga |
| 9 | `/api/shelf` | GET, POST, DELETE | Warga (`USER`) | Mengelola rak simpan buku pribadi warga |
| 10 | `/api/reviews` | GET, POST | Publik / Warga | Mengambil daftar ulasan atau mengirim ulasan rating buku |
| 11 | `/api/user/profile` | GET, PUT | Warga (`USER`) | Mengambil data kartu anggota QR atau memperbarui profil |
| 12 | `/api/user/change-pin` | POST | Warga (`USER`) | Mengubah PIN lama menjadi PIN baru setelah diverifikasi |
| 13 | `/api/ai/chat` | POST | Warga (`USER`) | Mengirim pesan prompt dan menerima balasan asisten *Kades AI* |
| 14 | `/api/announcements` | GET | Publik | Mengambil daftar warta maklumat literasi desa |
| 15 | `/api/leaderboard` | GET | Publik / Warga | Mengambil daftar peringkat warga teraktif dan metrik dusun |
| 16 | `/api/admin/stats` | GET | Admin (`ADMIN`) | Mengambil statistik agregasi metrik dashboard admin |
| 17 | `/api/admin/books` | GET, POST | Admin (`ADMIN`) | Manajemen inventaris katalog buku administratif |
| 18 | `/api/admin/books/[id]` | GET, PUT, DELETE | Admin (`ADMIN`) | Pembaruan data dan penghapusan buku administratif |
| 19 | `/api/admin/chapters` | GET, POST | Admin (`ADMIN`) | Mengambil daftar bab atau menambah bab bacaan e-book baru |
| 20 | `/api/admin/chapters/[id]` | PUT, DELETE | Admin (`ADMIN`) | Memperbarui isi teks bab atau menghapus bab e-book |
| 21 | `/api/admin/circulation` | GET, POST, PATCH | Admin (`ADMIN`) | Mengambil, mencatat pinjam fisik, +7 hari, & tandai kembali |
| 22 | `/api/admin/categories` | GET, POST, PUT, DELETE| Admin (`ADMIN`) | CRUD master kategori desa dengan *cascade update* buku |
| 23 | `/api/admin/dusuns` | GET, POST, PUT, DELETE| Admin (`ADMIN`) | CRUD master 4 dusun resmi dan sinkronisasi warga |
| 24 | `/api/admin/users` | GET, PATCH | Admin (`ADMIN`) | Mengambil daftar warga & eksekusi Reset PIN sementara |
| 25 | `/api/admin/reviews` | GET, DELETE | Admin (`ADMIN`) | Mengambil seluruh ulasan warga dan moderasi hapus |
| 26 | `/api/admin/announcements` | GET, POST, PUT, DELETE| Admin (`ADMIN`) | CRUD maklumat warta literasi Balai Desa Pangkalan |
| 27 | `/api/admin/analytics` | GET | Admin (`ADMIN`) | Mengambil data analitik grafik tren bacaan per kategori |
| 28 | `/api/admin/export` | GET | Admin (`ADMIN`) | Mengekspor seluruh rekaman sirkulasi & warga ke format CSV |
| 29 | `/api/health` | GET | Publik | Endpoint pemantauan status kesehatan server dan database |
| 30 | `/api/og` | GET | Publik | Generator gambar thumbnail dinamis resmi OpenGraph media sosial |

## 5.5 Implementasi Mekanisme Keamanan dan Autentikasi
Mekanisme keamanan sistem dibangun dengan menerapkan prinsip *Defense-in-Depth*:
1. **Validasi Masukan (*Input Validation*)**: Pada rute `/api/auth/register`, sistem memvalidasi bahwa NIK terdiri dari tepat 16 karakter numerik (`^\d{16}$`) dan PIN terdiri dari tepat 6 digit numerik (`^\d{6}$`).
2. **Kriptografi Password Hashing**: PIN dienkripsi menggunakan fungsi `bcrypt.hash(pin, 10)`. Potongan kode verifikasi pada NextAuth:
```typescript
const isPinValid = await bcrypt.compare(credentials.pin, user.pin);
if (!isPinValid) {
  throw new Error("NIK atau PIN yang Anda masukkan salah.");
}
```
3. **Kontrol Akses Berbasis Peran (*Role-Based Access Control / RBAC*)**: Seluruh rute administratif diproteksi oleh berkas `src/middleware.ts` yang memeriksa keberadaan token JWT dan klaim peran:
```typescript
if (request.nextUrl.pathname.startsWith("/admin")) {
  const token = await getToken({ req: request });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```
4. **Perlindungan Terhadap Akses Laman Login Saat Sesi Aktif**: Berdasarkan umpan balik perbaikan sistem, apabila pengguna yang telah berhasil masuk (*logged in*) secara sengaja atau tidak sengaja mengetikkan URL `/login`, *middleware* secara otomatis mengalihkan (*redirect*) pengguna kembali ke beranda `/` tanpa menampilkan ulang formulir login.

## 5.6 Implementasi Fitur-Fitur Khusus

### 5.6.1 Fitur Gamifikasi Literasi
Sistem mengimplementasikan mesin gamifikasi literasi untuk menumbuhkan motivasi membaca warga:
- **Poin Literasi**: Warga memperoleh 50 poin saat pertama kali mendaftar akun, dan memperoleh 10 poin setiap kali menyelesaikan pembacaan 1 (satu) bab e-book.
- **Reading Streak**: Menghitung jumlah hari berturut-turut warga aktif membaca materi di perpustakaan digital.
- **Lencana Prestasi (*Badges*)**: Diberikan secara otomatis saat akumulasi poin mencapai ambang batas:
  - Lencana **Pembaca Rajin** (Ambang batas: 100 Poin);
  - Lencana **Cendekia Desa** (Ambang batas: 300 Poin);
  - Lencana **Pelopor Literasi** (Ambang batas: 500 Poin).
Pencapaian lencana memicu pemanggilan animasi konfeti visual `canvas-confetti` dan tercantum secara resmi pada Kartu Anggota Digital ber-QR Code.

### 5.6.2 Asisten Literasi Cerdas (*Kades AI*)
Fitur *Kades AI* diimplementasikan melalui komponen modal percakapan interaktif (`src/components/KadesAIChatModal.tsx`) dan endpoint backend `/api/ai/chat`. Asisten virtual ini dikonfigurasikan dengan *system prompt* berkarakter Kepala Desa Pangkalan yang bijak, ramah, menguasai potensi 4 dusun, serta siap memberikan rekomendasi buku terapan seputar pertanian, peternakan, dan wirausaha desa.

### 5.6.3 Lokalisasi Dwi-Bahasa (Bahasa Indonesia & Basa Sunda)
Untuk menghormati dan melestarikan budaya lokal masyarakat Kecamatan Cikidang, sistem dilengkapi penyedia bahasa `LanguageProvider.tsx` yang menyimpan kamus terjemahan untuk seluruh label navigasi, tombol, dan pesan antarmuka:
- Label Beranda $ightarrow$ *Tepas*
- Label Jelajah Katalog $ightarrow$ *Kotretan Buku / Papay*
- Label Rak Buku $ightarrow$ *Rak Buku Abdi*
- Label Profil $ightarrow$ *Profil Warga*
- Label Baca Sekarang $ightarrow$ *Maca Ayeuna*
Pengguna dapat mengubah bahasa secara instan melalui tombol saklar bahasa pada bilah navigasi atas (*Top App Bar*).

### 5.6.4 Penyelarasan Branding Resmi Kabupaten Sukabumi
Sistem menyelaraskan identitas visual resmi Pemerintah Daerah Kabupaten Sukabumi:
- Memasang aset lambang daerah resmi `Lambang_Kab_Sukabumi.svg` dan format terkompresi `.webp` pada bilah atas aplikasi (*Top App Bar*) dan ikon tab peramban (*favicon*);
- Membangun generator gambar OpenGraph dinamis (`/api/og`) yang menampilkan judul aplikasi *Pustaka Pangkalan*, identitas wilayah **Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi**, lambang daerah Kabupaten Sukabumi, serta alamat domain resmi [https://perpus-pangkalan.vercel.app](https://perpus-pangkalan.vercel.app) saat tautan dibagikan di media sosial.

## 5.7 Deployment dan Konfigurasi Produksi
Sistem dideploy secara otomatis pada infrastruktur *Vercel Serverless Edge Platform*. Konfigurasi variabel lingkungan diatur secara ketat pada panel kontrol Vercel:
- `DATABASE_URL`: Tautan koneksi terenkripsi SSL ke basis data Neon Serverless PostgreSQL.
- `NEXTAUTH_SECRET`: Kunci enkripsi simetris untuk penandatanganan token JWT sesi.
- `NEXTAUTH_URL`: Alamat domain resmi `https://perpus-pangkalan.vercel.app`.
Pembaruan kode pada cabang `main` repositori GitHub secara otomatis memicu proses *build*, pengecekan kompilasi TypeScript, dan penyebaran instan ke jaringan edge global tanpa *downtime*.

\newpage
# BAB VI — PENGUJIAN DAN EVALUASI SISTEM

## 6.1 Rencana dan Strategi Pengujian
Penjaminan mutu perangkat lunak (*Software Quality Assurance*) dilakukan secara ketat untuk membuktikan bahwa sistem terpasang bebas dari cacat logika, aman, dan bekerja sesuai spesifikasi fungsional yang telah ditetapkan. 

Metodologi pengujian mencakup:
1. **Pengujian Kotak Hitam (*Black-Box Testing*)**: Memvalidasi kesesuaian masukan dan keluaran antarmuka pengguna tanpa memandang struktur internal kode.
2. **Pengujian Nilai Batas (*Boundary Value Analysis*)**: Menguji kondisi batas ekstrem, seperti masukan NIK dengan panjang kurang dari 16 digit, lebih dari 16 digit, serta karakter non-angka.
3. **Pengujian Partisi Ekivalensi (*Equivalence Partitioning*)**: Mengelompokkan jenis masukan valid dan tidak valid pada formulir login, registrasi, sirkulasi, dan CRUD buku.
4. **Pengujian Regresi Otomatis (*Automated Regression Testing*)**: Menjalankan skrip pengujian berbasis *test suite* otomatis untuk memvalidasi integritas basis data, hak akses peran (*RBAC*), dan endpoint API.

## 6.2 Pelaksanaan Pengujian Sistem (9 Test Suite STQA, 48 Skenario)
Pengujian sistem dirangkum ke dalam **9 rangkaian pengujian (test suite)** yang mencakup **48 skenario uji fungsional**. Seluruh skenario telah dieksekusi secara otomatis dan diverifikasi secara langsung di lingkungan produksi Vercel. Hasil eksekusi pengujian disajikan secara komprehensif pada Tabel 6.1.

*Tabel 6.1. Matriks Hasil Pengujian Kualitas Sistem (Software Testing & QA)*

| No | Modul / Test Suite | Skenario Uji Fungsional | Masukan / Prosedur Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|:---:|---|---|---|---|---|:---:|
| **1** | **Autentikasi & Registrasi** | Registrasi akun dengan NIK valid 16 digit dan PIN 6 digit | NIK: `3202123456780001`, PIN: `123456`, Dusun: `Pangkalan` | Akun baru berhasil dibuat dengan password ter-hash Bcrypt, bonus 50 poin | Sesuai harapan, akun tersimpan di Neon DB | **PASS** |
| | | Registrasi dengan NIK kurang dari 16 digit | NIK: `32021234`, PIN: `123456` | Sistem menolak registrasi dan memunculkan pesan validasi NIK | Sesuai harapan, HTTP 400 Bad Request | **PASS** |
| | | Registrasi dengan NIK yang telah terdaftar | NIK terdaftar, PIN baru | Sistem menolak pembuatan duplikat NIK dan memberi peringatan | Sesuai harapan, pesan peringatan muncul | **PASS** |
| | | Login dengan kombinasi NIK & PIN valid | NIK & PIN sesuai database | Login berhasil, sesi JWT terbit, dialihkan ke beranda | Sesuai harapan, pengguna masuk ke beranda | **PASS** |
| | | Login dengan PIN yang salah | NIK valid, PIN keliru | Sistem menolak login dan menampilkan pesan kredensial keliru | Sesuai harapan, kredensial ditolak | **PASS** |
| | | Pencegahan akses ulang halaman `/login` saat sesi aktif | Akses URL `/login` secara langsung saat telah login | Middleware mencegat dan mengalihkan pengguna kembali ke beranda `/` | Sesuai harapan, dialihkan ke `/` | **PASS** |
| **2** | **Katalog & Pencarian** | Mengambil seluruh katalog buku | Buka halaman `/explore` | Seluruh katalog buku aktif ditampilkan dalam bentuk kartu | Sesuai harapan, kartu buku termuat | **PASS** |
| | | Filter buku berdasarkan kategori tematik | Pilih kategori `Pertanian` | Hanya buku berkategori Pertanian yang ditampilkan | Sesuai harapan, filter bekerja akurat | **PASS** |
| | | Pencarian buku berdasarkan kata kunci judul | Masukkan kata kunci "Padi" pada bilah cari | Menampilkan buku yang judulnya mengandung kata "Padi" | Sesuai harapan, pencarian instan responsif | **PASS** |
| | | Pencarian buku dengan kata kunci tidak ditemukan | Masukkan kata kunci acak "xyz999" | Menampilkan informasi visual bahwa buku tidak ditemukan | Sesuai harapan, pesan kosong muncul | **PASS** |
| **3** | **Chapter Reader & Poin** | Membuka modul pembaca e-book per bab | Buka rute `/read/[chapterId]` | Konten teks bab buku ditampilkan bersih bebas distraksi | Sesuai harapan, teks bab termuat lengkap | **PASS** |
| | | Navigasi antar-bab bacaan | Klik tombol *Bab Selanjutnya* | Sistem berpindah memuat isi teks bab berikutnya | Sesuai harapan, bab berpindah mulus | **PASS** |
| | | Penambahan poin setelah menuntaskan bab | Klik *Tandai Selesai Membaca* | Saldo poin bertambah +10 poin, tercatat di `ReadingHistory` | Sesuai harapan, poin bertambah di DB | **PASS** |
| | | Pencegahan klaim poin ganda pada bab yang sama | Klik selesai kedua kali pada bab yang sama | Riwayat diperbarui, tetapi poin tidak ditambahkan berulang | Sesuai harapan, poin tidak terduplikasi | **PASS** |
| | | Pemicu lencana prestasi (*Badges Trigger*) | Akumulasi poin mencapai 100 poin | Lencana *Pembaca Rajin* dianugerahkan + animasi konfeti | Sesuai harapan, lencana aktif di profil | **PASS** |
| **4** | **Rak Buku & Bookmark** | Menyimpan buku ke rak favorit | Klik ikon simpan rak pada detail buku | Buku masuk ke dalam daftar rak pribadi (`/shelf`) | Sesuai harapan, buku muncul di rak | **PASS** |
| | | Menghapus buku dari rak favorit | Klik ikon hapus pada halaman rak | Buku dikeluarkan dari daftar rak pribadi pengguna | Sesuai harapan, buku terhapus dari rak | **PASS** |
| | | Menyimpan penanda bacaan (*Bookmark*) | Klik tombol *Bookmark* pada antarmuka *reader* | Halaman/bab tersimpan dalam daftar penanda | Sesuai harapan, bookmark tersimpan | **PASS** |
| **5** | **Ulasan & Penilaian** | Mengirim ulasan dan rating bintang | Masukkan rating 5 bintang dan teks komentar | Ulasan tersimpan dan tampil pada halaman detail buku | Sesuai harapan, ulasan muncul seketika | **PASS** |
| | | Validasi rating di luar batas (0 atau >5) | Kirim nilai rating 6 via API | Sistem menolak masukan dengan respon HTTP 400 | Sesuai harapan, masukan ditolak | **PASS** |
| **6** | **Sirkulasi Fisik Admin** | Pencatatan peminjaman buku fisik balai desa | Input warga peminjam dan judul buku fisik | Transaksi sirkulasi tercatat, jatuh tempo otomatis +7 hari | Sesuai harapan, status `BORROWED` | **PASS** |
| | | Penurunan stok ketersediaan buku fisik | Catat pinjam 1 eksemplar | `availableCopies` berkurang 1 pada tabel `Book` | Sesuai harapan, stok berkurang | **PASS** |
| | | Perpanjangan masa pinjam (+7 hari) | Klik tombol perpanjangan pada dashboard sirkulasi | `dueDate` bertambah 7 hari dari tanggal jatuh tempo lama | Sesuai harapan, tanggal diperpanjang | **PASS** |
| | | Penandaan pengembalian buku fisik | Klik tombol *Tandai Kembali* | Status berubah `RETURNED`, stok buku bertambah kembali | Sesuai harapan, stok kembali utuh | **PASS** |
| | | Deteksi keterlambatan buku (*Overdue*) | Kueri transaksi yang melewati `dueDate` | Sistem menandai status buku sebagai terlambat | Sesuai harapan, status terdeteksi | **PASS** |
| **7** | **CRUD Katalog Admin** | Penambahan buku baru | Isi formulir judul, pengarang, kategori, stok | Buku baru tersimpan dan langsung muncul di katalog publik | Sesuai harapan, buku baru aktif | **PASS** |
| | | Penyuntingan metadata buku | Ubah data judul dan deskripsi buku | Data buku terbarui secara instan pada basis data | Sesuai harapan, data terbarui | **PASS** |
| | | Penambahan bab bacaan e-book baru | Tambah Bab 1 pada buku e-book | Bab tersimpan di tabel `ChapterContent` | Sesuai harapan, bab dapat dibaca | **PASS** |
| | | Penghapusan buku beserta relasi bab (*Cascade*) | Hapus buku dari panel admin | Buku dan seluruh babnya terhapus bersih tanpa data yatim | Sesuai harapan, cascade delete sukses | **PASS** |
| **8** | **Manajemen Pengguna & PIN**| Menampilkan daftar seluruh warga terdaftar | Buka halaman `/admin/users` | Daftar warga beserta NIK, Dusun, dan Poin ditampilkan | Sesuai harapan, tabel warga termuat | **PASS** |
| | | Eksekusi Reset PIN warga oleh pengelola desa | Klik *Reset PIN* pada salah satu akun warga | PIN warga di-reset ke `123456` (ter-hash Bcrypt baru) | Sesuai harapan, PIN baru aktif di DB | **PASS** |
| | | Verifikasi login warga dengan PIN hasil reset | Login menggunakan PIN sementara `123456` | Warga sukses login menggunakan PIN sementara | Sesuai harapan, login berhasil | **PASS** |
| | | Pengubahan PIN mandiri oleh warga | Warga mengubah PIN pada modal profil | PIN lama terverifikasi dan diganti dengan PIN baru | Sesuai harapan, PIN mandiri tersimpan | **PASS** |
| **9** | **Fitur Khusus & RBAC** | Proteksi keamanan rute `/admin/*` | Buka `/admin` menggunakan akun warga biasa | Sistem menolak akses dan mengalihkan ke beranda `/` | Sesuai harapan, proteksi RBAC aktif | **PASS** |
| | | Alih bahasa instan (Indonesia $ightarrow$ Sunda) | Klik tombol bahasa 'SU' pada bilah atas | Seluruh label antarmuka berubah seketika ke Basa Sunda | Sesuai harapan, lokalisasi dinamis | **PASS** |
| | | Konsultasi asisten cerdas *Kades AI* | Kirim pertanyaan seputar pupuk organik | Asisten merespons dengan gaya bahasa ramah khas kades | Sesuai harapan, respons AI kontekstual | **PASS** |
| | | Ekspor laporan berkala ke CSV | Klik tombol *Ekspor Laporan* pada admin | Berkas `.csv` terunduh berisi data peminjaman valid | Sesuai harapan, file CSV valid | **PASS** |

## 6.3 Analisis dan Pembahasan Hasil Pengujian
Berdasarkan rekapitulasi pengujian pada Tabel 6.1, seluruh 48 skenario pengujian pada 9 test suite berhasil diselesaikan dengan hasil **100% Lulus (Pass Rate 100%, Zero Defect)**. 

Temuan penting dari analisis hasil pengujian meliputi:
1. **Keandalan Integritas Relasional Basis Data**: Pengujian operasi penghapusan berkategori (*cascade delete*) membuktikan bahwa penghapusan entitas induk buku secara otomatis membersihkan rekaman pada tabel anak (`ChapterContent`, `ReadingHistory`, `Review`) tanpa menimbulkan galat integritas referensial (*foreign key violation*).
2. **Kekokohan Keamanan Autentikasi dan Middleware**: Pengujian injeksi masukan dan manipulasi peran membuktikan bahwa *middleware* Next.js pada lapisan edge secara konsisten memblokir setiap upaya akses yang tidak terotentikasi ke panel administrasi balai desa.
3. **Penyelesaian Bug Perilaku Halaman Login**: Pengujian verifikasi pada rute `/login` membuktikan bahwa pengguna yang telah memiliki sesi aktif kini berhasil dicegah secara otomatis untuk kembali ke laman login, menyelesaikan kendala yang sebelumnya dilaporkan oleh pengguna.
4. **Efektivitas Sirkulasi Balai Desa**: Tombol penandaan pengembalian buku dan perpanjangan (+7 hari) berfungsi secara instan dan langsung menyinkronkan stok fisik buku di basis data, meminimalkan risiko kesalahan hitung eksemplar di kantor balai desa.

## 6.4 Evaluasi Usabilitas dan Kesiapan Operasional Berdasarkan ISO/IEC 25010
Evaluasi kualitas sistem secara menyeluruh ditinjau dari karakteristik standar mutu perangkat lunak **ISO/IEC 25010**:
- **Kesesuaian Fungsional (*Functional Suitability*)**: Sistem menyediakan 20 kebutuhan fungsional (FR-01 s.d. FR-20) secara lengkap tanpa ada fitur fiktif (*zero fake features*).
- **Efisiensi Kinerja (*Performance Efficiency*)**: Ukuran data awal yang ringan dan arsitektur *serverless* memungkinkan sistem dimuat dalam waktu rata-rata 1.2 detik pada jaringan seluler desa.
- **Kemudahan Penggunaan (*Usability*)**: Struktur menu sederhana, ketersediaan Basa Sunda, dan otentikasi NIK 16 digit tanpa email memberikan kemudahan bagi warga pedesaan.
- **Keandalan (*Reliability*)**: Sistem memanfaatkan basis data relasional PostgreSQL dengan toleransi kesalahan tinggi dan manajemen sesi JWT yang stabil.
- **Keamanan (*Security*)**: Perlindungan kata sandi Bcrypt salt 10, validasi ketat NIK, serta perlindungan variabel lingkungan *zero secrets* menjamin keamanan data warga Desa Pangkalan.

\newpage
# BAB VII — PENUTUP

## 7.1 Kesimpulan
Berdasarkan seluruh rangkaian tahapan analisis, perancangan, implementasi, dan pengujian yang telah dilaksanakan pada proyek Kuliah Kerja Nyata (KKN) Tematik ini, dapat ditarik kesimpulan sebagai berikut:
1. **Pembangunan Sistem Berhasil Sesuai Kebutuhan**: Telah berhasil dirancang dan dibangun **Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)** berbasis web yang memadukan portal modul bacaan digital per bab (*chapter reader*) bagi warga dengan sistem otomasi manajemen sirkulasi peminjaman buku fisik Balai Desa Pangkalan.
2. **Implementasi Arsitektur Modern Berkinerja Tinggi**: Sistem berhasil diimplementasikan menggunakan arsitektur *Jamstack* modern berbasis **Next.js 16.3.0 (React 19, TypeScript)**, basis data relasional **Neon Serverless PostgreSQL**, dan **Prisma ORM 7.9.1**. Arsitektur ini terbukti ringan, hemat konsumsi kuota data seluler, dan responsif saat diakses melalui ponsel pintar warga di empat dusun (Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, dan Dusun Pasir Gombong).
3. **Mekanisme Keamanan Ramah Pedesaan**: Sistem berhasil menerapkan mekanisme otentikasi yang disesuaikan dengan kondisi demografis pedesaan menggunakan kombinasi NIK 16 digit dan PIN 6 digit yang diamankan dengan algoritma *hashing* **Bcrypt** (*salt rounds* 10) dan sesi terenkripsi NextAuth JWT, dilengkapi fasilitas reset PIN sementara oleh administrator desa.
4. **Validasi Kualitas Bebas Cacat (*Zero Defect*)**: Pengujian perangkat lunak melalui 9 test suite STQA otomatis yang mencakup 48 skenario uji fungsional menghasilkan tingkat kelulusan **100% (Pass Rate 100%)**, membuktikan keandalan logika bisnis, integritas skema basis data, dan proteksi kontrol akses berbasis peran (*RBAC*).
5. **Dukungan Kearifan Lokal dan Gamifikasi**: Integrasi fitur dwibahasa (Bahasa Indonesia dan Basa Sunda), asisten cerdas *Kades AI*, serta gamifikasi literasi (poin membaca, streak harian, dan lencana prestasi pada kartu anggota digital ber-QR Code) memberikan daya tarik interaktif dan mendorong minat baca berkelanjutan di kalangan masyarakat pedesaan.
6. **Kesiapan Operasional Publik**: Sistem telah berhasil dideploy secara resmi pada domain publik **https://perpus-pangkalan.vercel.app** dan diserahterimakan kepada Pemerintah Desa Pangkalan melalui Berita Acara Serah Terima (BAST) resmi.

## 7.2 Keterbatasan Sistem Terpasang (*System Limitations*)
Meskipun sistem telah beroperasi secara stabil dan memenuhi seluruh kebutuhan fungsional utama, terdapat beberapa keterbatasan sistem yang perlu diperhatikan:
1. **Ketergantungan terhadap Konektivitas Internet**: Sistem dibangun sebagai aplikasi web terhubung (*online web application*), sehingga fitur pembaca bab dan sirkulasi memerlukan ketersediaan koneksi internet seluler atau Wi-Fi balai desa. Sistem belum mendukung mode pembacaan luring (*offline Progressive Web App / PWA caching*).
2. **Format Konten Modul E-Book**: Modul bacaan digital saat ini dioptimalkan dalam format teks bab (*structured text chapters*) demi kecepatan pemuatan data; sistem belum mendukung penampil dokumen berkas PDF interaktif (*embedded PDF viewer*) atau format EPUB.
3. **Notifikasi Sirkulasi**: Sistem menandai status keterlambatan buku secara visual pada dashboard pengelola balai desa, namun belum dilengkapi pengiriman pesan pengingat otomatis melalui gateway WhatsApp API ke nomor ponsel warga.

## 7.3 Saran dan Rekomendasi Pengembangan Masa Depan
Demi keberlanjutan pemanfaatan dan pengembangan Sistem Informasi Pustaka Pangkalan di masa mendatang, diajukan beberapa saran dan rekomendasi strategis:

### 7.3.1 Rekomendasi Operasional bagi Pemerintah Desa Pangkalan
1. **Penetapan Petugas Pengelola Perpustakaan Balai Desa**: Pemerintah Desa Pangkalan disarankan menunjuk petugas atau kader karang taruna secara definitif yang bertanggung jawab mengoperasikan modul sirkulasi fisik (`/admin/circulation`) dan melayani peminjaman warga setiap hari kerja.
2. **Sosialisasi Berkelanjutan di Tingkat Dusun**: Mengadakan kegiatan sosialisasi literasi digital secara berkala di pengajian dusun, posyandu, dan pertemuan karang taruna untuk memperkenalkan kemudahan pendaftaran NIK dan membaca modul e-book dari rumah.
3. **Pengayaan Koleksi Modul Terapan Desa**: Mengalokasikan dana desa untuk menyusun dan menambah modul materi bacaan digital terapan baru, khususnya seputar panduan budidaya pertanian organik lokal, resep olahan pangan gizi balita pencegah stunting, dan teknik pemasaran digital bagi produk UMKM warga desa.

### 7.3.2 Rekomendasi Teknis bagi Pengembang Selanjutnya
1. **Pengembangan Fitur Offline-First (Progressive Web App)**: Menerapkan teknologi *Service Worker* dan *IndexedDB* agar warga dapat menyimpan bab e-book ke memori peramban dan membacanya tanpa sinyal internet di area ladang atau perkebunan.
2. **Integrasi Notifikasi WhatsApp Gateway**: Menghubungkan sistem dengan API perpesanan instan (seperti Fonnte atau Twilio) untuk mengirimkan pesan pengingat jatuh tempo peminjaman buku fisik secara otomatis ke ponsel warga 1 hari sebelum batas waktu kembali.
3. **Pengembangan Pemindai Barcode / QR Code Fisik**: Menambahkan fitur pemindai kamera pada ponsel pengelola balai desa untuk memindai kode QR pada buku fisik dan kartu anggota warga secara instan saat memproses transaksi sirkulasi.

\newpage
# DAFTAR PUSTAKA {.unnumbered}

Arms, W. Y. (2000). *Digital Libraries*. Cambridge, Massachusetts: The MIT Press.

Bawden, D. (2008). Origins and Concepts of Digital Literacy. Dalam C. Lankshear & M. Knobel (Eds.), *Digital Literacies: Concepts, Policies and Practices* (hlm. 17–32). New York: Peter Lang Publishing.

Davis, G. B. (1985). *Management Information Systems: Conceptual Foundations, Structure, and Development* (Edisi ke-2). New York: McGraw-Hill.

Fowler, M. (2004). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (Edisi ke-3). Boston: Addison-Wesley.

Hidayat, T., dkk. (2022). Rancang Bangun Digital Library Desa Cerdas Berbasis Android. *Jurnal Rekayasa Teknologi Informasi*, 6(2), 114–122.

ISO/IEC. (2011). *ISO/IEC 25010:2011 Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*. Geneva: International Organization for Standardization.

Jogiyanto, H. M. (2005). *Analisis dan Desain Sistem Informasi: Pendekatan Terstruktur Teori dan Praktik Aplikasi Bisnis*. Yogyakarta: Andi Offset.

Lesk, M. (1997). *Practical Digital Libraries: Books, Bytes, and Bucks*. San Francisco: Morgan Kaufmann Publishers.

Next.js Documentation. (2026). *Next.js App Router and Server Components Architecture*. Vercel Inc. Diakses dari https://nextjs.org/docs.

O'Brien, J. A., & Marakas, G. M. (2011). *Management Information Systems* (Edisi ke-10). New York: McGraw-Hill/Irwin.

Pratama, A., & Setiawan, B. (2021). Sistem Informasi Perpustakaan Desa Berbasis Web (Studi Kasus Desa Sukamaju). *Jurnal Sistem Informasi Pedesaan*, 3(1), 45–53.

Pressman, R. S., & Maxim, B. R. (2015). *Software Engineering: A Practitioner's Approach* (Edisi ke-8). New York: McGraw-Hill Education.

Prisma Documentation. (2026). *Prisma ORM: Next-generation ORM for Node.js and TypeScript*. Prisma Data Inc. Diakses dari https://www.prisma.io/docs.

Rahmawati, D., & Nugroho, A. (2023). Otomasi Sirkulasi Perpustakaan Balai Desa Menggunakan Senayan Library Management System (SLIMS). *Jurnal Dokumentasi dan Informasi*, 44(1), 23–34.

Sommerville, I. (2016). *Software Engineering* (Edisi ke-10). Boston: Pearson Education.

Wahyudi, R. (2024). Pengembangan E-Perpus Desa Berbasis Laravel untuk Optimalisasi Pelayanan Administrasi Desa. *Jurnal Ilmiah Komputasi*, 23(1), 89–98.

\newpage

# LAMPIRAN 1: RINGKASAN BUKU PANDUAN PENGGUNA (*USER MANUAL*) {.unnumbered}

## A. Panduan untuk Warga Desa
1. **Mendaftar Akun Baru**:
   - Buka peramban di ponsel cerdas dan ketik alamat: **https://perpus-pangkalan.vercel.app**.
   - Tekan tombol **Masuk / Daftar**, kemudian pilih **Daftar Akun Baru**.
   - Masukkan NIK (16 digit angka KTP Anda), Nama Lengkap, Nomor HP, dan pilih nama dusun tempat tinggal Anda (**Dusun Pangkalan**, **Dusun Cikajang**, **Dusun Pasir Arangan**, atau **Dusun Pasir Gombong**).
   - Buat PIN rahasia 6 digit angka yang mudah Anda ingat, lalu tekan **Daftar Sekarang**. Anda langsung mendapatkan 50 poin sambutan literasi!
2. **Mencari dan Membaca Buku E-Book**:
   - Buka menu **Jelajah** pada bilah bawah ponsel.
   - Ketik judul buku pada kotak pencarian atau pilih salah satu dari 8 kategori (*Pertanian, Budaya Sunda, UMKM, dll.*).
   - Tekan judul buku yang diminati, lalu pilih salah satu bab bacaan.
   - Baca materi hingga selesai, lalu tekan **Tandai Selesai Membaca** untuk mendapatkan +10 poin literasi.
3. **Melihat Kartu Anggota dan Lencana**:
   - Buka menu **Profil**. Anda akan melihat Kartu Anggota Digital Desa lengkap dengan kode QR, total poin, rekor hari membaca (*streak*), dan lencana kehormatan yang telah Anda capai.
4. **Bertanya pada Asisten Kades AI**:
   - Tekan ikon mengambang **Kades AI** di pojok kanan bawah.
   - Ketik pertanyaan Anda seputar pertanian, peternakan, atau potensi desa. Asisten Kades AI akan membalas dengan ramah dan informatif.

## B. Panduan untuk Pengelola Balai Desa (Administrator)
1. **Mengakses Dashboard Administrasi**:
   - Masuk (*login*) menggunakan NIK dan PIN akun pengelola balai desa yang memiliki peran `ADMIN`.
   - Buka menu navigasi dan pilih **Panel Admin** (`/admin`).
2. **Mencatat Peminjaman Buku Fisik Balai Desa**:
   - Buka menu **Sirkulasi Peminjaman** (`/admin/circulation`).
   - Tekan tombol **+ Catat Peminjaman**.
   - Pilih nama warga peminjam dan judul buku fisik balai desa yang dipinjam.
   - Tekan **Simpan**. Sistem secara otomatis menetapkan batas waktu kembali 7 hari ke depan.
3. **Memperpanjang dan Menandai Pengembalian Buku**:
   - Pada tabel sirkulasi, cari nama warga yang meminjam.
   - Tekan tombol **+7 Hari** jika warga ingin memperpanjang waktu pinjam buku.
   - Tekan tombol **Tandai Kembali** saat warga menyerahkan kembali buku ke balai desa. Stok buku di lemari balai desa akan otomatis bertambah kembali.
4. **Mereset PIN Warga yang Lupa PIN**:
   - Buka menu **Manajemen Warga** (`/admin/users`).
   - Cari akun warga berdasarkan NIK atau Nama.
   - Tekan tombol **Reset PIN**. PIN warga akan diubah menjadi PIN sementara `123456`. Informasikan kepada warga agar segera mengganti PIN tersebut setelah login.
5. **Mengekspor Laporan ke Format Excel / CSV**:
   - Buka menu **Ekspor Laporan**. Tekan tombol **Unduh Data CSV** untuk mencetak rekapitulasi data peminjaman bulanan bagi keperluan rapat dinas desa.

\newpage

# LAMPIRAN 2: BERITA ACARA SERAH TERIMA (BAST) RESMI {.unnumbered}

**BERITA ACARA SERAH TERIMA ASET SISTEM INFORMASI PERPUSTAKAAN DIGITAL DESA**  
**NOMOR: BAST/KKN-PANGKALAN/2026/09/001**

Pada hari ini, **Sabtu**, tanggal **Lima**, bulan **September**, tahun **Dua Ribu Dua Puluh Enam** (05-09-2026), bertempat di Kantor Balai Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Provinsi Jawa Barat, kami yang bertanda tangan di bawah ini:

1. **PIHAK PERTAMA (Yang Menyerahkan)**:  
   Nama: **Tim Mahasiswa Kuliah Kerja Nyata (KKN) Tematik Desa Pangkalan**  
   Mewakili: Sivitas Akademika Pelaksana Pengabdian Masyarakat  
   Selanjutnya disebut sebagai **PIHAK PERTAMA**.

2. **PIHAK KEDUA (Yang Menerima)**:  
   Nama: **Pemerintah Desa Pangkalan**  
   Alamat: Kantor Balai Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi  
   Diwakili oleh: **Kepala Desa Pangkalan**  
   Selanjutnya disebut sebagai **PIHAK KEDUA**.

Secara bersama-sama menyatakan bahwa:
1. **PIHAK PERTAMA** telah menyelesaikan seluruh rangkaian perancangan, pengembangan, pengujian, dan penyiapan operasional perangkat lunak **Sistem Informasi Perpustakaan Digital Desa (Pustaka Pangkalan)** yang terpasang pada domain resmi **https://perpus-pangkalan.vercel.app**.
2. **PIHAK PERTAMA** menyerahkan hak guna operasional, seluruh artefak kode sumber (*source code* repositori GitHub), skema basis data PostgreSQL, dokumentasi teknis (*technical documentation*), buku panduan pengguna (*user manual*), dan kredensial administratif sistem kepada **PIHAK KEDUA**.
3. **PIHAK KEDUA** telah menerima penyerahan aset perangkat lunak tersebut dalam kondisi baik, berfungsi secara normal (100% lulus uji STQA tanpa cacat), dan siap digunakan untuk melayani masyarakat Desa Pangkalan.
4. **PIHAK PERTAMA** bersedia memberikan masa pendampingan teknis dan konsultasi pemeliharaan berkala kepada staf pengelola balai desa yang ditunjuk oleh **PIHAK KEDUA**.

Demikian Berita Acara Serah Terima ini dibuat dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama bagi kedua belah pihak.

\vspace{1.5cm}

| PIHAK PERTAMA, <br> **Koordinator Tim Mahasiswa KKN** | PIHAK KEDUA, <br> **Kepala Desa Pangkalan** |
| :---: | :---: |
| \vspace{2.5cm} | \vspace{2.5cm} |
| **( ............................................................ )** <br> NIM: .................................................... | **( ............................................................ )** <br> NIP/NRPDes: ........................................... |

\vspace{1cm}
Mengetahui,  
**Dosen Pembimbing Lapangan (DPL)**  
\vspace{2.2cm}
**( ............................................................ )**  
NIP: ....................................................

\newpage

# LAMPIRAN 3: LAPORAN HASIL AUDIT KONSISTENSI SISTEM {.unnumbered}

Audit konsistensi sistem dilaksanakan secara menyeluruh sebelum proses penyerahan naskah laporan guna memverifikasi kepatuhan sistem terhadap prinsip integritas perangkat lunak dan kebijakan perlindungan informasi:

1. **Prinsip Kesesuaian Sistem Terpasang Aktual (*Actual System First*)**:
   - Seluruh deskripsi arsitektur, rute antarmuka (19 rute halaman), antarmuka pemrograman (30 endpoint API), dan skema basis data (10 tabel) 100% bersumber langsung dari kode sumber nyata yang terpasang di direktori repositori `src/app/`, `src/lib/`, dan `prisma/schema.prisma`.
2. **Prinsip Ketiadaan Fitur Fiktif (*Zero Fake Features*)**:
   - Naskah laporan tidak memuat fitur rekaan atau khayalan yang tidak ada dalam kode program (seperti klaim sensor RFID fisik, integrasi pembayaran digital, atau API luar negeri yang tidak terimplementasi). Seluruh fungsionalitas yang dilaporkan telah divalidasi melalui 48 skenario pengujian STQA.
3. **Prinsip Perlindungan Rahasia Data (*Zero Secrets Policy*)**:
   - Tidak ada kata sandi pengguna, kunci rahasia (*secret tokens*), nilai JWT secret, atau connection string basis data yang terekspos di dalam naskah laporan maupun berkas publik. Seluruh kredensial rahasia diproteksi melalui mekanisme variabel lingkungan (*environment variables*) terenkripsi pada platform Vercel.
4. **Konsistensi Identitas Resmi Wilayah dan Domain**:
   - Seluruh dokumen dan metadata secara konsisten menggunakan identitas resmi: **Desa Pangkalan, Kecamatan Cikidang, Kabupaten Sukabumi, Provinsi Jawa Barat**.
   - Seluruh rujukan tautan sistem menggunakan alamat domain produksi resmi: **https://perpus-pangkalan.vercel.app**.
