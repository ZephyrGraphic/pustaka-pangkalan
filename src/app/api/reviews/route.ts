import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ error: "bookId diperlukan" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avg = reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ reviews, averageRating: Math.round(avg * 10) / 10, totalReviews: reviews.length });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil ulasan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  }

  try {
    const { bookId, rating, comment } = await request.json();

    if (!bookId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const review = await prisma.review.upsert({
      where: {
        userId_bookId: {
          userId: (session.user as any).id,
          bookId,
        },
      },
      update: { rating, comment },
      create: {
        userId: (session.user as any).id,
        bookId,
        rating,
        comment,
      },
    });

    // Update book average rating
    const allReviews = await prisma.review.findMany({
      where: { bookId },
      select: { rating: true },
    });
    const avgRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;
    await prisma.book.update({
      where: { id: bookId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan ulasan:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
