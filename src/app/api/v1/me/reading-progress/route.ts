import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { getAuthUser } from "@/lib/jwt";
import { ReadingStatus } from "@prisma/client";

// GET user reading progress for specific content or all active progress
export async function GET(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");

    if (contentId) {
      const progress = await prisma.readingProgress.findUnique({
        where: {
          userId_contentId: {
            userId: authUser.userId,
            contentId,
          },
        },
      });

      return apiSuccess(progress || null, "Berhasil mengambil progress membaca");
    }

    const allProgress = await prisma.readingProgress.findMany({
      where: { userId: authUser.userId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            author: { select: { name: true } },
          },
        },
      },
      orderBy: { lastReadAt: "desc" },
    });

    return apiSuccess(allProgress, "Berhasil mengambil seluruh progress membaca");
  } catch (error: any) {
    console.error("GET Reading Progress Error:", error);
    return apiError("Gagal mengambil progress membaca", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

// POST / UPSERT reading progress
export async function POST(request: Request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Sesi Anda tidak valid", 401, "UNAUTHORIZED");
    }

    const body = await request.json();
    const { contentId, currentPage, totalPages } = body;

    if (!contentId || typeof currentPage !== "number" || typeof totalPages !== "number") {
      return apiError("contentId, currentPage, dan totalPages wajib diisi", 400, "VALIDATION_ERROR");
    }

    const validCurrentPage = Math.max(1, currentPage);
    const validTotalPages = Math.max(1, totalPages);
    const progressPercent = Math.min(100, Number(((validCurrentPage / validTotalPages) * 100).toFixed(1)));
    
    const status: ReadingStatus = progressPercent >= 99.0 ? ReadingStatus.COMPLETED : ReadingStatus.READING;

    const upsertedProgress = await prisma.readingProgress.upsert({
      where: {
        userId_contentId: {
          userId: authUser.userId,
          contentId,
        },
      },
      update: {
        currentPage: validCurrentPage,
        totalPages: validTotalPages,
        progressPercent,
        status,
        lastReadAt: new Date(),
      },
      create: {
        userId: authUser.userId,
        contentId,
        currentPage: validCurrentPage,
        totalPages: validTotalPages,
        progressPercent,
        status,
      },
    });

    return apiSuccess(upsertedProgress, "Progress membaca tersimpan");
  } catch (error: any) {
    console.error("POST Reading Progress Error:", error);
    return apiError("Gagal menyimpan progress membaca", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
