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
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chapters: true, readers: true, bookmarks: true }
        }
      }
    });
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data buku" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validasi sederhana
    if (!data.title || !data.author || !data.description || !data.category) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    const newBook = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        category: data.category,
        coverUrl: data.coverUrl || null,
        isOffline: data.isOffline || false,
      }
    });

    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambah buku:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
