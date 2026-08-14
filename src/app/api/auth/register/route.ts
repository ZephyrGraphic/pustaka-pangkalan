import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nik, name, pin, image, phone, address, occupation } = body;

    if (!nik || !name) {
      return NextResponse.json(
        { message: "NIK dan Nama Lengkap wajib diisi" },
        { status: 400 }
      );
    }

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return NextResponse.json(
        { message: "NIK harus terdiri dari 16 digit angka" },
        { status: 400 }
      );
    }

    // Cek apakah NIK sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: nik },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "NIK ini sudah terdaftar. Silakan langsung Masuk." },
        { status: 400 }
      );
    }

    const pinToHash = pin && pin.length === 6 ? pin : nik;
    const hashedPassword = await bcrypt.hash(pinToHash, 10);

    const user = await prisma.user.create({
      data: {
        email: nik,
        name,
        password: hashedPassword,
        image: image || null,
        phone: phone || null,
        address: address || null,
        occupation: occupation || null,
        isProfileComplete: Boolean(phone || address || occupation || image),
      },
    });

    return NextResponse.json(
      { 
        message: "Registrasi berhasil", 
        user: { 
          id: user.id, 
          nik: user.email, 
          name: user.name,
          image: user.image,
          isProfileComplete: user.isProfileComplete
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
