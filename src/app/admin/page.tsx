import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { 
  Book, 
  Users, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Star, 
  Plus, 
  Activity, 
  ArrowRight,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Core metrics
  const totalBooks = await prisma.book.count();
  const totalUsers = await prisma.user.count({ where: { role: "USER" } });
  const totalChapters = await prisma.chapter.count();
  const totalReviews = await prisma.review.count();
  let totalDusuns = 4;
  try {
    totalDusuns = await (prisma as any).dusun.count();
  } catch (e) {}

  // Recent reading progress activities
  const recentActivities = await prisma.readingProgress.findMany({
    take: 5,
    orderBy: { lastRead: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { id: true, title: true, category: true } },
    },
  });

  // Recent reviews
  const recentReviews = await prisma.review.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      book: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Dashboard Utama</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Selamat datang kembali, Pengelola Pustaka Pangkalan! Berikut adalah ringkasan operasional terkini.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Books */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div className="bg-primary-container p-3.5 rounded-xl text-on-primary-container shrink-0">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase">Total Buku</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">{totalBooks}</h3>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div className="bg-secondary-container p-3.5 rounded-xl text-on-secondary-container shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase">Warga Terdaftar</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">{totalUsers}</h3>
          </div>
        </div>

        {/* Total Chapters */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div className="bg-tertiary-container p-3.5 rounded-xl text-on-tertiary-container shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase">Total Bab Konten</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">{totalChapters}</h3>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div className="bg-amber-500/20 text-amber-600 dark:text-amber-400 p-3.5 rounded-xl shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase">Ulasan Pembaca</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">{totalReviews}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link 
          href="/admin/books/new"
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 p-4 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 bg-primary-container text-on-primary-container rounded-xl w-fit mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Tambah Buku
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Unggah e-book atau modul</p>
          </div>
        </Link>

        <Link 
          href="/admin/announcements"
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 p-4 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl w-fit mb-3">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Terbitkan Warta
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Kirim pengumuman warga</p>
          </div>
        </Link>

        <Link 
          href="/admin/analytics"
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 p-4 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 bg-tertiary-container text-on-tertiary-container rounded-xl w-fit mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Lihat Statistik
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Laporan & tren baca</p>
          </div>
        </Link>

        <Link 
          href="/admin/users"
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 p-4 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 bg-primary-container/30 text-primary rounded-xl w-fit mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Kelola Pengguna
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Akses admin & warga</p>
          </div>
        </Link>

        <Link 
          href="/admin/dusuns"
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 p-4 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Wilayah Dusun
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{totalDusuns} dusun desa</p>
          </div>
        </Link>
      </div>

      {/* Live Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Reading Activity */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-title-md text-base text-on-surface font-bold">Aktivitas Membaca Terkini</h3>
            </div>
            <Link href="/admin/analytics" className="text-xs text-primary font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-4">Belum ada aktivitas membaca tercatat.</p>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-on-surface">{act.user.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      Membaca Bab {act.page} pada <span className="font-medium text-primary">{act.book.title}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-on-surface-variant whitespace-nowrap">
                    {new Date(act.lastRead).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-title-md text-base text-on-surface font-bold">Ulasan Warga Terbaru</h3>
            </div>
            <Link href="/admin/reviews" className="text-xs text-primary font-medium hover:underline">
              Kelola Moderasi
            </Link>
          </div>

          {recentReviews.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-4">Belum ada ulasan dari pembaca.</p>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface">{rev.user.name}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= rev.rating ? "text-amber-500 fill-amber-500" : "text-outline-variant"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-primary font-medium">{rev.book.title}</p>
                  {rev.comment && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 italic">
                      "{rev.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
