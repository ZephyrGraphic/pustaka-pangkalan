"use client";

import { useEffect, useState } from "react";
import { User, Activity, Bookmark, ShieldAlert, ShieldCheck, Search, ArrowUpDown, X } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (user: any) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg = user.role === "ADMIN"
      ? `Cabut hak akses Admin dari "${user.name}"? Pengguna akan menjadi Warga biasa.`
      : `Jadikan "${user.name}" sebagai Administrator Pustaka?`;

    if (!confirm(confirmMsg)) return;

    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: nextRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert("Gagal mengubah peran pengguna.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Data Pengguna & Warga</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Daftar warga dan pengelola sistem Perpustakaan Digital Desa Pangkalan.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl">
          <p>{error}</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {(["ALL", "USER", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                filterRole === role
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
              }`}
            >
              {role === "ALL" ? "Semua" : role === "USER" ? "Warga" : "Admin"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-on-surface-variant">Memuat data pengguna...</div>
      ) : (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-xs uppercase tracking-wider">
                  <th className="p-4 w-14">Peran</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">NIK / ID Login</th>
                  <th className="p-4">Buku Dibaca</th>
                  <th className="p-4">Buku Disimpan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                      Tidak ada pengguna yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4">
                        {user.role === "ADMIN" ? (
                          <div className="w-9 h-9 bg-error-container text-on-error-container rounded-full flex items-center justify-center shadow-sm" title="Administrator">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-primary-container/30 text-primary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-on-surface text-sm">{user.name}</p>
                        {user.role === "ADMIN" && (
                          <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider font-bold bg-error-container text-on-error-container px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-on-surface-variant font-mono text-xs">{user.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">{user._count?.readers || 0} buku</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                          <Bookmark className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">{user._count?.bookmarks || 0} buku</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={updatingId === user.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                            user.role === "ADMIN"
                              ? "bg-surface-container-highest hover:bg-error-container/40 text-on-surface border-outline-variant/30"
                              : "bg-primary-container/30 hover:bg-primary-container/60 text-primary border-primary/20"
                          }`}
                        >
                          {user.role === "ADMIN" ? "Ubah jadi Warga" : "Jadikan Admin"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
