import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { adminUserUpdateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const dusun = searchParams.get("dusun") || "";
  const role = searchParams.get("role") || "";

  try {
    const where: any = {};

    if (role && ["USER", "ADMIN"].includes(role)) {
      where.role = role;
    }

    if (dusun && dusun !== "ALL") {
      where.address = { contains: dusun, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true, // NIK
        phone: true,
        address: true,
        dusunId: true,
        dusun: { select: { id: true, name: true } },
        occupation: true,
        image: true,
        role: true,
        isProfileComplete: true,
        _count: {
          select: { bookmarks: true, readers: true, reviews: true }
        }
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
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

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, newPin, name, phone, address, occupation } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib disertakan" }, { status: 400 });
    }

    const dataToUpdate: any = {};

    if (newPin) {
      if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
        return NextResponse.json({ error: "PIN baru harus 6 digit angka" }, { status: 400 });
      }
      dataToUpdate.password = await bcrypt.hash(newPin, 10);
    } else {
      // Validate with Zod
      const parsed = adminUserUpdateSchema.safeParse({
        userId,
        name,
        phone,
        address,
        occupation,
      });

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }

      dataToUpdate.name = parsed.data.name.trim();
      if (parsed.data.phone !== undefined) dataToUpdate.phone = parsed.data.phone ? parsed.data.phone.trim() : null;
      if (parsed.data.address !== undefined) {
        dataToUpdate.address = parsed.data.address;
        // Relational foreign key lookup
        const matchedDusun = await (prisma as any).dusun.findFirst({
          where: { name: parsed.data.address },
        });
        dataToUpdate.dusunId = matchedDusun ? matchedDusun.id : null;
      }
      if (parsed.data.occupation !== undefined) {
        dataToUpdate.occupation = parsed.data.occupation ? parsed.data.occupation.trim() : null;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dusunId: true,
        dusun: { select: { id: true, name: true } },
        occupation: true,
        role: true,
        isProfileComplete: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: newPin ? "PIN pengguna berhasil di-reset!" : "Data pengguna berhasil diperbarui!",
      user: updated 
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data pengguna" }, { status: 500 });
  }
}
