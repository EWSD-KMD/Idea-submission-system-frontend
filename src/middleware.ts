import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { pathname, searchParams } = req.nextUrl;

  const redirectIfAuthenticated = ["/login", "/forgot-password"];
  const isRedirectRoute = redirectIfAuthenticated.includes(pathname);

  if (isRedirectRoute && !accessToken) {
    console.log("Unauthenticated, allowing access to:", pathname);
    return NextResponse.next();
  }

  if (pathname === "/users/forget-password") {
    const token = searchParams.get("token");
    if (!token) {
      console.log("No token, redirecting to /forgot-password");
      return NextResponse.redirect(new URL("/forgot-password", req.url));
    }
    console.log("Token present, allowing /users/forget-password");
    return NextResponse.next();
  }

  if (!accessToken) {
    console.log("No accessToken, redirecting to /login from:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isRedirectRoute && accessToken) {
    console.log("Authenticated, redirecting to / from:", pathname);
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("Authenticated, allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|api|favicon.ico).*)"],
};
