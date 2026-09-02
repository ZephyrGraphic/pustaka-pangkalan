import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dusuns = await (prisma as any).dusun.findMany({
      orderBy: { order: "asc" },
    });

    const users = await prisma.user.findMany({
      select: { address: true },
    });

    // Calculate user count for each dusun
    const dusunsWithCount = dusuns.map((d: any) => {
      const count = users.filter((u) => u.address === d.name || u.address?.includes(d.name)).length;
      return {
        ...d,
        userCount: count,
      };
    });

    return NextResponse.json({ dusuns: dusunsWithCount });
  } catch (error) {
    console.error("Error admin fetching dusuns:", error);
    return NextResponse.json({ error: "Gagal mengambil data dusun" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, order } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama dusun tidak boleh kosong" }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check duplicate
    const existing = await (prisma as any).dusun.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      return NextResponse.json({ error: "Nama dusun sudah terdaftar" }, { status: 400 });
    }

    const maxOrderDusun = await (prisma as any).dusun.findFirst({
      orderBy: { order: "desc" },
    });

    const nextOrder = order !== undefined ? Number(order) : (maxOrderDusun?.order || 0) + 1;

    const newDusun = await (prisma as any).dusun.create({
      data: {
        name: trimmedName,
        order: nextOrder,
      },
    });

    return NextResponse.json({ message: "Dusun berhasil ditambahkan", dusun: newDusun }, { status: 201 });
  } catch (error) {
    console.error("Error creating dusun:", error);
    return NextResponse.json({ error: "Gagal menambahkan dusun" }, { status: 500 });
  }
}
