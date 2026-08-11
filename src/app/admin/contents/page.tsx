import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminContentsPage() {
  let contents: any[] = [];
  try {
    contents = await prisma.content.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: true,
        digitalAssets: true,
      },
    });
  } catch (_) {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Koleksi Digital</h1>
          <p className="text-sm text-slate-400">Daftar seluruh e-book, modul, dokumen, dan sejarah desa</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          <span>➕</span>
          <span>Tambah Koleksi</span>
        </Link>
      </div>

      {/* Contents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Total {contents.length} Koleksi Terdaftar</span>
        </div>

        {contents.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">Belum ada koleksi digital.</p>
            <p className="text-sm mt-1">Klik tombol 'Tambah Koleksi' di atas untuk mengunggah PDF baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Cover & Judul</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Lisensi</th>
                  <th className="px-6 py-4">Status Publikasi</th>
                  <th className="px-6 py-4">File Asset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {contents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-slate-800 rounded overflow-hidden flex-shrink-0 border border-slate-700 flex items-center justify-center text-xs">
                          {item.coverUrl ? (
                            <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            "📖"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.author?.name || "Penulis Desa"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-slate-800 text-emerald-400 text-xs px-3 py-1 rounded-full border border-slate-700 font-medium">
                        {item.category.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      {item.contentType}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {item.license}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {item.digitalAssets.length > 0 ? (
                        <a
                          href={item.digitalAssets[0].fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>📄</span> File PDF
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Belum ada file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
