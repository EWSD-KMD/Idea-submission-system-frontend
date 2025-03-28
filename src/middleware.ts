import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/users/forget-password"];
// Define maximum number of redirects to prevent loops
const MAX_REDIRECTS = 3;

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const redirectCount = parseInt(
    req.cookies.get("redirectCount")?.value || "0"
  );

  // Prevent redirect loops
  if (redirectCount >= MAX_REDIRECTS) {
    // Clear redirect count and tokens
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("redirectCount");
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Handle public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (accessToken && refreshToken) {
      // If authenticated, redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Handle password reset route specifically
  if (pathname === "/users/forget-password") {
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/forgot-password", req.url));
    }
    return NextResponse.next();
  }

  if (!accessToken || !refreshToken) {
    const response = NextResponse.redirect(new URL("/login", req.url));

    response.cookies.set("redirectCount", String(redirectCount + 1), {
      maxAge: 30,
    });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.delete("redirectCount");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
