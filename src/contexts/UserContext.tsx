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
  /** Force a re-fetch of profile & image */
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { accessToken, userId } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string | null>(null);

  const [academicYear, setAcademicYear] = useState<number | null>(null);
  const [academicYearStartDate, setAcademicYearStartDate] = useState<
    string | null
  >(null);
  const [submissionDate, setSubmissionDate] = useState<string | null>(null);
  const [finalClosureDate, setFinalClosureDate] = useState<string | null>(null);
  const [isSubmissionClose, setIsSubmissionClose] = useState<boolean>(false);
  const [isFinalClosure, setIsFinalClosure] = useState<boolean>(false);

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageLoading, setProfileImageLoading] =
    useState<boolean>(false);

  // We keep track of the last object URL so we can revoke it
  let previousObjectUrl: string | null = null;

  const refreshProfile = async () => {
    if (!accessToken) return;

    try {
      const res = await getProfile();
      if (res.err !== 0 || !res.data) return;

      const {
        email,
        name,
        profileImage, // string fileId or null
        lastLoginTime,
        department,
        currentAcademicYear,
      } = res.data;

      // basic fields
      setEmail(email);
      setUserName(name);
      setLastLoginTime(lastLoginTime);
      setDepartmentName(department?.name ?? null);

      // year
      const { year, startDate, closureDate, finalClosureDate } =
        currentAcademicYear || {};

      setAcademicYear(year ?? null);
      setAcademicYearStartDate(startDate ?? null);
      setSubmissionDate(closureDate ?? null);
      setFinalClosureDate(finalClosureDate ?? null);

      const now = new Date();
      setIsSubmissionClose(closureDate ? now >= new Date(closureDate) : false);
      setIsFinalClosure(
        finalClosureDate ? now >= new Date(finalClosureDate) : false
      );

      // if user has an image, fetch it:
      if (profileImage) {
        setProfileImageLoading(true);
        try {
          const url = await getProfileImageURL(userId);
          // revoke old
          if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
          previousObjectUrl = url;
          setProfileImageUrl(url);
        } catch (err) {
          console.error("Failed to fetch profile image:", err);
          setProfileImageUrl(null);
        } finally {
          setProfileImageLoading(false);
        }
      } else {
        // no image -> clear
        if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
        previousObjectUrl = null;
        setProfileImageUrl(null);
        setProfileImageLoading(false);
      }
    } catch (err) {
      console.error("Error in refreshProfile()", err);
    }
  };

  // On token change, refresh once
  useEffect(() => {
    refreshProfile();

    // on unmount revoke
    return () => {
      if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
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
        refreshProfile,
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
