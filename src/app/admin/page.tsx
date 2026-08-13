import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Book, Users, BookOpen } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Ambil metrik dasar
  const totalBooks = await prisma.book.count();
  const totalUsers = await prisma.user.count({
    where: { role: "USER" }
  });
  const totalChapters = await prisma.chapter.count();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-on-surface">Dashboard</h1>
      <p className="text-on-surface-variant">
        Selamat datang kembali, Pustakawan! Berikut adalah ringkasan data Perpustakaan Digital Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Total Books */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 flex items-center gap-4 shadow-sm">
          <div className="bg-primary-container p-4 rounded-xl text-on-primary-container">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <p className="text-on-surface-variant font-medium">Total Buku</p>
            <h3 className="text-3xl font-bold text-on-surface">{totalBooks}</h3>
          </div>
        </div>

        {/* Card: Total Users */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 flex items-center gap-4 shadow-sm">
          <div className="bg-secondary-container p-4 rounded-xl text-on-secondary-container">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-on-surface-variant font-medium">Pengguna Terdaftar</p>
            <h3 className="text-3xl font-bold text-on-surface">{totalUsers}</h3>
          </div>
        </div>

        {/* Card: Total Chapters */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 flex items-center gap-4 shadow-sm">
          <div className="bg-tertiary-container p-4 rounded-xl text-on-tertiary-container">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-on-surface-variant font-medium">Total Bab/Konten</p>
            <h3 className="text-3xl font-bold text-on-surface">{totalChapters}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm mt-8">
        <h2 className="text-xl font-bold text-on-surface mb-4">Mulai Mengelola</h2>
        <p className="text-on-surface-variant mb-6">
          Gunakan menu di sebelah kiri untuk menambah, mengedit, atau menghapus koleksi buku dan mengelola akun pengguna.
        </p>
      </div>
    </div>
  );
}
