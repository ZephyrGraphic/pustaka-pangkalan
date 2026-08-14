import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Book, Users, LayoutDashboard, LogOut, Bell, BarChart3, ExternalLink, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-background text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container border-r border-outline-variant/30 flex flex-col shrink-0">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface leading-tight">Admin Pustaka</h2>
              <p className="text-xs text-on-surface-variant">Desa Pangkalan</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
            <span>Dashboard Utama</span>
          </Link>

          <Link 
            href="/admin/books" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <Book className="w-4 h-4 text-primary shrink-0" />
            <span>Kelola Koleksi Buku</span>
          </Link>

          <Link 
            href="/admin/announcements" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <Bell className="w-4 h-4 text-primary shrink-0" />
            <span>Warta & Kabar Desa</span>
          </Link>

          <Link 
            href="/admin/reviews" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <MessageSquare className="w-4 h-4 text-primary shrink-0" />
            <span>Moderasi Ulasan</span>
          </Link>

          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <BarChart3 className="w-4 h-4 text-primary shrink-0" />
            <span>Statistik Literasi</span>
          </Link>

          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <Users className="w-4 h-4 text-primary shrink-0" />
            <span>Pengguna & Warga</span>
          </Link>

          <div className="pt-3 mt-3 border-t border-outline-variant/20">
            <Link 
              href="/" 
              target="_blank" 
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl hover:bg-surface-container-high text-on-surface-variant transition-colors text-xs"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Lihat Halaman Warga</span>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-outline-variant/30">
          <LogoutButton className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-2xl text-error hover:bg-error/10 transition-colors text-xs font-semibold">
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Admin</span>
          </LogoutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
