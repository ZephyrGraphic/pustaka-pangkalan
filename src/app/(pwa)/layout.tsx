import Link from "next/link";
import { Home, Search, BookOpen, User } from "lucide-react";

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full h-[calc(4rem+env(safe-area-inset-bottom))] bg-white border-t border-slate-200 flex justify-around items-center px-2 pb-[env(safe-area-inset-bottom)] z-50">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <Home size={24} />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <Search size={24} />
          <span className="text-[10px] font-medium">Cari</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <BookOpen size={24} />
          <span className="text-[10px] font-medium">Koleksi</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <User size={24} />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
      </nav>
    </div>
  );
}
