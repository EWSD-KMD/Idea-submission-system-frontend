"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { login, logout, authFetch } from "../lib/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = Cookies.get("accessToken");
    const storedRefreshToken = Cookies.get("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
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
  };

  const logoutUser = async () => {
    if (refreshToken) {
      await logout(refreshToken);
    }
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const fetchWithAuth = (url: string, options: RequestInit = {}) => {
    if (!accessToken || !refreshToken) {
      throw new Error("Not authenticated");
    }
    return authFetch(url, options, accessToken, refreshToken, (newToken) => {
      setAccessToken(newToken);
      Cookies.set("accessToken", newToken, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24,
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        loginUser,
        logoutUser,
        fetchWithAuth,
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
