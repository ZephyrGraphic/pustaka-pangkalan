import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { signToken } from "@/lib/jwt";
import { RoleName } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, email } = body;

    // Validation
    if (!name || !phone || !password) {
      return apiError("Nama, nomor telepon, dan password wajib diisi", 400, "VALIDATION_ERROR");
    }

    if (password.length < 6) {
      return apiError("Password minimal 6 karakter", 400, "VALIDATION_ERROR");
    }

    // Check existing phone
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return apiError("Nomor telepon sudah terdaftar", 409, "PHONE_ALREADY_EXISTS");
    }

    // Find default USER role
    let userRole = await prisma.role.findUnique({
      where: { name: RoleName.USER },
    });

    if (!userRole) {
      userRole = await prisma.role.create({
        data: {
          name: RoleName.USER,
          description: "Warga desa pembaca",
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash,
        roleId: userRole.id,
      },
      include: {
        role: true,
      },
    });

    // Generate token
    const token = signToken({
      userId: newUser.id,
      phone: newUser.phone,
      role: newUser.role.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return apiSuccess(
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          role: newUser.role.name,
          avatarUrl: newUser.avatarUrl,
        },
      },
      "Registrasi berhasil",
      201
    );
  } catch (error: any) {
    console.error("Register API Error:", error);
    return apiError("Gagal melakukan registrasi", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
