require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  console.log("Adding gamification columns to User table...");

  await client.query(`
    ALTER TABLE "User" 
    ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "badge" VARCHAR(255) NOT NULL DEFAULT 'Warga Pembelajar';
  `);

  console.log("Gamification columns added successfully!");
  await client.end();
}

main().catch(console.error);
