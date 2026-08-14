import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rating = searchParams.get("rating");
  const search = searchParams.get("search") || "";

  try {
    const where: any = {};

    if (rating && !isNaN(parseInt(rating, 10))) {
      where.rating = parseInt(rating, 10);
    }

    if (search) {
      where.OR = [
        { comment: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { book: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            category: true,
          }
        }
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin fetch reviews error:", error);
    return NextResponse.json({ error: "Gagal mengambil data ulasan" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "ID ulasan wajib disertakan" }, { status: 400 });
    }

    // Find review to get bookId for rating recalculation
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { bookId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Ulasan tidak ditemukan" }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Recalculate book rating
    const remainingReviews = await prisma.review.findMany({
      where: { bookId: existingReview.bookId },
      select: { rating: true },
    });

    const avgRating = remainingReviews.length > 0
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
      : 0;

    await prisma.book.update({
      where: { id: existingReview.bookId },
      data: { rating: avgRating },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Ulasan berhasil dihapus dan rating buku diperbarui." 
    });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return NextResponse.json({ error: "Gagal menghapus ulasan" }, { status: 500 });
  }
}
