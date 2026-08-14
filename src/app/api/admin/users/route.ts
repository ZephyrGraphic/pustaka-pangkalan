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
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        email: true, // NIK
        role: true,
        _count: {
          select: { bookmarks: true, readers: true }
        }
      }
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, role } = await request.json();
    if (!userId || !role || !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ error: "Gagal memperbarui peran pengguna" }, { status: 500 });
  }
}
