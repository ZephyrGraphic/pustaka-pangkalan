require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

const BOOK_COVERS = {
  "Panduan Pertanian Modern Terpadu": "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80",
  "Sejarah Desa Pangkalan": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
  "Manajemen Keuangan BUMDes": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
  "Belajar Bertani Modern": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop&q=80",
  "Budidaya Ikan Nila Sistem Bioflok Desa": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&auto=format&fit=crop&q=80",
  "Tata Krama & Aksara Sunda Modern": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
};

async function main() {
  await client.connect();
  console.log("Updating book covers in database...");

  for (const [title, coverUrl] of Object.entries(BOOK_COVERS)) {
    await client.query(`
      UPDATE "Book" 
      SET "coverUrl" = $1, "updatedAt" = CURRENT_TIMESTAMP 
      WHERE "title" ILIKE $2
    `, [coverUrl, `%${title}%`]);
    console.log(`Updated cover for "${title}"`);
  }

  console.log("All book covers updated successfully!");
  await client.end();
}

main().catch(console.error);
