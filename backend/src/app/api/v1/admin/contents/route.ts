import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { ContentStatus, ContentType, LicenseType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      categoryId,
      contentType,
      publicationYear,
      license,
      coverUrl,
      pdfUrl,
      status,
    } = body;

    if (!title || !categoryId) {
      return apiError("Judul dan Kategori wajib diisi", 400, "VALIDATION_ERROR");
    }

    // Generate URL Slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        description: description || null,
        categoryId,
        contentType: (contentType as ContentType) || ContentType.BOOK,
        publicationYear: publicationYear ? parseInt(publicationYear, 10) : null,
        license: (license as LicenseType) || LicenseType.VILLAGE_OWNED,
        coverUrl: coverUrl || null,
        status: (status as ContentStatus) || ContentStatus.PUBLISHED,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
        ...(pdfUrl
          ? {
              digitalAssets: {
                create: {
                  storageKey: `documents/${slug}.pdf`,
                  fileUrl: pdfUrl,
                  mimeType: "application/pdf",
                  fileSizeBytes: BigInt(1024 * 1024 * 5), // 5MB default metadata
                },
              },
            }
          : {}),
      },
      include: {
        category: true,
        digitalAssets: true,
      },
    });

    return apiSuccess(newContent, "Koleksi berhasil dibuat", 201);
  } catch (error: any) {
    console.error("Admin POST Content Error:", error);
    return apiError("Gagal membuat koleksi baru", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
