import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true, // NIK
        role: true,
        image: true,
        phone: true,
        address: true,
        occupation: true,
        points: true,
        badge: true,
        isProfileComplete: true,
        createdAt: true,
        _count: {
          select: {
            readers: true,
            bookmarks: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

import { profileUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, image, phone, address, occupation, newPin } = parsed.data;

    const dataToUpdate: any = {
      name: name.trim(),
      isProfileComplete: true,
    };

    if (image !== undefined) dataToUpdate.image = image;
    if (phone !== undefined) dataToUpdate.phone = phone ? phone.trim() : null;
    if (address !== undefined) {
      dataToUpdate.address = address;
      const matchedDusun = await (prisma as any).dusun.findFirst({
        where: { name: address },
      });
      dataToUpdate.dusunId = matchedDusun ? matchedDusun.id : null;
    }
    if (occupation !== undefined) {
      dataToUpdate.occupation = occupation ? occupation.trim() : null;
    }

    if (newPin) {
      dataToUpdate.password = await bcrypt.hash(newPin, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        address: true,
        dusunId: true,
        dusun: { select: { id: true, name: true } },
        occupation: true,
        isProfileComplete: true,
      },
    });

    return NextResponse.json({ user: updatedUser, message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
