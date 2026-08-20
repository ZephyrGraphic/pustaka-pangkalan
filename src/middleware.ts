import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Strict role-based protection for Admin routes
    if (path.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    const response = NextResponse.next();

    // Security Headers
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow public access to non-admin routes; withAuth middleware function handles custom redirects
        if (path.startsWith("/admin")) {
          return !!token && token.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
