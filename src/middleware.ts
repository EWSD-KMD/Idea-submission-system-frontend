import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const resetFlow = req.cookies.get("resetFlow")?.value; // Client-side flow indicator
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/forgot-password"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/reset-password") {
    if (!resetFlow) {
      return NextResponse.redirect(new URL("/forgot-password", req.url));
    }
    return NextResponse.next();
  }

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|login|forgot-password).*)"],
};
