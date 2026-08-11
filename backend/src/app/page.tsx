import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-xl space-y-6">
        <div className="text-6xl mb-4">🏛️</div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Perpustakaan Digital Desa
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Platform Layanan Backend REST API & Admin Dashboard Pengelolaan Koleksi Digital Desa (E-Book, Modul, Sejarah Desa, dan Arsip).
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/admin"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all"
          >
            Masuk ke Admin Dashboard
          </Link>
          <a
            href="/api/v1/health"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold text-sm transition-all"
          >
            Cek REST API Health
          </a>
        </div>
      </div>
    </div>
  );
}
