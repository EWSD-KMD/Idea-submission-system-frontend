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
  isFirstLogin: boolean;
  userId: number | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setIsFirstLogin: (isFirstLogin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedAccessToken = Cookies.get("accessToken");
    const storedRefreshToken = Cookies.get("refreshToken");
    const storedFirstLogin = Cookies.get("isFirstLogin") === "true";

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsFirstLogin(storedFirstLogin);
      try {
        const decoded: JwtPayload = jwtDecode(storedAccessToken);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Failed to decode stored token:", error);
      }
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      firstTimeLogin: isFirstTimeLogin,
    } = await login(email, password);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsFirstLogin(isFirstTimeLogin);
    Cookies.set("accessToken", newAccessToken);
    Cookies.set("refreshToken", newRefreshToken);
    Cookies.set("isFirstLogin", String(isFirstTimeLogin));

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
    Cookies.remove("isFirstLogin");
    window.location.href = "/login";
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isFirstLogin,
        setIsFirstLogin,
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
