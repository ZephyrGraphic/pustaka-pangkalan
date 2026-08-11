import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that do not require authentication
  const publicPaths = ["/login", "/register", "/api/v1/auth/login", "/api/v1/auth/register", "/sw.js", "/manifest.json"];
  
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for the auth token cookie
  const token = request.cookies.get("auth_token")?.value;

  // Paths that require authentication
  // All PWA paths (except public) and /admin require token
  const isPwaPath = pathname === "/" || pathname.startsWith("/profile") || pathname.startsWith("/explore") || pathname.startsWith("/read") || pathname.startsWith("/books");
  const isAdminPath = pathname.startsWith("/admin");

  if (!token && (isPwaPath || isAdminPath)) {
    // Redirect to login if unauthenticated
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
