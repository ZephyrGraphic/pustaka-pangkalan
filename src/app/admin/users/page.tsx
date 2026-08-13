"use client";

import { useEffect, useState } from "react";
import { User, Activity, Bookmark, ShieldAlert } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Data Pengguna</h1>
        <p className="text-on-surface-variant mt-1">Daftar warga atau anggota yang terdaftar di sistem Pustaka.</p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-on-surface-variant">Memuat data pengguna...</div>
      ) : (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-sm">
                  <th className="p-4 w-16">Status</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">NIK / ID Login</th>
                  <th className="p-4">Aktivitas Baca</th>
                  <th className="p-4">Buku Disimpan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">Belum ada pengguna.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4">
                        {user.role === "ADMIN" ? (
                          <div className="w-10 h-10 bg-error-container text-on-error-container rounded-full flex items-center justify-center" title="Administrator">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-on-surface">
                        {user.name}
                        {user.role === "ADMIN" && <span className="ml-2 text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-medium">Admin</span>}
                      </td>
                      <td className="p-4 text-on-surface-variant font-mono text-sm">{user.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <Activity className="w-4 h-4" />
                          <span className="text-sm font-medium">{user._count?.readers || 0} buku</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <Bookmark className="w-4 h-4" />
                          <span className="text-sm font-medium">{user._count?.bookmarks || 0} buku</span>
                        </div>
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
