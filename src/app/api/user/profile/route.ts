import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

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

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { name, image, phone, address, occupation, newPin } = await request.json();

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (image !== undefined) dataToUpdate.image = image;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (address !== undefined) dataToUpdate.address = address;
    if (occupation !== undefined) dataToUpdate.occupation = occupation;
    dataToUpdate.isProfileComplete = true;

    if (newPin && newPin.length === 6) {
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
