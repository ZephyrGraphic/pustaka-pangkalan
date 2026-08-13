// wait, Next.js 13+ uses next/server for NextResponse
import { NextResponse as Response } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nik, name } = body;

    if (!nik || !name) {
      return Response.json(
        { message: "NIK dan Nama wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah NIK sudah terdaftar (kita simpan di field email)
    const existingUser = await prisma.user.findUnique({
      where: { email: nik },
    });

    if (existingUser) {
      return Response.json(
        { message: "NIK sudah terdaftar" },
        { status: 400 }
      );
    }

    // Karena di desain tidak ada form password saat registrasi,
    // kita set password default (misalnya NIK itu sendiri atau '123456')
    // atau jika ada di masa depan, kita ambil dari body.
    // Sementara kita gunakan NIK sebagai password default.
    const hashedPassword = await bcrypt.hash(nik, 10);

    const user = await prisma.user.create({
      data: {
        email: nik, // menggunakan email untuk menyimpan NIK
        name,
        password: hashedPassword,
      },
    });

    return Response.json(
      { message: "Registrasi berhasil", user: { id: user.id, nik: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
