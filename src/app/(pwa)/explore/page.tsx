import { Search, Filter, BookOpen } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-full p-4 space-y-6">
      <header className="pt-2 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Eksplorasi</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none text-sm"
              placeholder="Cari judul buku, penulis..."
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-center shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Categories */}
      <section className="space-y-3">
        <h3 className="font-semibold text-slate-800 text-sm">Kategori Pilihan</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {["Semua", "Sejarah", "Fiksi", "Edukasi", "Modul Desa"].map((cat, i) => (
            <button
              key={cat}
              className={`snap-start px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                i === 0 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results Grid */}
      <section className="grid grid-cols-2 gap-4 pb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2 group cursor-pointer">
            <div className="w-full aspect-[2/3] bg-slate-200 rounded-xl shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-200 flex items-center justify-center">
                <BookOpen size={32} className="text-slate-400" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight">Judul Buku {i}</h4>
              <p className="text-xs text-slate-500 mt-1">Penulis Buku</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
