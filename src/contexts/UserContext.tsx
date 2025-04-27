// src/contexts/UserContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getProfile, getProfileImageURL } from "@/lib/user";

interface UserContextType {
  email: string | null;
  userName: string | null;
  profileImageUrl: string | null;
  profileImageLoading: boolean;
  lastLoginTime: string | null;
  departmentName: string | null;
  academicYear: number | null;
  academicYearStartDate: string | null;
  submissionDate: string | null;
  finalClosureDate: string | null;
  isSubmissionClose: boolean;
  isFinalClosure: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string | null>(null);

  const [academicYear, setAcademicYear] = useState<number | null>(null);
  const [academicYearStartDate, setAcademicYearStartDate] = useState<string | null>(null);
  const [submissionDate, setSubmissionDate] = useState<string | null>(null);
  const [finalClosureDate, setFinalClosureDate] = useState<string | null>(null);
  const [isSubmissionClose, setIsSubmissionClose] = useState<boolean>(false);
  const [isFinalClosure, setIsFinalClosure] = useState<boolean>(false);

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageLoading, setProfileImageLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let previousObjectUrl: string | null = null;

    if (!accessToken) {
      // Clear all state on logout
      setEmail(null);
      setUserName(null);
      setLastLoginTime(null);
      setDepartmentName(null);
      setAcademicYear(null);
      setAcademicYearStartDate(null);
      setSubmissionDate(null);
      setFinalClosureDate(null);
      setIsSubmissionClose(false);
      setIsFinalClosure(false);
      setProfileImageUrl(null);
      setProfileImageLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getProfile();
        if (res.err === 0 && res.data) {
          const {
            email,
            name,
            profileImage,          // this is the fileId or null
            lastLoginTime,
            department,
            currentAcademicYear,
          } = res.data;

          if (!isMounted) return;

          setEmail(email);
          setUserName(name);
          setLastLoginTime(lastLoginTime);
          setDepartmentName(department?.name ?? null);

          const {
            year,
            startDate,
            closureDate,
            finalClosureDate,
          } = currentAcademicYear || {};

          setAcademicYear(year ?? null);
          setAcademicYearStartDate(startDate ?? null);
          setSubmissionDate(closureDate ?? null);
          setFinalClosureDate(finalClosureDate ?? null);

          const now = new Date();
          if (closureDate) {
            setIsSubmissionClose(now >= new Date(closureDate));
          }
          if (finalClosureDate) {
            setIsFinalClosure(now >= new Date(finalClosureDate));
          }

          // Fetch the actual image blob and convert to URL
          if (profileImage) {
            setProfileImageLoading(true);
            try {
              const url = await getProfileImageURL();
              console.log("url", url)
              if (!isMounted) return;
              previousObjectUrl = url;
              setProfileImageUrl(url);
            } catch (err) {
              console.error("Failed to fetch profile image blob:", err);
              setProfileImageUrl(null);
            } finally {
              if (isMounted) setProfileImageLoading(false);
            }
          } else {
            setProfileImageUrl(null);
            setProfileImageLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    })();

    return () => {
      isMounted = false;
      if (previousObjectUrl) {
        URL.revokeObjectURL(previousObjectUrl);
      }
    };
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{
        email,
        userName,
        profileImageUrl,
        profileImageLoading,
        lastLoginTime,
        departmentName,
        academicYear,
        academicYearStartDate,
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
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
