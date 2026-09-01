import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const q = message.toLowerCase();

    // Contextual village knowledge database matching (Desa Pangkalan, Kec. Cikidang, Kab. Sukabumi)
    let reply = "";

    if (q.includes("kades") || q.includes("kepala desa") || q.includes("usep") || q.includes("pemimpin")) {
      reply = "🏛️ **Kepala Desa Pangkalan:**\n\nKepala Desa Pangkalan saat ini adalah **Bapak Usep Saepulrohman**. Beliau memimpin pemerintahan desa dengan fokus pada transformasi digital, kemandirian ekonomi masyarakat, ketahanan pangan, dan peningkatan budaya literasi warga desa.\n\n*Sumber Resmi: [desapangkalan.web.id](https://desapangkalan.web.id/)*";
    } else if (q.includes("dusun") || q.includes("wilayah") || q.includes("rt") || q.includes("rw") || q.includes("luas")) {
      reply = "🗺️ **Wilayah Administratif Desa Pangkalan:**\n\nDesa Pangkalan terletak di **Kecamatan Cikidang, Kabupaten Sukabumi, Jawa Barat** dengan luas wilayah sekitar 1.258 hektar yang terbagi menjadi **4 Dusun Resmi**:\n1. **Dusun Pangkalan**\n2. **Dusun Cikajang**\n3. **Dusun Pasir Arangan**\n4. **Dusun Pasir Gombong**\n\nDesa ini berpenduduk sekitar 10.000 jiwa dengan lebih dari 3.000 Kepala Keluarga.";
    } else if (q.includes("potensi") || q.includes("itik") || q.includes("bawal") || q.includes("ternak")) {
      reply = "🌾 **Potensi & Ketahanan Pangan Desa Pangkalan:**\n\n1. **Peternakan & Perikanan:** Program BUMDes mengembangkan budidaya itik petelur, ikan nila, dan ikan bawal sistem kolam air tawar.\n2. **Perkebunan:** Sebagian besar wilayah bekerja sama dengan perkebunan PTPN VIII dan pertanian padi sawah warga.\n3. **Agrowisata:** Wisata alam dan kawasan petualangan berburu ramah lingkungan di Cikidang.";
    } else if (q.includes("wereng") || q.includes("hama") || q.includes("padi") || q.includes("pupuk")) {
      reply = "🌾 **Pengendalian Wereng & Hama Padi (Buku Panduan Pertanian Modern):**\n\n1. **Pencegahan Hayati:** Semprotkan larutan daun tembakau dan brotowali (pestisida nabati) tiap 5 hari sekali pada pangkal batang padi.\n2. **Musuh Alami:** Jaga populasi laba-laba predator dan kumbang kubah di sawah.\n3. **Pengairan Berselang:** Terapkan sistem *intermittent irrigation* agar kelembapan tanah tidak memicu ledakan wereng coklat.\n\n*Rujukan: Modul Belajar Bertani Modern Bab 2.*";
    } else if (q.includes("bioflok") || q.includes("ikan") || q.includes("lele") || q.includes("nila")) {
      reply = "🐟 **Panduan Budidaya Bioflok Desa Pangkalan:**\n\n1. **Aerasi & Probiotik:** Berikan aerasi kontinu 24 jam dan tambahkan probiotik *Bacillus sp.* bersama molase/tetes tebu (C/N ratio > 10).\n2. **Kepadatan Tebar:** Nila/lele dapat ditebar hingga 80-100 ekor/m³.\n3. **Kualitas Air:** Pastikan volume flok pada kerucut Imhoff berkisar 20-30 mL/L sebelum penebaran pakan harian.\n\n*Rujukan: Budidaya Ikan Nila Sistem Bioflok Desa Bab 1 & 2.*";
    } else if (q.includes("sunda") || q.includes("aksara") || q.includes("basa") || q.includes("dahar")) {
      reply = "📚 **Tata Krama & Aksara Sunda:**\n\n- **Tingkatan Basa:** Kata *dahar* (makan) digunakan untuk sesama (loma). Untuk menghormati orang tua/sesepuh, gunakan kata **tuang**, dan untuk diri sendiri gunakan **neda**.\n- **Aksara Swara:** Memiliki 7 huruf vokal mandiri: *a, i, u, e, o, eu, é*.\n\n*Rujukan: Tata Krama & Aksara Sunda Modern karya Drs. H. Cecep Gunawan.*";
    } else if (q.includes("bumdes") || q.includes("modal") || q.includes("umkm") || q.includes("kas")) {
      reply = "💼 **Manajemen Keuangan BUMDes & UMKM Desa Pangkalan:**\n\n1. **Pemisahan Kas:** Pisahkan secara ketat dompet pribadi keluarga dengan rekening perputaran modal usaha.\n2. **Pencatatan Harian:** Catat arus kas masuk (*cash inflow*) dan kas keluar (*cash outflow*) setiap sore setelah penutupan toko.\n3. **Pengembangan Produk:** Pasarkan olahan keripik singkong, gula aren, dan hasil kebun khas Cikidang ke pasar digital.\n\n*Rujukan: Manajemen Keuangan BUMDes Bab 3.*";
    } else if (q.includes("sejarah") || q.includes("pangkalan") || q.includes("asal") || q.includes("megalitik")) {
      reply = "🏛️ **Sejarah & Warisan Budaya Desa Pangkalan:**\n\nDesa Pangkalan (Kec. Cikidang, Kab. Sukabumi) memiliki peninggalan bersejarah situs megalitikum (batu menhir dan dolmen) di kawasan perkebunan Tenjojaya. Nama *Pangkalan* bermakna tempat persinggahan dan pangkalan perniagaan serta pertanian yang mengedepankan asas gotong royong sabilulungan.\n\n*Rujukan: Sejarah Desa Pangkalan & Arsip Pemdes Pangkalan.*";
    } else {
      reply = `Sampurasun Warga Desa Pangkalan! 😊 Saya adalah **Tanya Pustaka AI** (Asisten Digital Pak Kades Usep Saepulrohman).

Saya siap membantu Anda menjawab seputar:
1. **Pertanian & Bioflok:** Dosis pupuk, pencegahan hama wereng, dan pakan nila/lele.
2. **Kewirausahaan BUMDes:** Pembukuan kas UMKM dan peluang usaha desa.
3. **Budaya & Bahasa Sunda:** Aksara Kaganga Sunda dan tata krama basa.
4. **Informasi Desa:** 4 Dusun (Pangkalan, Cikajang, Pasir Arangan, Pasir Gombong) & website resmi [desapangkalan.web.id](https://desapangkalan.web.id/).

Silakan ketik atau gunakan mikrofon untuk bertanya!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan AI" }, { status: 500 });
  }
}
