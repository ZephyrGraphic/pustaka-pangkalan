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

    // If user is already authenticated and visits /login
    if (path === "/login") {
      if (token) {
        const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
        if (callbackUrl && !callbackUrl.startsWith("http") && !callbackUrl.includes("//")) {
          return NextResponse.redirect(new URL(callbackUrl, req.url));
        }
        // Redirect admin to admin dashboard, regular citizen to homepage
        const target = token.role === "ADMIN" ? "/admin" : "/";
        return NextResponse.redirect(new URL(target, req.url));
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
        // Protected admin routes require valid ADMIN token
        if (path.startsWith("/admin")) {
          return !!token && token.role === "ADMIN";
        }
        // Allow public and guest access; middleware function handles redirect for authenticated users on /login
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/login",
  ],
};
