import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    if (!data.bookId || !data.title || !data.content) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    // Get the current max order
    const lastChapter = await prisma.chapter.findFirst({
      where: { bookId: data.bookId },
      orderBy: { order: 'desc' }
    });
    
    const newOrder = lastChapter ? lastChapter.order + 1 : 1;

    const newChapter = await prisma.chapter.create({
      data: {
        bookId: data.bookId,
        title: data.title,
        content: data.content,
        order: newOrder,
      }
    });

    return NextResponse.json({ chapter: newChapter }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambah bab:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
