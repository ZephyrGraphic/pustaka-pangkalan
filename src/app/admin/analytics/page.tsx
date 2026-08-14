"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Download, 
  BookOpen, 
  Users, 
  Bookmark, 
  Star, 
  Clock, 
  FileSpreadsheet, 
  Activity 
} from "lucide-react";

interface AnalyticsData {
  metrics: {
    totalBooks: number;
    totalUsers: number;
    totalChapters: number;
    totalReviews: number;
    totalBookmarks: number;
    totalReadingSessions: number;
    estimatedReadingHours: number;
  };
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
  topBooks: {
    id: string;
    title: string;
    author: string;
    category: string;
    rating: number;
    _count: {
      readers: number;
      bookmarks: number;
      reviews: number;
    };
  }[];
  allBooks: any[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    if (!data || !data.allBooks) return;

    const headers = ["ID", "Judul", "Penulis", "Kategori", "Rating", "Jumlah Pembaca", "Jumlah Bab", "Disimpan"];
    const rows = data.allBooks.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      b.category,
      b.rating,
      b._count.readers,
      b._count.chapters,
      b._count.bookmarks,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_pustaka_pangkalan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { metrics, categoryDistribution, topBooks } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Statistik & Laporan Perpustakaan</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Data pemanfaatan literasi digital Desa Pangkalan.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Laporan CSV</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Buku</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalBooks}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalChapters} Bab/Konten</p>
        </div>

        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-secondary-container text-on-secondary-container">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Warga Terdaftar</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalUsers}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalReadingSessions} Sesi Baca</p>
        </div>

        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-tertiary-container text-on-tertiary-container">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Estimasi Jam Baca</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.estimatedReadingHours} Jam</p>
          <p className="text-xs text-on-surface-variant mt-1">Rata-rata 1.8 jam/sesi</p>
        </div>

        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Ulasan & Rating</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalReviews}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalBookmarks} Buku Difavoritkan</p>
        </div>
      </div>

      {/* Category Distribution & Top Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-title-md text-base text-on-surface font-bold">Distribusi Kategori Buku</h3>
          </div>

          <div className="space-y-4">
            {categoryDistribution.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-on-surface">{cat.category}</span>
                  <span className="font-label-md text-xs text-on-surface-variant">
                    {cat.count} Buku ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, cat.percentage)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Read Books */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-title-md text-base text-on-surface font-bold">Buku Paling Banyak Dibaca</h3>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {topBooks.map((book, index) => (
              <div key={book.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-container/30 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-title-md text-sm text-on-surface line-clamp-1">{book.title}</h4>
                    <p className="font-label-md text-xs text-on-surface-variant">{book.author} • {book.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-title-md text-sm text-primary font-bold">{book._count.readers}</span>
                  <span className="text-xs text-on-surface-variant ml-1">pembaca</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
