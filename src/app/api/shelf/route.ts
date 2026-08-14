import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    // 1. Fetch offline books available for all
    const offlineBooks = await prisma.book.findMany({
      where: { isOffline: true },
      include: {
        chapters: {
          select: { id: true, title: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!session?.user) {
      return NextResponse.json({
        readingList: [],
        bookmarks: [],
        offlineBooks,
        stats: {
          totalRead: 0,
          totalHours: 0,
          offlineCount: offlineBooks.length,
        },
      });
    }

    const userId = (session.user as any).id;

    // 2. Fetch user's reading progress
    const readingProgress = await prisma.readingProgress.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            chapters: {
              select: { id: true, title: true, order: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { lastRead: "desc" },
    });

    // 3. Fetch user's bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            chapters: {
              select: { id: true, title: true, order: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRead = readingProgress.length;
    const totalHours = Math.round(totalRead * 2.1);

    return NextResponse.json({
      readingList: readingProgress,
      bookmarks,
      offlineBooks,
      stats: {
        totalRead,
        totalHours,
        offlineCount: offlineBooks.length,
      },
    });
  } catch (error) {
    console.error("Shelf API error:", error);
    return NextResponse.json({ error: "Gagal mengambil data rak buku" }, { status: 500 });
  }
}
