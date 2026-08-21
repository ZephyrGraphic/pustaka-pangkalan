import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID diperlukan" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            address: true,
            badge: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ discussions: reviews });
  } catch (error) {
    console.error("Gagal memuat diskusi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Silakan login untuk mengirim gagasan diskusi" }, { status: 401 });
    }

    const { bookId, comment, rating = 5 } = await request.json();
    const userId = (session.user as any).id;

    if (!bookId || !comment || !comment.trim()) {
      return NextResponse.json({ error: "Isi tanggapan diskusi tidak boleh kosong" }, { status: 400 });
    }

    // Upsert review/discussion
    const review = await prisma.review.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        comment: comment.trim(),
        rating,
        updatedAt: new Date(),
      },
      create: {
        userId,
        bookId,
        comment: comment.trim(),
        rating,
      },
    });

    // Reward user with +15 literacy points for community contribution
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: 15 },
      },
    });

    // Recalculate book average rating
    const allReviews = await prisma.review.findMany({
      where: { bookId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.book.update({
      where: { id: bookId },
      data: { rating: Number(avgRating.toFixed(1)) },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Gagal mengirim tanggapan diskusi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
