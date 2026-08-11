"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MoreVertical, ZoomIn, ZoomOut, Maximize, Settings } from "lucide-react";

export default function ReadingPage({ params }: { params: { id: string } }) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <Link href={`/books/${params.id}`} className="p-2 -ml-2 text-slate-300 hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-sm font-semibold truncate flex-1 text-center px-4">
          Bab 1: Asal Usul Penamaan Pangkalan
        </h1>
        <button className="p-2 -mr-2 text-slate-300 hover:bg-slate-800 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Tools / Settings Bar */}
      <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-center gap-6 border-b border-slate-800">
        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ZoomOut size={18} />
        </button>
        <span className="text-xs font-mono w-12 text-center text-slate-300">{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ZoomIn size={18} />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-2"></div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>

      {/* PDF / Content Area */}
      <main className="flex-1 overflow-auto p-4 flex justify-center bg-slate-950">
        <div 
          className="bg-white text-slate-900 w-full max-w-2xl min-h-[800px] shadow-2xl p-8 rounded-sm md:rounded-lg"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Mock Document Content */}
          <h2 className="text-2xl font-bold mb-6 text-center">Asal Usul Penamaan Pangkalan</h2>
          
          <p className="mb-4 leading-relaxed text-justify indent-8">
            Desa Pangkalan memiliki sejarah panjang yang erat kaitannya dengan pos-pos penjagaan (pangkalan) pada masa lampau. 
            Menurut cerita tutur yang diwariskan turun-temurun, lokasi desa ini dulunya adalah tempat singgah para saudagar dan prajurit 
            yang sedang menempuh perjalanan jauh melintasi wilayah ini.
          </p>
          
          <p className="mb-4 leading-relaxed text-justify indent-8">
            Seiring berjalannya waktu, pangkalan tersebut berkembang menjadi sebuah permukiman tetap. 
            Masyarakat mulai membangun rumah-rumah panggung di sekitar sungai untuk mempermudah akses air bersih 
            dan jalur transportasi air yang pada masa itu merupakan urat nadi perekonomian.
          </p>
          
          <div className="my-8 p-4 bg-slate-100 border-l-4 border-slate-400 text-slate-700 italic">
            "Penamaan 'Pangkalan' bukan sekadar sebutan geografis, melainkan simbol perhentian yang memberi kehidupan dan tempat bernaung bagi para pengembara." 
            <br/><span className="text-sm font-semibold mt-2 block">— Catatan Sesepuh Desa (1982)</span>
          </div>
          
          <p className="mb-4 leading-relaxed text-justify indent-8">
            Hingga hari ini, sisa-sisa budaya keterbukaan dan keramahan terhadap pendatang masih menjadi ciri khas 
            warga Desa Pangkalan. Kearifan lokal tersebut terus dijaga sebagai warisan leluhur yang tak ternilai harganya.
          </p>
        </div>
      </main>

      {/* Bottom Navigation / Pages */}
      <footer className="bg-slate-900 border-t border-slate-800 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between">
        <button className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1">
          Sebelumnya
        </button>
        <span className="text-slate-500 text-xs">Halaman 12 dari 120</span>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1">
          Selanjutnya
        </button>
      </footer>
    </div>
  );
}
