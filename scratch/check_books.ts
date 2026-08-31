import prisma from "../src/lib/prisma";

async function main() {
  const books = await prisma.book.findMany({
    include: {
      chapters: true,
    },
  });

  console.log(`Found ${books.length} books in DB:`);
  for (const b of books) {
    console.log(`- [${b.id}] "${b.title}" (${b.category}): ${b.chapters.length} chapters`);
    for (const c of b.chapters) {
      console.log(`    * [${c.id}] (order ${c.order}) "${c.title}" (content length: ${c.content?.length || 0})`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
