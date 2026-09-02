import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, order } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama dusun tidak boleh kosong" }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Find current dusun
    const currentDusun = await (prisma as any).dusun.findUnique({
      where: { id },
    });

    if (!currentDusun) {
      return NextResponse.json({ error: "Dusun tidak ditemukan" }, { status: 404 });
    }

    // Check duplicate if name changed
    if (trimmedName.toLowerCase() !== currentDusun.name.toLowerCase()) {
      const duplicate = await (prisma as any).dusun.findUnique({
        where: { name: trimmedName },
      });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: "Nama dusun tersebut sudah digunakan" }, { status: 400 });
      }
    }

    // Update dusun
    const updatedDusun = await (prisma as any).dusun.update({
      where: { id },
      data: {
        name: trimmedName,
        order: order !== undefined ? Number(order) : currentDusun.order,
      },
    });

    // Cascade update users whose address was the old dusun name
    if (currentDusun.name !== trimmedName) {
      await prisma.user.updateMany({
        where: { address: currentDusun.name },
        data: { address: trimmedName },
      });
    }

    return NextResponse.json({
      message: "Dusun dan data domisili warga terkait berhasil diperbarui",
      dusun: updatedDusun,
    });
  } catch (error) {
    console.error("Error updating dusun:", error);
    return NextResponse.json({ error: "Gagal memperbarui dusun" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const currentDusun = await (prisma as any).dusun.findUnique({
      where: { id },
    });

    if (!currentDusun) {
      return NextResponse.json({ error: "Dusun tidak ditemukan" }, { status: 404 });
    }

    await (prisma as any).dusun.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Dusun berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting dusun:", error);
    return NextResponse.json({ error: "Gagal menghapus dusun" }, { status: 500 });
  }
}
