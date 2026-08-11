import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { getAuthUser } from "@/lib/jwt";
import { ReadingStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const [currentlyReading, completed, bookmarks] = await Promise.all([
      // Currently reading
      prisma.readingProgress.findMany({
        where: {
          userId: authUser.userId,
          status: ReadingStatus.READING,
        },
        orderBy: { lastReadAt: "desc" },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverUrl: true,
              author: { select: { name: true } },
              category: { select: { name: true } },
            },
          },
        },
      }),

      // Completed reading
      prisma.readingProgress.findMany({
        where: {
          userId: authUser.userId,
          status: ReadingStatus.COMPLETED,
        },
        orderBy: { lastReadAt: "desc" },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverUrl: true,
              author: { select: { name: true } },
            },
          },
        },
      }),

      // Bookmarks
      prisma.bookmark.findMany({
        where: { userId: authUser.userId },
        orderBy: { createdAt: "desc" },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverUrl: true,
            },
          },
        },
      }),
    ]);

    return apiSuccess(
      {
        currentlyReading: currentlyReading.map((item) => ({
          contentId: item.contentId,
          title: item.content.title,
          slug: item.content.slug,
          coverUrl: item.content.coverUrl,
          authorName: item.content.author?.name || null,
          categoryName: item.content.category.name,
          currentPage: item.currentPage,
          totalPages: item.totalPages,
          progressPercent: item.progressPercent,
          lastReadAt: item.lastReadAt,
        })),

        completed: completed.map((item) => ({
          contentId: item.contentId,
          title: item.content.title,
          slug: item.content.slug,
          coverUrl: item.content.coverUrl,
          authorName: item.content.author?.name || null,
          finishedAt: item.lastReadAt,
        })),

        bookmarks: bookmarks.map((item) => ({
          id: item.id,
          contentId: item.contentId,
          title: item.content.title,
          slug: item.content.slug,
          coverUrl: item.content.coverUrl,
          pageNumber: item.pageNumber,
          note: item.note,
          createdAt: item.createdAt,
        })),
      },
      "Berhasil mengambil data Rak Saya"
    );
  } catch (error: any) {
    console.error("GET Bookshelf Error:", error);
    return apiError("Gagal mengambil data rak", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
