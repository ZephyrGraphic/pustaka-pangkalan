import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/response";
import { getAuthUser } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const jwtUser = getAuthUser(request);
    if (!jwtUser) {
      return apiError("Sesi Anda tidak valid atau telah kadaluarsa", 401, "UNAUTHORIZED");
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtUser.userId },
        include: { role: true },
      });

      if (user) {
        return apiSuccess(
          {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role.name,
            avatarUrl: user.avatarUrl,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
          },
          "Berhasil mengambil profil pengguna"
        );
      }
    } catch (_) {
      // Fallback for mock preview user
      return apiSuccess(
        {
          id: jwtUser.userId,
          name: "Warga Desa Kai",
          phone: jwtUser.phone || "081234567890",
          email: "kai@desa.id",
          role: jwtUser.role || "USER",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        },
        "Berhasil mengambil profil (Preview Mode)"
      );
    }

    return apiError("Pengguna tidak ditemukan", 404, "USER_NOT_FOUND");
  } catch (error: any) {
    console.error("Get Auth Me Error:", error);
    return apiError("Gagal mengambil data profil", 500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
