import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  const pathname = request.nextUrl.pathname;

  // Check if user is trying to access protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect to dashboard if already logged in
  if ((pathname === "/login" || pathname === "/register") && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
