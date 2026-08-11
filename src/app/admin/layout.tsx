import Sidebar from "./components/Sidebar";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Dashboard - Perpustakaan Digital Desa",
  description: "Administrative Management Platform for Village Digital Library",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              System Online • Connected to PostgreSQL
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">Admin ({admin.phone})</p>
              <p className="text-xs text-emerald-400">Role: {admin.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
