require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  console.log("Connected to database for book enrichment.");

  // Check if book exists
  const existing = await client.query(`SELECT count(*) FROM "Book" WHERE "title" = 'Budidaya Ikan Nila Sistem Bioflok Desa'`);
  if (parseInt(existing.rows[0].count, 10) === 0) {
    const bookId = 'book-bioflok-01';
    await client.query(`
      INSERT INTO "Book" ("id", "title", "author", "category", "description", "coverUrl", "isOffline", "rating", "pages", "updatedAt") VALUES
      (
        '${bookId}',
        'Budidaya Ikan Nila Sistem Bioflok Desa',
        'Ir. Agus Hendrawan, M.P.',
        'Pertanian',
        'Panduan lengkap teknik pembesaran ikan nila menggunakan kolam terpal bioflok berbiaya hemat dan hemat air untuk ketahanan pangan keluarga desa.',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBytu0Rn6l4EMfEJtl5t43Hr0IE1HRyrMvdvUJFF5Z1Ydrk8s7QsZEarM2-GBlJtKdfFBGpE7ey2o-e7_1gQyhn85NolAp_ag2ZTCPvKb52Pk-2yINxVZUasHpWKAn8XW1fU9G_ySlfnEb2gu0PCFajqkESUSvhzZKEXak9iyc7Jo5boGtBBuPbfvSJjKs8uf7lBUOYDjuR7Nb_cnXzevBg4Nk1NfeEphvkTGSYZpVjCw3GOoxIuQ10',
        true,
        4.8,
        45,
        CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      INSERT INTO "Chapter" ("id", "bookId", "title", "content", "order", "updatedAt") VALUES
      (
        'chap-bio-1',
        '${bookId}',
        'Pengenalan Sistem Bioflok',
        'Sistem bioflok merupakan teknologi budidaya perikanan yang memanfaatkan mikroorganisme heterotrof untuk mengubah limbah organik amonia menjadi gumpalan (flok) bernutrisi tinggi yang dapat dimakan kembali oleh ikan.\n\nKeunggulan utama teknologi ini bagi warga desa adalah efisiensi penggunaan air hingga 80% dan pengurangan kebutuhan pakan pelet komersial hingga 30%.\n\nDengan modal kolam terpal bulat berdiameter 3 meter, keluarga desa dapat memelihara 1.000 hingga 1.500 ekor ikan nila dengan angka kelangsungan hidup (SR) di atas 85%.',
        1,
        CURRENT_TIMESTAMP
      ),
      (
        'chap-bio-2',
        '${bookId}',
        'Persiapan Kolam dan Pembentukan Flok',
        'Langkah pertama dalam pembuatan kolam bioflok adalah pengisian air setinggi 80-90 cm yang telah diendapkan selama 24 jam.\n\nSelanjutnya, tambahkan garam krosok sebanyak 1 kg per meter kubik air untuk menjaga kestabilan osmoregulasi ikan.\n\nUntuk memicu pembentukan flok, campurkan molase (tetes tebu) sebanyak 50 ml/m3 dan probiotik Bacillus sp. sebanyak 5 gram/m3, lalu aerasi secara terus menerus selama 7-10 hari hingga air berubah menjadi kecokelatan dan beraroma segar fermentasi.',
        2,
        CURRENT_TIMESTAMP
      ),
      (
        'chap-bio-3',
        '${bookId}',
        'Penebaran Benih dan Manajemen Pakan',
        'Penebaran benih ikan nila ukuran 7-9 cm dilakukan pada pagi atau sore hari saat suhu air stabil di kisaran 27-29 derajat Celsius.\n\nLakukan proses aklimatisasi dengan mengapungkan kantong benih selama 15-20 menit di atas permukaan kolam sebelum dilepaskan secara perlahan.\n\nPemberian pakan dilakukan 2-3 kali sehari dengan dosis 2-3% dari total biomassa ikan. Selalu pantau kadar oksigen terlarut (DO) agar tetap berada di atas 4 mg/L.',
        3,
        CURRENT_TIMESTAMP
      );
    `);
    console.log("Seeded book: Budidaya Ikan Nila Sistem Bioflok Desa");
  }

  // Check Sunda Culture book
  const existingSunda = await client.query(`SELECT count(*) FROM "Book" WHERE "title" = 'Tata Krama & Aksara Sunda Modern'`);
  if (parseInt(existingSunda.rows[0].count, 10) === 0) {
    const bookId2 = 'book-sunda-02';
    await client.query(`
      INSERT INTO "Book" ("id", "title", "author", "category", "description", "coverUrl", "isOffline", "rating", "pages", "updatedAt") VALUES
      (
        '${bookId2}',
        'Tata Krama & Aksara Sunda Modern',
        'Drs. H. Cecep Gunawan',
        'Sejarah',
        'Kumpulan tata krama basa Sunda, undak usuk basa loma dan lemes, serta panduan praktis membaca dan menulis aksara Sunda baku.',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Jh7mlFnbxuUKmHwAIlcTmy1ZzW9Q4eXBvFHqDTIOOkFJIHTSXG_hv3ygvYTGi4tialCKKPXU5Zvt1CNq3rSkHfdInOw8TYKqYdtSIJ4DXpEgc1iC05Y1sWAHaRIhf1uh8H-l0AvPaSHH_cehUn4IzvmxHJGD8FRfGRy4IZj0GhKMOdPcWC2OC6SHlOaSAX5qZQdudXFz-PiJUOr0BAkY3N8GP-LFILStI49Qu2pjapKYyU0IndmL',
        true,
        4.9,
        60,
        CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      INSERT INTO "Chapter" ("id", "bookId", "title", "content", "order", "updatedAt") VALUES
      (
        'chap-sun-1',
        '${bookId2}',
        'Undak Usuk Basa Sunda',
        'Dina kahirupan sapopoe urang Sunda, basa teh ngagambarkeun ajen budaya jeung tatakrama anu luhur.\n\nUndak usuk basa kabagi kana tilu tataran utama: basa loma (akrab/ragam sapopoe), basa lemes keur sorangan, jeung basa lemes keur batur minangka wujud ngahargaan.\n\nContona, kecap "dahar" dina basa loma robah jadi "neda" keur diri sorangan, sarta jadi "tuang" upama ditujukeun ka jalma anu leuwih sepuh atawa kudu dihormat.',
        1,
        CURRENT_TIMESTAMP
      ),
      (
        'chap-sun-2',
        '${bookId2}',
        'Aksara Swara jeung Ngalagena',
        'Aksara Sunda baku diwangun ku 7 Aksara Swara (vokal mandiri: a, i, u, e, o, eu, e) jeung 23 Aksara Ngalagena (konsonan ngalagena: ka, ca, ta, pa, ya, wa, ga, ja, da, ba, ra, sa, nga, nya, na, ma, la, ha, fa, va, qa, xa, za).\n\nUnggal aksara ngalagena geus ngandung sora vokal "a". Pikeun ngarobah sora vokal, digunakeun rarangken anu disimpen di luhur, di handap, atawa sajajar jeung aksara utama.',
        2,
        CURRENT_TIMESTAMP
      );
    `);
    console.log("Seeded book: Tata Krama & Aksara Sunda Modern");
  }

  await client.end();
  console.log("Book enrichment complete!");
}

main().catch(err => {
  console.error("Book enrichment error:", err);
  process.exit(1);
});
