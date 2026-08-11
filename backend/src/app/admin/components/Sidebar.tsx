"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Kelola Katalog SLiMS", href: "/admin/contents", icon: "📚" },
    { name: "Tambah Buku Baru", href: "/admin/contents/new", icon: "➕" },
    { name: "Anggota Warga Desa", href: "/admin/users", icon: "👥" },
    { name: "Kelola Kategori", href: "/admin/categories", icon: "🏷️" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-6 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h1 className="font-bold text-base text-emerald-400">Admin Perpustakaan</h1>
              <p className="text-xs text-slate-400">Digital Desa System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800 pt-4 text-xs text-slate-500">
        <p className="font-semibold text-slate-400">Perpustakaan Desa Pangkalan v1.0</p>
        <p>Managed by SLiMS Engine</p>
      </div>
    </aside>
  );
}
