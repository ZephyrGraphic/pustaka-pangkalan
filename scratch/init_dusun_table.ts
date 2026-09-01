import prisma from "../src/lib/prisma";

async function main() {
  console.log("Connecting and ensuring Dusun table exists...");
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Dusun" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Table Dusun created or verified.");

  const defaultDusuns = [
    { id: "dusun_1", name: "Dusun Pangkalan", order: 1 },
    { id: "dusun_2", name: "Dusun Cikajang", order: 2 },
    { id: "dusun_3", name: "Dusun Pasir Arangan", order: 3 },
    { id: "dusun_4", name: "Dusun Pasir Gombong", order: 4 },
  ];

  for (const d of defaultDusuns) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Dusun" ("id", "name", "order", "updatedAt") 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
       ON CONFLICT ("name") DO NOTHING`,
      d.id,
      d.name,
      d.order
    );
  }

  const result = await (prisma as any).dusun.findMany({
    orderBy: { order: "asc" }
  });

  console.log("Current Dusun in DB:", result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
