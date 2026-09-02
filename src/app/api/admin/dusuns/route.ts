import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { dusunSchema } from "@/lib/validations";

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
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    const dusunsWithCount = dusuns.map((d: any) => ({
      id: d.id,
      name: d.name,
      order: d.order,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      userCount: d._count?.users || 0,
    }));

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
    const body = await request.json();
    const parsed = dusunSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, order } = parsed.data;
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

    const nextOrder = order !== undefined ? order : (maxOrderDusun?.order || 0) + 1;

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
