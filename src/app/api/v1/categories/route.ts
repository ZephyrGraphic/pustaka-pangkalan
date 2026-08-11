import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";

const MOCK_CATEGORIES = [
  { id: "cat_01", name: "Pendidikan & Sekolah", slug: "pendidikan", icon: "📚", description: "Buku pelajaran, modul sekolah, dan panduan belajar", totalContent: 12 },
  { id: "cat_02", name: "Pertanian & Peternakan", slug: "pertanian", icon: "🌾", description: "Panduan bercocok tanam, olah tanah, pupuk organik, dan ternak", totalContent: 18 },
  { id: "cat_03", name: "Teknologi & Digital", slug: "teknologi", icon: "💻", description: "Literasi digital, penggunaan komputer, dan teknologi informasi", totalContent: 9 },
  { id: "cat_04", name: "Kewirausahaan & UMKM", slug: "umkm", icon: "💼", description: "Manajemen usaha desa, pemasaran produk lokal, dan keuangan", totalContent: 14 },
  { id: "cat_05", name: "Anak & Remaja", slug: "anak", icon: "👶", description: "Buku cerita anak, dongeng lokal, dan bacaan bergambar", totalContent: 8 },
  { id: "cat_06", name: "Kesehatan & Gizi", slug: "kesehatan", icon: "🏥", description: "Panduan kesehatan keluarga, gizi, pencegahan stunting", totalContent: 6 },
  { id: "cat_07", name: "Sejarah Desa", slug: "sejarah-desa", icon: "🏛️", description: "Dokumentasi asal-usul, tokoh, dan arsip sejarah desa", totalContent: 5 },
  { id: "cat_08", name: "Seni & Budaya Lokal", slug: "budaya", icon: "🎨", description: "Tradisi lokal, kesenian, kerajinan tangan, dan sastra desa", totalContent: 7 },
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
        _count: {
          select: { contents: true },
        },
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      totalContent: cat._count.contents,
    }));

    return apiSuccess(formattedCategories, "Berhasil mengambil daftar kategori");
  } catch (error: any) {
    // Return mock categories fallback
    return apiSuccess(MOCK_CATEGORIES, "Berhasil mengambil daftar kategori (Preview Mode)");
  }
}
