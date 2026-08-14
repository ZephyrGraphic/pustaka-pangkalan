import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Book, Users, LayoutDashboard, LogOut, Bell, BarChart3, ExternalLink } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container border-r border-outline-variant/30 flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Admin Pustaka</h2>
            <p className="text-xs text-on-surface-variant">Desa Pangkalan</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-container/50 text-on-surface transition-colors">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/books" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-container/50 text-on-surface transition-colors">
            <Book className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Kelola Buku</span>
          </Link>
          <Link href="/admin/announcements" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-container/50 text-on-surface transition-colors">
            <Bell className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Warta & Kabar</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-container/50 text-on-surface transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Statistik & Laporan</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-container/50 text-on-surface transition-colors">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Pengguna & Warga</span>
          </Link>

          <div className="pt-3 mt-3 border-t border-outline-variant/20">
            <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary-container/30 text-on-surface-variant transition-colors text-xs">
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Halaman Warga</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <LogoutButton className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </LogoutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
