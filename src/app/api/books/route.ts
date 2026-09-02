import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let whereClause: any = {};

    if (category && category !== "Semua") {
      whereClause.OR = [
        { category: { contains: category, mode: "insensitive" } },
        { categoryRel: { name: { contains: category, mode: "insensitive" } } },
        { categoryRel: { slug: { equals: category.toLowerCase() } } },
      ];
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
