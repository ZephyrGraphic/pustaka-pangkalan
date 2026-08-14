import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalBooks = await prisma.book.count();
    const totalUsers = await prisma.user.count();
    const totalChapters = await prisma.chapter.count();
    const totalReviews = await prisma.review.count();
    const totalBookmarks = await prisma.bookmark.count();
    const totalReadingSessions = await prisma.readingProgress.count();

    // Books per category
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        rating: true,
        _count: {
          select: { readers: true, bookmarks: true, reviews: true, chapters: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const categoryCounts: { [key: string]: number } = {};
    books.forEach((b) => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat,
      count,
      percentage: Math.round((count / (totalBooks || 1)) * 100),
    }));

    // Top read books
    const topBooks = [...books]
      .sort((a, b) => b._count.readers - a._count.readers)
      .slice(0, 5);

    return NextResponse.json({
      metrics: {
        totalBooks,
        totalUsers,
        totalChapters,
        totalReviews,
        totalBookmarks,
        totalReadingSessions,
        estimatedReadingHours: Math.round(totalReadingSessions * 1.8),
      },
      categoryDistribution,
      topBooks,
      allBooks: books,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Gagal memuat analitik" }, { status: 500 });
  }
}
