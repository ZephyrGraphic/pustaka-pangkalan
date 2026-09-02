import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
  }
  throw lastError;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const category = await executeWithRetry(() =>
      (prisma as any).category.findUnique({
        where: { id },
        include: {
          books: {
            select: { id: true, title: true, author: true, rating: true },
          },
        },
      })
    );

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Admin fetch single category error:", error);
    return NextResponse.json({ error: "Gagal mengambil data kategori" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, icon, order } = parsed.data;
    const trimmedName = name.trim();
    const slug = parsed.data.slug?.trim() || generateSlug(trimmedName);

    const existing = await executeWithRetry<any>(() =>
      (prisma as any).category.findUnique({ where: { id } })
    );

    if (!existing) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    // Check duplicate name or slug on OTHER categories
    const duplicate = await executeWithRetry(() =>
      (prisma as any).category.findFirst({
        where: {
          id: { not: id },
          OR: [
            { name: { equals: trimmedName, mode: "insensitive" } },
            { slug: { equals: slug, mode: "insensitive" } },
          ],
        },
      })
    );

    if (duplicate) {
      return NextResponse.json(
        { error: `Kategori dengan nama atau slug "${trimmedName}" sudah digunakan.` },
        { status: 409 }
      );
    }

    const updated = await executeWithRetry<any>(() =>
      (prisma as any).category.update({
        where: { id },
        data: {
          name: trimmedName,
          slug,
          description: description !== undefined ? (description ? description.trim() : null) : existing.description,
          icon: icon !== undefined ? (icon ? icon.trim() : "BookOpen") : existing.icon,
          order: order !== undefined ? order : existing.order,
        },
      })
    );

    // Cascade update category string on all linked books if name changed
    if (existing.name !== trimmedName) {
      await executeWithRetry(() =>
        prisma.book.updateMany({
          where: { categoryId: id },
          data: { category: trimmedName },
        })
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Kategori "${updated.name}" berhasil diperbarui.`,
      category: updated 
    });
  } catch (error: any) {
    console.error("Admin update category error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const category = await executeWithRetry<any>(() =>
      (prisma as any).category.findUnique({
        where: { id },
        include: { _count: { select: { books: true } } },
      })
    );

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    // Unbind books safely: set categoryId to null and category name to "Umum"
    await executeWithRetry(() =>
      prisma.book.updateMany({
        where: { categoryId: id },
        data: { categoryId: null, category: "Umum" },
      })
    );

    await executeWithRetry(() =>
      (prisma as any).category.delete({ where: { id } })
    );

    return NextResponse.json({
      success: true,
      message: `Kategori "${category.name}" berhasil dihapus.`,
    });
  } catch (error: any) {
    console.error("Admin delete category error:", error);
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
