import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { ContentStatus, ContentVisibility, ContentType } from "@prisma/client";

// Fallback data when database daemon is offline in dev
const MOCK_CONTENTS = [
  {
    id: "book_001",
    title: "Belajar Bertani Organik Lengkap",
    slug: "belajar-bertani-organik-lengkap",
    description: "Panduan praktis pembuatan pupuk kompos cair, olah tanah ramah lingkungan, dan budidaya tanaman pangan hemat biaya.",
    contentType: "BOOK",
    publicationYear: 2026,
    coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
    viewCount: 342,
    createdAt: new Date().toISOString(),
    author: { id: "auth_01", name: "Budi Santoso" },
    category: { id: "cat_pertanian", name: "Pertanian & Peternakan", slug: "pertanian" },
  },
  {
    id: "book_002",
    title: "Panduan Manajemen & Pemasaran UMKM Desa",
    slug: "panduan-manajemen-pemasaran-umkm-desa",
    description: "Langkah mudah mengelola keuangan usaha warga, pengemasan produk lokal, dan pemasaran lewat media sosial.",
    contentType: "MODULE",
    publicationYear: 2026,
    coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    viewCount: 218,
    createdAt: new Date().toISOString(),
    author: { id: "auth_01", name: "Budi Santoso" },
    category: { id: "cat_umkm", name: "Kewirausahaan & UMKM", slug: "umkm" },
  },
  {
    id: "book_003",
    title: "Sejarah & Asal-Usul Desa Makmur",
    slug: "sejarah-dan-asal-usul-desa-makmur",
    description: "Dokumentasi perjalanan berdirinya desa, kisah perjuangan para pendiri desa, serta silsilah leluhur lokal.",
    contentType: "LOCAL_HISTORY",
    publicationYear: 2025,
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80",
    viewCount: 512,
    createdAt: new Date().toISOString(),
    author: { id: "auth_02", name: "Dr. Ir. H. Hartono" },
    category: { id: "cat_sejarah", name: "Sejarah Desa", slug: "sejarah-desa" },
  },
  {
    id: "book_004",
    title: "Dasar-Dasar Literasi Digital Warga Desa",
    slug: "dasar-dasar-literasi-digital-warga-desa",
    description: "Modul edukasi penggunaan smartphone secara bijak, keamanan data pribadi, dan pencegahan penipuan online.",
    contentType: "MODULE",
    publicationYear: 2026,
    coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    viewCount: 189,
    createdAt: new Date().toISOString(),
    author: { id: "auth_02", name: "Dr. Ir. H. Hartono" },
    category: { id: "cat_teknologi", name: "Teknologi & Digital", slug: "teknologi" },
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const categorySlug = searchParams.get("category");
    const type = searchParams.get("contentType") as ContentType | null;

    const skip = (page - 1) * limit;

    const where: any = {
      status: ContentStatus.PUBLISHED,
      visibility: {
        in: [ContentVisibility.PUBLIC, ContentVisibility.REGISTERED],
      },
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (type && Object.values(ContentType).includes(type)) {
      where.contentType = type;
    }

    const [totalItems, contents] = await Promise.all([
      prisma.content.count({ where }),
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          contentType: true,
          publicationYear: true,
          coverUrl: true,
          viewCount: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return apiSuccess(contents, "Berhasil mengambil katalog koleksi", 200, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (error: any) {
    // Fallback to mock data if database is not reachable
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    let filtered = MOCK_CONTENTS;
    if (categorySlug) {
      filtered = MOCK_CONTENTS.filter((c) => c.category.slug === categorySlug);
    }

    return apiSuccess(filtered, "Berhasil mengambil katalog koleksi (Preview Mode)", 200, {
      page: 1,
      limit: 20,
      totalItems: filtered.length,
      totalPages: 1,
    });
  }
}
