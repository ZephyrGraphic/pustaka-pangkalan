import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { contents: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Kelola Kategori Desa</h1>
        <p className="text-sm text-slate-400">Pengelompokan bidang pengetahuan untuk memudahkan pencarian warga</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">{cat.icon || "📚"}</span>
              <div>
                <h3 className="font-bold text-white text-base">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat.description || "Tidak ada deskripsi"}</p>
                <span className="inline-block text-xs font-semibold text-emerald-400 mt-3 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {cat._count.contents} Koleksi Buku
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
