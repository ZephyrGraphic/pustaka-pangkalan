import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Perpustakaan Digital Desa API Service is Healthy",
      data: {
        status: "ok",
        version: "v1.0.0",
        timestamp: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
}
