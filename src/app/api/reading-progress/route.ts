import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the most recently read book
    const progress = await prisma.readingProgress.findFirst({
      where: { userId: (session.user as any).id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            chapters: {
              orderBy: { order: 'asc' },
              select: { id: true }
            }
          }
        }
      },
      orderBy: { lastRead: "desc" },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching reading progress:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookId, chapterId, pageIndex } = await request.json();
    if (!bookId) {
      return NextResponse.json({ message: "bookId is required" }, { status: 400 });
    }

    // Find out which chapter number this is based on the book's chapters
    const chapters = await prisma.chapter.findMany({
      where: { bookId },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    
    // We store the "page" as the chapter index, or actual page if using PDF
    // For text chapters, page = chapterIndex + 1
    const chapterIndex = chapters.findIndex(c => c.id === chapterId);
    const pageNumber = chapterIndex !== -1 ? chapterIndex + 1 : (pageIndex || 1);

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: {
          userId: (session.user as any).id,
          bookId,
        },
      },
      update: {
        page: pageNumber,
        lastRead: new Date(),
      },
      create: {
        userId: (session.user as any).id,
        bookId,
        page: pageNumber,
      },
    });

    return NextResponse.json({ message: "Progress updated", progress });
  } catch (error) {
    console.error("Error updating reading progress:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
