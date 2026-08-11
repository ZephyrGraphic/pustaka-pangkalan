import Link from "next/link";
import { ChevronLeft, Share2, Heart, BookOpen, Star } from "lucide-react";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we'd fetch the book by ID here
  
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex gap-2">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-6 flex flex-col items-center border-b border-slate-100">
          <div className="w-40 aspect-[2/3] bg-slate-200 rounded-xl shadow-lg relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-200 flex items-center justify-center">
              <BookOpen size={48} className="text-slate-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 text-center leading-tight mb-2">
            Sejarah Desa Pangkalan Vol. {params.id}
          </h1>
          <p className="text-slate-500 text-sm font-medium mb-4">Pemerintah Desa Pangkalan</p>
          
          <div className="flex gap-4 text-sm text-slate-600 bg-slate-50 px-6 py-3 rounded-2xl w-full justify-around">
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-900 flex items-center gap-1">4.8 <Star size={14} className="text-amber-400 fill-amber-400" /></span>
              <span className="text-xs">Rating</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-900">120</span>
              <span className="text-xs">Halaman</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-900">Modul</span>
              <span className="text-xs">Kategori</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Sinopsis</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Buku ini mendokumentasikan sejarah dan perkembangan Desa Pangkalan dari masa ke masa. 
            Mulai dari asal-usul penamaan desa, tokoh-tokoh penting yang berperan, hingga capaian-capaian desa di era modern.
            Sangat cocok dibaca oleh warga desa untuk mengenal lebih dalam mengenai kampung halamannya.
          </p>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full p-4 bg-white border-t border-slate-100 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Link 
          href={`/read/${params.id}`} 
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98]"
        >
          <BookOpen className="mr-2" size={20} />
          Mulai Membaca
        </Link>
      </div>
    </div>
  );
}
