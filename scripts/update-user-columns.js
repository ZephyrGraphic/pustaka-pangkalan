require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require"
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL for User column updates.");

  await client.query(`
    ALTER TABLE "User" 
    ADD COLUMN IF NOT EXISTS "image" TEXT,
    ADD COLUMN IF NOT EXISTS "phone" TEXT,
    ADD COLUMN IF NOT EXISTS "address" TEXT,
    ADD COLUMN IF NOT EXISTS "occupation" TEXT,
    ADD COLUMN IF NOT EXISTS "isProfileComplete" BOOLEAN NOT NULL DEFAULT false;
  `);

  console.log("User table columns verified (image, phone, address, occupation, isProfileComplete).");
  await client.end();
}

main().catch(err => {
  console.error("User column update error:", err);
  process.exit(1);
});
