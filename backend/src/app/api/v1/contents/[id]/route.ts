import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";

const MOCK_DETAIL: Record<string, any> = {
  book_001: {
    id: "book_001",
    title: "Belajar Bertani Organik Lengkap",
    slug: "belajar-bertani-organik-lengkap",
    description: "Panduan praktis pembuatan pupuk kompos cair, olah tanah ramah lingkungan, dan budidaya tanaman pangan hemat biaya untuk masyarakat desa.",
    contentType: "BOOK",
    publicationYear: 2026,
    coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
    license: "VILLAGE_OWNED",
    viewCount: 343,
    author: { id: "auth_01", name: "Budi Santoso", bio: "Praktisi pertanian organik dan penyuluh tanaman desa." },
    category: { id: "cat_pertanian", name: "Pertanian & Peternakan", slug: "pertanian" },
    tags: ["Pertanian", "Organik", "Pupuk"],
    digitalAssets: [
      {
        id: "asset_001",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 2500000,
      },
    ],
    publishedAt: new Date().toISOString(),
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        digitalAssets: {
          select: {
            id: true,
            fileUrl: true,
            mimeType: true,
            fileSizeBytes: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!content) {
      if (MOCK_DETAIL[id]) {
        return apiSuccess(MOCK_DETAIL[id], "Berhasil mengambil detail konten (Preview Mode)");
      }
      return apiError("Konten tidak ditemukan", 404, "NOT_FOUND");
    }

    // Increment view count asynchronously
    prisma.content.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch((err) => console.error("Increment viewCount error:", err));

    const formattedContent = {
      id: content.id,
      title: content.title,
      slug: content.slug,
      description: content.description,
      contentType: content.contentType,
      publicationYear: content.publicationYear,
      coverUrl: content.coverUrl,
      license: content.license,
      viewCount: content.viewCount + 1,
      author: content.author ? { id: content.author.id, name: content.author.name, bio: content.author.bio } : null,
      category: { id: content.category.id, name: content.category.name, slug: content.category.slug },
      tags: content.tags.map((t) => t.tag.name),
      digitalAssets: content.digitalAssets.map((asset) => ({
        id: asset.id,
        fileUrl: asset.fileUrl,
        mimeType: asset.mimeType,
        fileSizeBytes: Number(asset.fileSizeBytes),
      })),
      publishedAt: content.publishedAt,
    };

    return apiSuccess(formattedContent, "Berhasil mengambil detail konten");
  } catch (error: any) {
    const { id } = await params;
    if (MOCK_DETAIL[id] || MOCK_DETAIL["book_001"]) {
      return apiSuccess(MOCK_DETAIL[id] || MOCK_DETAIL["book_001"], "Berhasil mengambil detail konten (Preview Mode)");
    }
    return apiError("Gagal mengambil detail konten", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
