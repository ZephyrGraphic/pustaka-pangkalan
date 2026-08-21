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
  Activity,
  Printer,
  FileText,
  X,
  MapPin,
  Award
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

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
  const toast = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal memuat data analitik");
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
      b._count?.readers || 0,
      b._count?.chapters || 0,
      b._count?.bookmarks || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_literasi_desa_pangkalan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan CSV berhasil diunduh!");
  };

  const handlePrint = () => {
    window.print();
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
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Statistik & Laporan Perpustakaan</h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Data pemanfaatan literasi digital Desa Pangkalan untuk perencanaan pembangunan desa.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-outline-variant/30 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>Laporan Musrenbangdes</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary-container text-on-primary-container">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Buku</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalBooks}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalChapters} Bab/Konten Terbit</p>
        </div>

        <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-secondary-container text-on-secondary-container">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Warga Terdaftar</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalUsers}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalReadingSessions} Sesi Baca Aktif</p>
        </div>

        <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-tertiary-container text-on-tertiary-container">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Estimasi Jam Baca</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.estimatedReadingHours} Jam</p>
          <p className="text-xs text-on-surface-variant mt-1">Rata-rata 1.8 jam/sesi</p>
        </div>

        <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Ulasan & Rating</span>
          </div>
          <p className="text-3xl font-bold text-on-surface">{metrics.totalReviews}</p>
          <p className="text-xs text-on-surface-variant mt-1">{metrics.totalBookmarks} Koleksi Disimpan</p>
        </div>
      </div>

      {/* Category Distribution & Top Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-title-md text-base text-on-surface font-bold">Distribusi Kategori Pengetahuan</h3>
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
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-title-md text-base text-on-surface font-bold">Buku Paling Diminati Warga</h3>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {topBooks.map((book, index) => (
              <div key={book.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-primary-container/30 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-title-md text-sm font-bold text-on-surface line-clamp-1">{book.title}</h4>
                    <p className="font-label-md text-xs text-on-surface-variant mt-0.5">{book.author} • {book.category}</p>
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

      {/* Musrenbangdes Report Printable Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setShowReportModal(false)}
        >
          <div 
            className="relative bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto w-full max-w-3xl my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">Pratinjau Berkas Laporan Musrenbangdes</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Village Letterhead (KOP SURAT) */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Pemerintah Kabupaten • Kecamatan</h2>
              <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-950 tracking-wider">Pemerintah Desa Pangkalan</h1>
              <p className="text-xs text-slate-600 mt-1">
                Sekretariat Pustaka Digital: Balai Desa Pangkalan • Surat Keputusan Pengelolaan Literasi Desa
              </p>
            </div>

            {/* Report Content */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-800">
              <div className="text-center">
                <h3 className="text-base font-bold uppercase underline">Laporan Capaian Indeks Literasi & Minat Baca Warga</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periode: Semester Berjalan Tahun {new Date().getFullYear()}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Koleksi Buku</span>
                  <span className="text-lg font-bold text-slate-900">{metrics.totalBooks} Judul</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Warga Terdaftar</span>
                  <span className="text-lg font-bold text-slate-900">{metrics.totalUsers} Warga</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sesi Membaca</span>
                  <span className="text-lg font-bold text-slate-900">{metrics.totalReadingSessions} Kali</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Akumulasi Jam</span>
                  <span className="text-lg font-bold text-slate-900">{metrics.estimatedReadingHours} Jam</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">1. Peringkat Pengetahuan Paling Dibutuhkan Warga:</h4>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2">Kategori</th>
                      <th className="border border-slate-300 p-2 text-center">Jumlah Modul</th>
                      <th className="border border-slate-300 p-2 text-center">Persentase Minat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryDistribution.map((c) => (
                      <tr key={c.category}>
                        <td className="border border-slate-300 p-2 font-semibold">{c.category}</td>
                        <td className="border border-slate-300 p-2 text-center">{c.count}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">{c.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Rekomendasi Alokasi Program Dana Desa (Musrenbangdes):</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Berdasarkan tingginya minat warga terhadap kategori <strong>Pertanian & Peternakan</strong> dan <strong>Kewirausahaan UMKM</strong>, direkomendasikan penambahan pengadaan materi permodalan bioflok dan pelatihan digitalisasi kemasan produk desa.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold mt-1">Kepala Desa Pangkalan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( ............................................ )</p>
                </div>
                <div>
                  <p>Desa Pangkalan, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <p className="font-bold mt-1">Pengelola Pustaka Digital</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( Tim Literasi Pangkalan )</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
