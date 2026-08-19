import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: bookId } = await params;
    
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: {
          select: {
            id: true,
            title: true,
            order: true,
            content: true,
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: { readers: true }
        },
        bookmarks: session?.user ? {
          where: { userId: (session.user as any).id },
          select: { id: true }
        } : undefined
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    const isBookmarked = book.bookmarks ? book.bookmarks.length > 0 : false;
    const { bookmarks, ...bookData } = book;

    return NextResponse.json({ ...bookData, isBookmarked });
  } catch (error) {
    console.error("Error fetching book details:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal peladen" },
      { status: 500 }
    );
  }
}
