require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL DB.");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "Announcement" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'Warta Desa',
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Table 'Announcement' verified.");

  // Check if announcements exist
  const res = await client.query('SELECT count(*) FROM "Announcement"');
  if (parseInt(res.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO "Announcement" ("id", "title", "content", "category", "active") VALUES
      ('ann-1', 'Sosialisasi Literasi Digital & Pertanian Modern', 'Balai Desa Pangkalan mengundang seluruh kelompok tani dan warga untuk menghadiri bedah modul budidaya padi organik hemat air pada hari Sabtu pukul 09:00 WIB.', 'Pertanian', true),
      ('ann-2', 'Penambahan 20+ Koleksi E-Book Baru di Pustaka Pangkalan', 'Perpustakaan desa telah menambahkan koleksi terbaru bidang wirausaha UMKM, sejarah Sunda, dan rekayasa pertanian. Silakan akses secara gratis melalui katalog.', 'Perpustakaan', true),
      ('ann-3', 'Pelatihan Pencatatan Keuangan Digital UMKM Desa', 'Bumdes Pangkalan bekerja sama dengan Pustaka Digital mengadakan kelas praktis pembukuan usaha mikro bagi pelaku usaha lokal.', 'Ekonomi', true);
    `);
    console.log("Seeded initial village announcements.");
  }

  await client.end();
  console.log("Database synchronization complete!");
}

main().catch(err => {
  console.error("DB Sync Error:", err);
  process.exit(1);
});
