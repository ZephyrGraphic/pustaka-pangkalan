import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let dusuns = await (prisma as any).dusun.findMany({
      orderBy: { order: "asc" },
    });

    // Auto-seed if empty
    if (!dusuns || dusuns.length === 0) {
      const defaultDusuns = [
        { id: "dusun_1", name: "Dusun Pangkalan", order: 1 },
        { id: "dusun_2", name: "Dusun Cikajang", order: 2 },
        { id: "dusun_3", name: "Dusun Pasir Arangan", order: 3 },
        { id: "dusun_4", name: "Dusun Pasir Gombong", order: 4 },
      ];

      for (const d of defaultDusuns) {
        await (prisma as any).dusun.upsert({
          where: { name: d.name },
          update: {},
          create: d,
        });
      }

      dusuns = await (prisma as any).dusun.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ dusuns });
  } catch (error) {
    console.error("Error fetching dusuns:", error);
    // Fallback if DB query fails
    return NextResponse.json({
      dusuns: [
        { id: "d1", name: "Dusun Pangkalan", order: 1 },
        { id: "d2", name: "Dusun Cikajang", order: 2 },
        { id: "d3", name: "Dusun Pasir Arangan", order: 3 },
        { id: "d4", name: "Dusun Pasir Gombong", order: 4 },
      ],
    });
  }
}
