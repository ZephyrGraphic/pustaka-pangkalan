import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Book, 
  BookMarked,
  Users, 
  LayoutDashboard, 
  LogOut, 
  Bell, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  Eye,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

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
            <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
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
            href="/admin/circulation" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <BookMarked className="w-4 h-4 text-primary shrink-0" />
            <span>Sirkulasi Buku Fisik</span>
          </Link>

          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-surface-container-high text-on-surface transition-colors font-medium text-xs sm:text-sm"
          >
            <Users className="w-4 h-4 text-primary shrink-0" />
            <span>Pengguna & Warga</span>
          </Link>

          {/* Quick Switcher in Sidebar */}
          <div className="pt-3 mt-3 border-t border-outline-variant/20">
            <Link 
              href="/" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all text-xs group"
              title="Beralih ke Tampilan Warga"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 shrink-0" />
                <span>Mode Warga</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          <LogoutButton className="flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-2xl text-error hover:bg-error/10 transition-colors text-xs font-semibold">
            <LogOut className="w-4 h-4" />
            <span>Keluar Admin</span>
          </LogoutButton>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content with Top Nav Header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar header */}
        <header className="h-16 bg-surface-container border-b border-outline-variant/20 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="font-semibold text-primary">Portal Administrasi</span>
            <span>/</span>
            <span>Pustaka Digital Desa Pangkalan</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface shadow-sm border border-outline-variant/20" />
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:scale-105 transition-all"
              title="Beralih ke Tampilan Warga"
            >
              <Eye className="w-4 h-4" />
              <span>Beralih ke Mode Warga</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
