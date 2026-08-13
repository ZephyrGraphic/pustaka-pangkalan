import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        book: {
          select: {
            title: true,
            id: true,
            chapters: {
              select: { id: true, order: true, title: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Bab tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal peladen" },
      { status: 500 }
    );
  }
}
