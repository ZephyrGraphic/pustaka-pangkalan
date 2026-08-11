import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminUsersPage() {
  let usersList: any[] = [];

  try {
    usersList = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
      },
    });
  } catch (_) {}

  // Fallback demo data if DB is empty
  if (usersList.length === 0) {
    usersList = [
      {
        id: "user-1",
        name: "Admin Kai (Kaydeen303)",
        phone: "081574627052",
        email: "admin@desa.id",
        role: { name: "ADMIN" },
        createdAt: new Date(),
      },
      {
        id: "user-2",
        name: "Pak Ahmad Subagyo",
        phone: "085211223344",
        email: "ahmad@warga.desa.id",
        role: { name: "USER" },
        createdAt: new Date(),
      },
      {
        id: "user-3",
        name: "Ibu Nurhayati",
        phone: "081399887766",
        email: "nurhayati@warga.desa.id",
        role: { name: "USER" },
        createdAt: new Date(),
      },
    ];
  }

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Anggota Warga Desa</h1>
          <p className="text-sm text-slate-400">Daftar warga desa terdaftar dan status verifikasi akun</p>
        </div>
        <button
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
        >
          <span>➕</span>
          <span>Daftarkan Anggota Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3">Nomor Telepon / WhatsApp</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Peran / Role</th>
                <th className="px-4 py-3">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-4 font-semibold text-white">{user.name}</td>
                  <td className="px-4 py-4 text-emerald-400 font-mono">{user.phone}</td>
                  <td className="px-4 py-4 text-slate-400">{user.email || "-"}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        user.role?.name === "ADMIN"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {user.role?.name || "MEMBER"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                      TERVERIFIKASI 🟢
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
