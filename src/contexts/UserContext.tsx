"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getUserById } from "../lib/user";

interface UserContextType {
  email: string | null;
  userName: string | null;
  role: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { accessToken, userId } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (userId && accessToken) {
      getUserById(userId)
        .then((user) => {
          if (user) {
            setEmail(user.email);
            setUserName(user.name);
            setRole(user.role.name);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          setEmail(null);
          setUserName(null);
          setRole(null);
        });
    } else {
      setEmail(null);
      setUserName(null);
      setRole(null);
    }
  }, [userId, accessToken]);

  return (
    <UserContext.Provider
      value={{
        email,
        userName,
        role,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
