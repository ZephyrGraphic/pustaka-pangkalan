import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Silakan login untuk menyimpan poin literasi." }, { status: 401 });
  }

  try {
    const { chapterId, score, totalQuestions } = await request.json();

    if (!chapterId || typeof score !== "number" || typeof totalQuestions !== "number") {
      return NextResponse.json({ error: "Data kuis tidak valid." }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Calculate points: 50 for full score, 30 for pass, 10 for participation
    let earnedPoints = 10;
    if (score === totalQuestions) {
      earnedPoints = 50;
    } else if (score / totalQuestions >= 0.6) {
      earnedPoints = 30;
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, badge: true },
    });

    const newTotalPoints = (currentUser?.points || 0) + earnedPoints;

    // Determine badge
    let newBadge = "Warga Pembelajar";
    if (newTotalPoints >= 500) {
      newBadge = "Tokoh Teladan Desa";
    } else if (newTotalPoints >= 250) {
      newBadge = "Pakar Pengetahuan Pangkalan";
    } else if (newTotalPoints >= 100) {
      newBadge = "Ksatria Literasi Desa";
    }

    const unlockedNewBadge = currentUser?.badge !== newBadge;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: newTotalPoints,
        badge: newBadge,
      },
      select: {
        id: true,
        name: true,
        points: true,
        badge: true,
      }
    });

    return NextResponse.json({
      success: true,
      earnedPoints,
      totalPoints: updatedUser.points,
      currentBadge: updatedUser.badge,
      unlockedNewBadge,
      message: `Selamat! Anda mendapatkan +${earnedPoints} Poin Literasi Desa!`,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: "Gagal memproses hasil kuis." }, { status: 500 });
  }
}
