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
import { getAcademicYearById } from "../lib/academicYear";
import {
  AcademicYearsResponse,
} from "@/constant/type";

interface UserContextType {
  email: string | null;
  userName: string | null;
  role: string | null;
  academicYear: number | null;
  submissionDate: string | null;
  finalClosureDate: string | null;
  isSubmissionClose: boolean;
  isFinalClosure: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { accessToken, userId } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState<number | null>(null);
  const [submissionDate, setSubmissionDate] = useState<string | null>(null);
  const [finalClosureDate, setFinalClosureDate] = useState<string | null>(null);
  const [isSubmissionClose, setIsSubmissionClose] = useState<boolean>(false);
  const [isFinalClosure, setIsFinalClosure] = useState<boolean>(false);

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

  const refreshAcademicYear = async () => {
    // For example, assume academicYearId is fixed as 2; adjust as needed.
    const academicYearId = 2;
    try {
      const res: AcademicYearsResponse = await getAcademicYearById(academicYearId);
      if (res.err === 0 && res.data) {
        const now = new Date();
        const academicYear = res.data.year;
        const submissionDate = res.data.closureDate;
        const finalClosureDate = res.data.finalClosureDate;
        const submission = new Date(submissionDate);
        const finalClosure = new Date(finalClosureDate);
        setIsSubmissionClose(now >= submission);
        setIsFinalClosure(now >= finalClosure);
        setAcademicYear(academicYear);
        setSubmissionDate(submissionDate);
        setFinalClosureDate(finalClosureDate);
      } else {
        setIsSubmissionClose(false);
        setIsFinalClosure(false);
      }
    } catch (error) {
      console.error("Failed to fetch academic year data:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      refreshAcademicYear();
    }
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{
        email,
        userName,
        role,
        academicYear,
        submissionDate,
        finalClosureDate,
        isSubmissionClose,
        isFinalClosure,
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
