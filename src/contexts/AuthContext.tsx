"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { login, logout, forgotPassword } from "../lib/auth";

interface JwtPayload {
  userId: number;
  email: string;
  type: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedAccessToken = Cookies.get("accessToken");
    const storedRefreshToken = Cookies.get("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      try {
        const decoded: JwtPayload = jwtDecode(storedAccessToken);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Failed to decode stored token:", error);
      }
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await login(email, password);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    Cookies.set("accessToken", newAccessToken, {
      secure: true,
      sameSite: "strict",
      expires: 1 / 24,
    });
    Cookies.set("refreshToken", newRefreshToken, {
      secure: true,
      sameSite: "strict",
      expires: 7,
    });
    try {
      const decoded: JwtPayload = jwtDecode(newAccessToken);
      setUserId(decoded.userId);
    } catch (error) {
      console.error("Failed to decode token after login:", error);
    }
  };

  const logoutUser = async () => {
    if (refreshToken) {
      await logout(refreshToken);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
  };

  // const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  //   if (!accessToken || !refreshToken) {
  //     throw new Error("Not authenticated");
  //   }
  //   return authFetch(url, options, accessToken, refreshToken, (newToken) => {
  //     setAccessToken(newToken);
  //     Cookies.set("accessToken", newToken, {
  //       secure: true,
  //       sameSite: "strict",
  //       expires: 1 / 24,
  //     });
  //     try {
  //       const decoded: JwtPayload = jwtDecode(newToken);
  //       setUserId(decoded.userId);
  //     } catch (error) {
  //       console.error("Failed to decode refreshed token:", error);
  //     }
  //   });
  // };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userId,
        loginUser,
        logoutUser,
        forgotPassword: handleForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
