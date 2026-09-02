import prisma from "../src/lib/prisma";

async function seedRealBorrowRecords() {
  console.log("Seeding real borrow records into database...");

  // Check if any exist
  const existing = await prisma.borrowRecord.findMany();
  if (existing.length > 0) {
    console.log(`Sudah ada ${existing.length} catatan peminjaman di database.`);
    return;
  }

  const user = await prisma.user.findFirst({ where: { email: "3202202600420001" } });
  const user2 = await prisma.user.findFirst({ where: { email: "8765432187654321" } });
  const book1 = await prisma.book.findFirst({ where: { title: { contains: "Pertanian", mode: "insensitive" } } });
  const book2 = await prisma.book.findFirst({ where: { title: { contains: "Sejarah", mode: "insensitive" } } });

  if (!user || !book1) {
    console.error("User atau buku tidak ditemukan!");
    return;
  }

  // 1. Active borrow record
  const rec1 = await prisma.borrowRecord.create({
    data: {
      userId: user.id,
      bookId: book1.id,
      borrowDate: new Date(Date.now() - 3 * 86400000),
      dueDate: new Date(Date.now() + 4 * 86400000),
      status: "BORROWED",
      notes: "Buku fisik dipinjam di Balai Desa Pangkalan",
    },
  });
  console.log("Created real active record:", rec1.id);

  // 2. Returned record if user2 and book2 exist
  if (user2 && book2) {
    const rec2 = await prisma.borrowRecord.create({
      data: {
        userId: user2.id,
        bookId: book2.id,
        borrowDate: new Date(Date.now() - 10 * 86400000),
        dueDate: new Date(Date.now() - 3 * 86400000),
        returnDate: new Date(Date.now() - 1 * 86400000),
        status: "RETURNED",
        notes: "Sudah dikembalikan dalam kondisi rapi",
      },
    });
    console.log("Created real returned record:", rec2.id);
  }

  console.log("Seeding real borrow records selesai!");
}

seedRealBorrowRecords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
