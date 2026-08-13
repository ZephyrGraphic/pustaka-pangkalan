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
