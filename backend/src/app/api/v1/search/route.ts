import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { ContentStatus, ContentVisibility } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    if (!query) {
      return apiSuccess([], "Kata kunci pencarian kosong", 200, {
        page,
        limit,
        totalItems: 0,
        totalPages: 0,
      });
    }

    const where: any = {
      status: ContentStatus.PUBLISHED,
      visibility: {
        in: [ContentVisibility.PUBLIC, ContentVisibility.REGISTERED],
      },
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { author: { name: { contains: query, mode: "insensitive" } } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    };

    const [totalItems, results] = await Promise.all([
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
          author: {
            select: { name: true },
          },
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return apiSuccess(results, `Berhasil mencari dengan kata kunci "${query}"`, 200, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return apiError("Gagal melakukan pencarian", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
