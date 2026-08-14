require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  const res = await client.query(`SELECT id, title, author, "coverUrl", category FROM "Book" ORDER BY "createdAt" DESC`);
  console.log("Current books in DB:");
  res.rows.forEach(b => {
    console.log(`[${b.id}] "${b.title}" - coverUrl: ${b.coverUrl ? b.coverUrl.slice(0, 50) + "..." : "NULL"}`);
  });
  await client.end();
}

main().catch(console.error);
