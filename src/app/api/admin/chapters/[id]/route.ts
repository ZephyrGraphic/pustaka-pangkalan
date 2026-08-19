import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, order } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan isi bab wajib diisi" }, { status: 400 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        content,
        ...(typeof order === "number" ? { order } : {}),
      },
    });

    return NextResponse.json({ chapter: updatedChapter });
  } catch (error) {
    console.error("Gagal memperbarui bab:", error);
    return NextResponse.json({ error: "Gagal memperbarui bab" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.chapter.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal menghapus bab:", error);
    return NextResponse.json({ error: "Gagal menghapus bab" }, { status: 500 });
  }
}
