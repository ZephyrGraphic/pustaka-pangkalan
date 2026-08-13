import "dotenv/config";
import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Mulai melakukan seeding...");

  // Seed Users
  const hashedPassword = await bcrypt.hash("1234567812345678", 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: "1234567812345678" },
    update: {},
    create: {
      email: "1234567812345678", // NIK
      name: "Bapak Ahmad Subagyo",
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "8765432187654321" },
    update: {},
    create: {
      email: "8765432187654321", // NIK
      name: "Siti Nurhaliza",
      password: hashedPassword,
    },
  });

  // Seed Books
  await prisma.book.deleteMany({});
  
  const booksData = [
    {
      title: "Panduan Pertanian Modern Terpadu",
      author: "Budi Santoso",
      description: "Buku panduan lengkap tentang pertanian modern yang cocok diterapkan di Desa Pangkalan.",
      category: "Pertanian",
      coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBytu0Rn6l4EMfEJtl5t43Hr0IE1HRyrMvdvUJFF5Z1Ydrk8s7QsZEarM2-GBlJtKdfFBGpE7ey2o-e7_1gQyhn85NolAp_ag2ZTCPvKb52Pk-2yINxVZUasHpWKAn8XW1fU9G_ySlfnEb2gu0PCFajqkESUSvhzZKEXak9iyc7Jo5boGtBBuPbfvSJjKs8uf7lBUOYDjuR7Nb_cnXzevBg4Nk1NfeEphvkTGSYZpVjCw3GOoxIuQ10",
      pages: 120,
      rating: 4.8,
    },
    {
      title: "Sejarah Desa Pangkalan",
      author: "Tim Arsip Desa",
      description: "Catatan sejarah dan asal-usul Desa Pangkalan dari masa ke masa.",
      category: "Sejarah",
      coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Jh7mlFnbxuUKmHwAIlcTmy1ZzW9Q4eXBvFHqDTIOOkFJIHTSXG_hv3ygvYTGi4tialCKKPXU5Zvt1CNq3rSkHfdInOw8TYKqYdtSIJ4DXpEgc1iC05Y1sWAHaRIhf1uh8H-l0AvPaSHH_cehUn4IzvmxHJGD8FRfGRy4IZj0GhKMOdPcWC2OC6SHlOaSAX5qZQdudXFz-PiJUOr0BAkY3N8GP-LFILStI49Qu2pjapKYyU0IndmL",
      pages: 85,
      rating: 4.9,
    },
    {
      title: "Manajemen Keuangan BUMDes",
      author: "Dina Mariana",
      description: "Panduan mengelola keuangan Badan Usaha Milik Desa agar transparan dan menguntungkan.",
      category: "Ekonomi",
      coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGVw_j51tG8zPZ9tXoUo9w47FfLzHw_h_zD5yTjGz7Z9rV9O99g_x2o9Q0-wzV0YtQjZ5e0QG7Dq0h8g8_9QG7Dq0h8g8_9QG7Dq0h8g8", // dummy
      pages: 150,
      rating: 4.5,
    }
  ];

  for (const book of booksData) {
    const existing = await prisma.book.findFirst({
      where: { title: book.title },
    });
    if (!existing) {
      const newBook = await prisma.book.create({
        data: book,
      });

      // Tambahkan beberapa chapter dummy untuk setiap buku
      await prisma.chapter.createMany({
        data: [
          {
            bookId: newBook.id,
            title: "Bab 1: Pendahuluan",
            content: "Ini adalah isi dari Bab 1. Teks ini merupakan contoh paragraf pertama dalam bab ini yang mendeskripsikan pengenalan terhadap topik buku.\n\nParagraf kedua menjelaskan lebih lanjut mengenai latar belakang dan tujuan dari penulisan materi yang ada pada buku ini. Semua pembaca diharapkan dapat memahami dasar-dasarnya di bagian ini.",
            order: 1,
          },
          {
            bookId: newBook.id,
            title: "Bab 2: Pembahasan Inti",
            content: "Masuk ke Bab 2, di sini kita membahas inti dari topik secara mendalam. Terdapat banyak contoh dan kasus yang bisa dipelajari.\n\nDalam penerapan nyata, konsep-konsep ini sangat berguna untuk memecahkan masalah sehari-hari. Mari kita perhatikan skenario berikut...",
            order: 2,
          },
          {
            bookId: newBook.id,
            title: "Bab 3: Kesimpulan",
            content: "Bab 3 berisi kesimpulan dari seluruh materi yang telah dibahas. Dengan pemahaman yang kuat dari bab-bab sebelumnya, Anda sekarang siap untuk mempraktekkannya secara langsung.\n\nTerima kasih telah membaca buku ini.",
            order: 3,
          }
        ]
      });
    }
  }

  console.log("Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
