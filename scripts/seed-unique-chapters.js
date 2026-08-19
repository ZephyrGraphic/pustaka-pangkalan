require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT b.id, b.title, COUNT(c.id) as chapters_count
    FROM "Book" b
    LEFT JOIN "Chapter" c ON c."bookId" = b.id
    GROUP BY b.id, b.title
  `);
  console.log("Books chapter count:", res.rows);

  const missing = res.rows.filter(r => parseInt(r.chapters_count) === 0);
  for (const b of missing) {
    console.log("Adding chapters with unique IDs for:", b.title);
    await client.query(`
      INSERT INTO "Chapter" (id, "bookId", title, content, "order", "createdAt", "updatedAt")
      VALUES 
      (
        'chap-tani-mod-1',
        $1,
        'Bab 1: Pengantar Pertanian Presisi Ramah Lingkungan',
        'Pertanian modern berbasis presisi merupakan paradigma baru dalam pengelolaan lahan pertanian desa dengan memanfaatkan data iklim mikro, sensor kelembaban tanah, dan pemupukan terukur.\n\nMasyarakat Desa Pangkalan yang mayoritas mengelola lahan sawah dan kebun dapat mengadopsi teknik ini untuk meningkatkan hasil panen gabah dan sayuran organik hingga 35% dengan biaya input pupuk kimia yang jauh lebih hemat.',
        1,
        NOW(),
        NOW()
      ),
      (
        'chap-tani-mod-2',
        $1,
        'Bab 2: Manajemen Irigasi Hemat Air dan Pemupukan Organik',
        'Pengelolaan air menggunakan sistem Alternate Wetting and Drying (AWD) atau pengairan berselang terbukti mampu menghemat kebutuhan air irigasi sawah hingga 25% tanpa menurunkan produktivitas gabah.\n\nSelain itu, pemanfaatan limbah jerami dan kotoran ternak sebagai kompos trichoderma lokal mampu mengembalikan kesuburan tanah sawah Desa Pangkalan yang mengalami kejenuhan akibat pupuk anorganik berkepanjangan.',
        2,
        NOW(),
        NOW()
      )
    `, [b.id]);
  }
  await client.end();
}

main().catch(console.error);
