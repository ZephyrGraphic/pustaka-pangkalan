import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
  }
  throw lastError;
}

export async function GET() {
  try {
    const categories = await executeWithRetry<any[]>(() =>
      (prisma as any).category.findMany({
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { books: true },
          },
        },
      })
    );

    const formatted = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon || "BookOpen",
      order: c.order,
      bookCount: c._count?.books || 0,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error: any) {
    console.error("Error fetching public categories:", error);
    return NextResponse.json({ error: "Gagal memuat kategori buku" }, { status: 500 });
  }
}
