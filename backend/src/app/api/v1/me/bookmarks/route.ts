import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { getAuthUser } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: authUser.userId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverUrl: true,
            author: { select: { name: true } },
            category: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(bookmarks, "Berhasil mengambil daftar bookmark");
  } catch (error: any) {
    console.error("GET Bookmarks Error:", error);
    return apiError("Gagal mengambil bookmark", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const body = await request.json();
    const { contentId, pageNumber, note } = body;

    if (!contentId || typeof pageNumber !== "number") {
      return apiError("contentId dan pageNumber wajib diisi", 400, "VALIDATION_ERROR");
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_contentId_pageNumber: {
          userId: authUser.userId,
          contentId,
          pageNumber,
        },
      },
      update: {
        note: note || null,
      },
      create: {
        userId: authUser.userId,
        contentId,
        pageNumber,
        note: note || null,
      },
    });

    return apiSuccess(bookmark, "Bookmark berhasil ditambahkan", 201);
  } catch (error: any) {
    console.error("POST Bookmark Error:", error);
    return apiError("Gagal menambahkan bookmark", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

export async function DELETE(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return apiError("Parameter id bookmark wajib disertakan", 400, "VALIDATION_ERROR");
    }

    const existing = await prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: authUser.userId,
      },
    });

    if (!existing) {
      return apiError("Bookmark tidak ditemukan atau bukan milik Anda", 404, "NOT_FOUND");
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return apiSuccess({ id: bookmarkId }, "Bookmark berhasil dihapus");
  } catch (error: any) {
    console.error("DELETE Bookmark Error:", error);
    return apiError("Gagal menghapus bookmark", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
