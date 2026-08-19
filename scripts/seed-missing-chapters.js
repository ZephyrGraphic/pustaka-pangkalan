require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT b.id, b.title, b.author, b.category, COUNT(c.id) as chapters_count
    FROM "Book" b
    LEFT JOIN "Chapter" c ON c."bookId" = b.id
    GROUP BY b.id
    HAVING COUNT(c.id) = 0
  `);

  console.log("Books without chapters:", res.rows);

  for (const b of res.rows) {
    console.log(`Adding chapters for ${b.title}...`);
    await client.query(`
      INSERT INTO "Chapter" (id, "bookId", title, content, "order", "createdAt", "updatedAt")
      VALUES 
      (
        'chap-bio-1',
        $1,
        'Bab 1: Pengenalan Sistem Bioflok Desa',
        'Teknologi bioflok merupakan salah satu teknik budidaya perikanan modern yang memanfaatkan aktivitas mikroorganisme heterotrof untuk mendaur ulang limbah organik dan amonia menjadi flok protein bergizi tinggi.\n\nBagi masyarakat Desa Pangkalan, budidaya ikan sistem bioflok menawarkan keuntungan berlipat: efisiensi pakan yang sangat tinggi, pemanfaatan lahan sempit di pekarangan rumah, serta penghematan air hingga 80% dibandingkan kolam konvensional.\n\nPrinsip utama dari bioflok adalah menjaga keseimbangan rasio Karbon dan Nitrogen (C/N ratio > 10) dengan penambahan sumber karbon seperti molase (tetes tebu) atau tepung tapioka.',
        1,
        NOW(),
        NOW()
      ),
      (
        'chap-bio-2',
        $1,
        'Bab 2: Manajemen Kualitas Air dan Penebaran Benih',
        'Sebelum benih ikan ditebar, persiapan air kolam bioflok memerlukan waktu sekitar 7 hingga 10 hari hingga warna air berubah menjadi kecokelatan yang menandakan pembentukan flok mikroba telah stabil.\n\nParameter air yang harus dipantau secara rutin meliputi:\n1. Suhu air: 26 - 30 derajat Celcius\n2. pH air: 7.0 - 8.2\n3. Oksigen terlarut (DO): minimal 4 mg/L dengan aerasi 24 jam nonstop.\n\nPenebaran benih ikan nila dilakukan pada pagi atau sore hari saat suhu lingkungan stabil. Kepadatan tebar optimal untuk kolam bulat D2 (diameter 2 meter) berkisar antara 800 hingga 1.000 ekor benih berkualitas.',
        2,
        NOW(),
        NOW()
      ),
      (
        'chap-bio-3',
        $1,
        'Bab 3: Pemeliharaan, Panen, dan Analisis Usaha',
        'Pemberian pakan pelet dilakukan dengan persentase 2-3% dari total biomassa ikan per hari, dibagi menjadi 2 atau 3 kali waktu pemberian.\n\nKunci keberhasilan bioflok adalah monitoring volume flok menggunakan kerucut Imhoff (target 10 - 25 ml/L). Jika flok terlalu pekat, kurangi molase dan lakukan pembuangan endapan bawah (bottom drain) secara berkala.\n\nDalam kurun waktu 3 hingga 4 bulan, ikan nila akan mencapai ukuran konsumsi 4-5 ekor per kilogram dengan tingkat kelangsungan hidup (SR) di atas 85%, memberikan keuntungan ekonomi nyata bagi kemandirian pangan warga Desa Pangkalan.',
        3,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    `, [b.id]);
    console.log(`Chapters added for ${b.title}!`);
  }

  await client.end();
}

main().catch(console.error);
