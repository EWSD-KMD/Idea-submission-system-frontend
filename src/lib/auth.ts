import { RefreshPromiseType } from "@/config/api/httpRequest/httpConfig";
import {
  ForgotPasswordResponse,
  LoginResponse,
  ResetPasswordResponse,
} from "@/constant/type";
import Bowser from "bowser";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const parse = Bowser.getParser(window.navigator.userAgent);
  const userAgent = String(parse.getBrowserName()+"/"+parse.getBrowserVersion())
  console.log("userAgent", userAgent);
  let headers = new Headers({
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : userAgent
});
  const data = {
    email,
    password,
    source: "USER",
  };
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Agent": userAgent },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const response: LoginResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Login failed");
  }

  const { accessToken, refreshToken } = response.data;
  return { accessToken, refreshToken };
}

export async function refreshAccessToken(
  refreshToken: string
): RefreshPromiseType {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshToken,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Token refresh failed");
  }

  const response = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Refresh failed");
  }

  return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshToken,
    },
  });
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Forgot password request failed");
  }

  const response: ForgotPasswordResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Forgot password failed");
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Temp-Token": token,
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Reset password failed");
  }

  const response: ResetPasswordResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Reset failed");
  }
}
