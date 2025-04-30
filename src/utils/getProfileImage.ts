// src/hooks/useProfileImage.ts
import { useState, useEffect } from "react";
import { fetchProfileImage } from "@/lib/user";

/**
 * Fetches a user's profile image blob by userId and returns
 * an object URL you can pass straight into <img src=…> or Avatar.
 */
export function getProfileImage(userId: number) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      setLoading(true);
      try {
        const blob = await fetchProfileImage(userId);
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) setUrl(objectUrl);
      } catch (err) {
        console.error("useProfileImage:", err);
        if (isMounted) setUrl(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchImage();
    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId]);

  return { url, loading };
}
