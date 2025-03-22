import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Allow login and forgot-password pages without token checks
  if (pathname === "/login" || pathname === "/forgot-password") {
    return NextResponse.next();
  }

  // If no tokens, redirect to login
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Since there's no /auth/validate, assume tokens are valid and proceed
  // If a request fails with 401 later, authFetch will handle token refresh
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|login|forgot-password).*)"],
};
