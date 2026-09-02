import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
  }
  throw lastError;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak. Memerlukan hak akses admin." }, { status: 403 });
    }

    const records = await executeWithRetry(() =>
      prisma.borrowRecord.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              category: true,
              coverUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    );

    return NextResponse.json({ records: records || [] });
  } catch (error: any) {
    console.error("Fetch circulation records error:", error);
    return NextResponse.json({ error: "Gagal memuat data sirkulasi dari database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const { userId: explicitUserId, userNikOrId, bookId, days = 7, notes } = body;

    if ((!explicitUserId && !userNikOrId) || !bookId) {
      return NextResponse.json({ error: "Warga dan Judul Buku wajib dipilih." }, { status: 400 });
    }

    // Find citizen
    const user = await executeWithRetry(() => {
      if (explicitUserId) {
        return prisma.user.findUnique({ where: { id: explicitUserId } });
      }
      return prisma.user.findFirst({
        where: {
          OR: [
            { email: userNikOrId.trim() },
            { id: userNikOrId.trim() },
            { name: { contains: userNikOrId.trim(), mode: "insensitive" } },
          ],
        },
      });
    });

    if (!user) {
      return NextResponse.json({ error: "Akun warga tidak ditemukan. Pastikan NIK atau nama terdaftar." }, { status: 404 });
    }

    const book = await executeWithRetry(() =>
      prisma.book.findUnique({ where: { id: bookId } })
    );

    if (!book) {
      return NextResponse.json({ error: "Buku fisik yang dipilih tidak ditemukan." }, { status: 404 });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.max(1, Number(days) || 7));

    const record = await executeWithRetry(() =>
      prisma.borrowRecord.create({
        data: {
          userId: user.id,
          bookId: book.id,
          dueDate,
          status: "BORROWED",
          notes: notes ? notes.trim() : "Buku fisik dipinjam di Balai Desa",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              category: true,
              coverUrl: true,
            },
          },
        },
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: `Peminjaman buku "${book.title}" untuk ${user.name} berhasil dicatat!`,
      record 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create borrow record error:", error);
    return NextResponse.json({ error: "Gagal mencatat peminjaman buku" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { recordId, action } = await request.json();

    if (!recordId) {
      return NextResponse.json({ error: "Record ID wajib disertakan" }, { status: 400 });
    }

    // Check if record exists
    const existing = await executeWithRetry(() =>
      prisma.borrowRecord.findUnique({
        where: { id: recordId },
        include: {
          user: true,
          book: true,
        },
      })
    );

    if (!existing) {
      return NextResponse.json({ error: "Catatan peminjaman tidak ditemukan di database." }, { status: 404 });
    }

    if (action === "RETURN") {
      const updated = await executeWithRetry(() =>
        prisma.borrowRecord.update({
          where: { id: recordId },
          data: {
            status: "RETURNED",
            returnDate: new Date(),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                image: true,
              },
            },
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                category: true,
                coverUrl: true,
              },
            },
          },
        })
      );

      // Reward points for returning on time
      try {
        await prisma.user.update({
          where: { id: existing.userId },
          data: { points: { increment: 10 } },
        });
      } catch (err) {}

      return NextResponse.json({ 
        success: true, 
        message: `Buku "${existing.book.title}" berhasil ditandai telah dikembalikan oleh ${existing.user.name}!`,
        record: updated 
      });
    }

    if (action === "EXTEND") {
      const currentDue = new Date(existing.dueDate);
      const newDueDate = new Date(currentDue.getTime() + 7 * 86400000);

      const updated = await executeWithRetry(() =>
        prisma.borrowRecord.update({
          where: { id: recordId },
          data: {
            dueDate: newDueDate,
            status: "BORROWED", // reset from OVERDUE if extended
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                image: true,
              },
            },
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                category: true,
                coverUrl: true,
              },
            },
          },
        })
      );

      return NextResponse.json({ 
        success: true, 
        message: `Masa peminjaman buku "${existing.book.title}" berhasil diperpanjang 7 hari!`,
        record: updated 
      });
    }

    return NextResponse.json({ error: "Aksi tidak valid (gunakan RETURN atau EXTEND)" }, { status: 400 });
  } catch (error: any) {
    console.error("Update borrow error:", error);
    return NextResponse.json({ error: "Gagal memperbarui status peminjaman" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID peminjaman wajib disertakan" }, { status: 400 });
    }

    await executeWithRetry(() =>
      prisma.borrowRecord.delete({
        where: { id },
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: "Catatan peminjaman berhasil dihapus dari sistem." 
    });
  } catch (error: any) {
    console.error("Delete borrow record error:", error);
    return NextResponse.json({ error: "Gagal menghapus catatan peminjaman" }, { status: 500 });
  }
}
