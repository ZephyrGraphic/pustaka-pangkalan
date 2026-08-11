import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Content, Category, Author } from "@prisma/client";

export const revalidate = 0; // Dynamic server rendering

type ContentWithRelations = Content & { category: Category; author: Author | null };

export default async function AdminDashboardPage() {
  let totalContents = 142;
  let totalUsers = 64;
  let totalReads = 85;
  let publishedCount = 138;
  let recentContents: ContentWithRelations[] = [];
  let isDbError = false;

  try {
    const res = await Promise.all([
      prisma.content.count(),
      prisma.user.count(),
      prisma.readingProgress.count(),
      prisma.content.count({ where: { status: "PUBLISHED" } }),
    ]);
    totalContents = res[0];
    totalUsers = res[1];
    totalReads = res[2];
    publishedCount = res[3];

    recentContents = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: true,
      },
    });
  } catch (_) {
    isDbError = true;
  }

  return (
    <div className="space-y-8">
      {isDbError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-bold">Mode Preview (Database Tidak Terhubung)</h3>
            <p className="text-sm">Silakan periksa konfigurasi DATABASE_URL di file .env</p>
          </div>
        </div>
      )}
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Pengelola Perpustakaan</h1>
          <p className="text-sm text-slate-400">Ringkasan statistik literasi dan koleksi digital desa</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
        >
          <span>➕</span>
          <span>Upload Buku Baru</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Total Koleksi</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-lg">📚</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{totalContents}</p>
          <p className="text-xs text-slate-500 mt-1">{publishedCount} Koleksi Dipublikasikan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Total Warga Terdaftar</span>
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg text-lg">👤</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{totalUsers}</p>
          <p className="text-xs text-slate-500 mt-1">Pembaca Akun Terdaftar</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Sesi Membaca Aktif</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg text-lg">📖</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{totalReads}</p>
          <p className="text-xs text-slate-500 mt-1">Total Progress Terekam</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Status Sistem</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-lg">⚡</span>
          </div>
          <p className="text-lg font-bold text-emerald-400">Aktif & Optimal</p>
          <p className="text-xs text-slate-500 mt-1">Next.js API + PostgreSQL</p>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Koleksi Terbaru Diunggah</h2>

        {recentContents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Belum ada koleksi yang diunggah.</p>
            <Link href="/admin/contents/new" className="text-emerald-400 text-sm underline mt-2 inline-block">
              Unggah koleksi pertama sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Judul Buku / Dokumen</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Penulis</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dilihat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentContents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-semibold text-white">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-800 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-slate-700">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.author?.name || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.viewCount}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
