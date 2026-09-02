import prisma from "../src/lib/prisma";

async function migrateCategoryTable() {
  console.log("Applying Category table migration via Prisma client...");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "description" TEXT,
      "icon" TEXT DEFAULT 'BookOpen',
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Book_categoryId_fkey'
      ) THEN
        ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  console.log("Migration applied successfully!");
}

migrateCategoryTable()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
