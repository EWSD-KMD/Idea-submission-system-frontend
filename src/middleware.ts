import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./lib/auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const res = await fetch(`${API_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      return NextResponse.next();
    }

    if (res.status === 401) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      const response = NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      return response;
    }

    throw new Error("Unexpected response from token validation");
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|static|login|forgot-password).*)"],
};
