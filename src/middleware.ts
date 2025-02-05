import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  // ✅ Redirect authenticated users away from login, register, or verify pages
  if (
    token &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/register") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Protect private pages (only allow access if authenticated)
  const protectedRoutes = ["/dashboard",  "/settings", "/payment"];
  if (!token && protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware only to specific routes (Prevents unnecessary API checks)
export const config = {
  matcher: ["/dashboard/:path*",  "/settings/:path*", "/login", "/register", "/verify", "/payment/:path*"],
};
