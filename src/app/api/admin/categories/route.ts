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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await executeWithRetry<any[]>(() =>
      (prisma as any).category.findMany({
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { books: true },
          },
        },
      })
    );

    const formatted = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon || "BookOpen",
      order: c.order,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      bookCount: c._count?.books || 0,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error: any) {
    console.error("Admin fetch categories error:", error);
    return NextResponse.json({ error: "Gagal mengambil data kategori" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    // Check duplicate name or slug
    const existing = await executeWithRetry(() =>
      (prisma as any).category.findFirst({
        where: {
          OR: [
            { name: { equals: trimmedName, mode: "insensitive" } },
            { slug: { equals: slug, mode: "insensitive" } },
          ],
        },
      })
    );

    if (existing) {
      return NextResponse.json(
        { error: `Kategori dengan nama atau slug "${trimmedName}" sudah ada.` },
        { status: 409 }
      );
    }

    let finalOrder = order;
    if (finalOrder === undefined) {
      const highest = await executeWithRetry<any>(() =>
        (prisma as any).category.findFirst({
          orderBy: { order: "desc" },
          select: { order: true },
        })
      );
      finalOrder = (highest?.order || 0) + 1;
    }

    const newCategory = await executeWithRetry<any>(() =>
      (prisma as any).category.create({
        data: {
          name: trimmedName,
          slug,
          description: description?.trim() || null,
          icon: icon?.trim() || "BookOpen",
          order: finalOrder,
        },
      })
    );

    return NextResponse.json(
      { success: true, message: `Kategori "${newCategory.name}" berhasil ditambahkan.`, category: newCategory },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin create category error:", error);
    return NextResponse.json({ error: "Gagal membuat kategori baru" }, { status: 500 });
  }
}
