import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users with their address, points, and count of reading activities
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        points: true,
        badge: true,
        image: true,
        _count: {
          select: {
            readers: true,
          },
        },
      },
    });

    // Fetch all active Dusun from database
    const dbDusuns = await (prisma as any).dusun.findMany({
      orderBy: { order: "asc" },
    });

    const fallbackDusuns = [
      { name: "Dusun Pangkalan" },
      { name: "Dusun Cikajang" },
      { name: "Dusun Pasir Arangan" },
      { name: "Dusun Pasir Gombong" },
    ];

    const activeDusuns = dbDusuns && dbDusuns.length > 0 ? dbDusuns : fallbackDusuns;

    const dusunMap: { [key: string]: { points: number; members: number; booksRead: number } } = {};
    activeDusuns.forEach((d: any) => {
      dusunMap[d.name] = { points: 100, members: 2, booksRead: 5 };
    });

    // Tally real user points and reading counts
    users.forEach((user) => {
      const addr = user.address || activeDusuns[0].name;
      let matchedDusun: string = activeDusuns[0].name;
      const found = Object.keys(dusunMap).find(d => addr.toLowerCase().includes(d.toLowerCase()) || addr === d);
      if (found) {
        matchedDusun = found;
      }

      if (!dusunMap[matchedDusun]) {
        dusunMap[matchedDusun] = { points: 0, members: 0, booksRead: 0 };
      }

      dusunMap[matchedDusun].points += user.points || 50;
      dusunMap[matchedDusun].members += 1;
      dusunMap[matchedDusun].booksRead += user._count.readers || 1;
    });

    const rankedDusuns = Object.keys(dusunMap).map((dusunName, index) => ({
      dusun: dusunName,
      points: dusunMap[dusunName].points,
      members: dusunMap[dusunName].members,
      booksRead: dusunMap[dusunName].booksRead,
    })).sort((a, b) => b.points - a.points);

    // Top 5 Champion Citizens
    const topCitizens = users
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        name: u.name,
        points: u.points || 0,
        badge: u.badge || "Warga Pembelajar",
        image: u.image,
        dusun: u.address || "Dusun I",
      }));

    return NextResponse.json({
      dusuns: rankedDusuns,
      topCitizens,
    });
  } catch (error) {
    console.error("Gagal memuat data liga literasi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
