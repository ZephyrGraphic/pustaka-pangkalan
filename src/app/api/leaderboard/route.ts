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

    const dusunList = [
      { name: "Dusun I (Krajan Barat)", points: 0, members: 0, booksRead: 0 },
      { name: "Dusun II (Krajan Timur)", points: 0, members: 0, booksRead: 0 },
      { name: "Dusun III (Babakan Sukamaju)", points: 0, members: 0, booksRead: 0 },
      { name: "Dusun IV (Pasir Angin)", points: 0, members: 0, booksRead: 0 },
    ];

    const dusunMap: { [key: string]: { points: number; members: number; booksRead: number } } = {
      "Dusun Pangkalan": { points: 280, members: 4, booksRead: 12 },
      "Dusun Cikajang": { points: 210, members: 3, booksRead: 9 },
      "Dusun Pasir Arangan": { points: 190, members: 3, booksRead: 8 },
      "Dusun Pasir Gombong": { points: 150, members: 2, booksRead: 6 },
    };

    // Tally real user points and reading counts
    users.forEach((user) => {
      const addr = user.address || "Dusun Pangkalan";
      let matchedDusun = Object.keys(dusunMap).find(d => addr.toLowerCase().includes(d.toLowerCase()) || addr === d);
      if (!matchedDusun) matchedDusun = "Dusun Pangkalan";

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
