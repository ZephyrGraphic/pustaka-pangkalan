import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { BookOpen, TrendingUp, Clock, ChevronRight } from "lucide-react";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-full p-4 space-y-6">
      <header className="flex justify-between items-center pt-2">
        <div>
          <p className="text-sm text-slate-500">Selamat datang kembali,</p>
          <h1 className="text-xl font-bold text-slate-900">{session.name || session.phone}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
          {(session.name || "U")[0]}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-1">Mari Lanjutkan Membaca</h2>
          <p className="text-blue-100 text-sm mb-4">Sejarah Desa Pangkalan Vol. 2</p>
          <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
            Lanjutkan
          </button>
        </div>
        <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp size={18} />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Terpopuler</h3>
          <p className="text-xs text-slate-500">Buku yang sering dibaca</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Clock size={18} />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Baru Rilis</h3>
          <p className="text-xs text-slate-500">Koleksi buku terbaru</p>
        </div>
      </section>

      {/* Rekomendasi */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Rekomendasi Untukmu</h3>
          <Link href="/explore" className="text-blue-600 text-sm font-medium flex items-center">
            Lihat semua <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {/* Skeleton/Placeholder Books for now */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[140px] snap-start space-y-2">
              <div className="w-full aspect-[2/3] bg-slate-200 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-200 flex items-center justify-center">
                  <BookOpen size={32} className="text-slate-400" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight">Judul Buku Ke-{i}</h4>
                <p className="text-xs text-slate-500 mt-1">Penulis Buku</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
