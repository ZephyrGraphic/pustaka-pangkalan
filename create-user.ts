import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash("270302", 10);
  await prisma.user.upsert({
    where: { email: "3202202600420001" },
    update: { password: hash },
    create: {
      email: "3202202600420001",
      name: "Pustaka Pangkalan",
      password: hash,
    },
  });
  console.log("Akun berhasil dibuat dengan ID Anggota: 3202202600420001");
}

main().finally(() => prisma.$disconnect());
