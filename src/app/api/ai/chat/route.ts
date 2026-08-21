import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const q = message.toLowerCase();

    // Contextual village knowledge database matching
    let reply = "";

    if (q.includes("wereng") || q.includes("hama") || q.includes("padi")) {
      reply = "🌾 **Pengendalian Wereng & Hama Padi (Buku Panduan Pertanian Modern):**\n\n1. **Pencegahan Hayati:** Semprotkan larutan daun tembakau dan brotowali (pestisida nabati) tiap 5 hari sekali pada pangkal batang padi.\n2. **Musuh Alami:** Jaga populasi laba-laba predator dan kumbang kubah di sawah.\n3. **Pengaturan Air:** Terapkan sistem *intermittent irrigation* (pengairan berselang) agar kelembapan tanah tidak memicu ledakan wereng coklat.\n\n*Rujukan: Modul Belajar Bertani Modern Bab 2.*";
    } else if (q.includes("bioflok") || q.includes("ikan") || q.includes("lele") || q.includes("nila")) {
      reply = "🐟 **Panduan Budidaya Bioflok Desa Pangkalan:**\n\n1. **Aerasi & Probiotik:** Berikan aerasi kontinu 24 jam dan tambahkan probiotik *Bacillus sp.* bersama molase/tetes tebu (C/N ratio > 10).\n2. **Kepadatan Tebar:** Nila/lele dapat ditebar hingga 80-100 ekor/m³.\n3. **Kualitas Air:** Pastikan volume flok pada kerucut Imhoff berkisar 20-30 mL/L sebelum penebaran pakan harian.\n\n*Rujukan: Budidaya Ikan Nila Sistem Bioflok Desa Bab 1 & 2.*";
    } else if (q.includes("sunda") || q.includes("aksara") || q.includes("basa") || q.includes("dahar")) {
      reply = "📚 **Tata Krama & Aksara Sunda:**\n\n- **Tingkatan Basa:** Kata *dahar* (makan) digunakan untuk sesama (loma). Untuk menghormati orang tua/sesepuh, gunakan kata **tuang**, dan untuk diri sendiri gunakan **neda**.\n- **Aksara Swara:** Memiliki 7 huruf vokal mandiri: *a, i, u, e, o, eu, é*.\n\n*Rujukan: Tata Krama & Aksara Sunda Modern karya Drs. H. Cecep Gunawan.*";
    } else if (q.includes("bumdes") || q.includes("modal") || q.includes("umkm") || q.includes("kas")) {
      reply = "💼 **Manajemen Keuangan BUMDes & UMKM Desa:**\n\n1. **Pemisahan Kas:** Pisahkan secara ketat dompet pribadi keluarga dengan rekening perputaran modal usaha.\n2. **Pencatatan Harian:** Catat arus kas masuk (*cash inflow*) dan kas keluar (*cash outflow*) setiap sore setelah penutupan toko.\n3. **Dana Cadangan:** Sisihkan minimal 10% laba bersih untuk dana penyusutan alat dan modal darurat.\n\n*Rujukan: Manajemen Keuangan BUMDes Bab 3.*";
    } else if (q.includes("sejarah") || q.includes("pangkalan") || q.includes("asal")) {
      reply = "🏛️ **Sejarah Desa Pangkalan:**\n\nDesa Pangkalan didirikan oleh para sesepuh yang memanfaatkan aliran sungai yang subur sebagai dermaga (*pangkalan*) persinggahan pedagang dan lumbung pertanian padi. Nilai gotong royong dan silaturahmi menjadi pilar utama kehidupan bermasyarakat hingga hari ini.\n\n*Rujukan: Sejarah Desa Pangkalan karya Tim Arsip Desa.*";
    } else {
      reply = `Halo Warga Desa Pangkalan! 😊 Saya adalah **Tanya Pustaka AI**. 

Saya siap membantu Anda menjawab seputar:
1. **Pertanian & Bioflok:** Cara penanaman, bibit unggul, dan pemupukan.
2. **Kewirausahaan UMKM:** Pengelolaan kas, pinjaman modal BUMDes.
3. **Budaya & Aksara Sunda:** Tata krama basa dan sejarah lokal.
4. **Rekomendasi Buku:** Saran e-book terbaik di rak perpustakaan.

Silakan ajukan pertanyaan spesifik Anda!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan AI" }, { status: 500 });
  }
}
