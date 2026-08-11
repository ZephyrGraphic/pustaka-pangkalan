import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, JwtPayload } from "@/lib/jwt";

/**
 * Server-side admin auth guard.
 * Call from any admin Server Component or layout to verify the user is an admin.
 * Returns the authenticated user payload, or redirects to root page.
 */
export async function requireAdmin(): Promise<JwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/");
  }

  // Only allow ADMIN, SUPER_ADMIN, LIBRARIAN roles
  const allowedRoles = ["ADMIN", "SUPER_ADMIN", "LIBRARIAN"];
  if (!allowedRoles.includes(payload.role)) {
    redirect("/");
  }

  return payload;
}
