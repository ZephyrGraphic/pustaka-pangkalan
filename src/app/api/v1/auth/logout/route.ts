import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSuccess } from "@/lib/response";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  
  return apiSuccess(null, "Logout berhasil");
}
