import { get, post, remove } from "@/config/api/httpRequest/httpMethod";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteProfileImageResponse,
  ProfileIdeasResponse,
  ProfileResponse,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const token = Cookies.get("accessToken");

export interface UploadImageResponse {
  err: number;
  message: string;
  data: {
    fileId: string;
    fileName: string;
  }[];
}

export async function updateProfileImage(file: File) {
  try {
    const form = new FormData();
    form.append("profileImage", file);
    console.log("profile form:", form);
    const url = "/auth/profile/image";
    const response = await post<FormData, UploadImageResponse>(url, form);
    console.log("res : ", response);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to upload profile image!");
  }
}

export async function deleteProfileImage(): Promise<DeleteProfileImageResponse> {
  try {
    const url = `/auth/profile/image`;
    const response = await remove<DeleteProfileImageResponse>(url);
    console.log("remove", response)
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete profile image");
  }
}

export async function fetchProfileImage(userId: number | null): Promise<Blob> {
  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(`${API_URL}/auth/profile/image/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(typeof text === "string" ? text : "Failed to load image");
  }
  return resp.blob();
}

/**
 * Convenience: get an object-URL you can pass to <img src=…>
 */
export async function getProfileImageURL(userId: number | null): Promise<string> {
  const blob = await fetchProfileImage(userId);
  return URL.createObjectURL(blob);
}

export async function getProfileIdeas(): Promise<ProfileIdeasResponse> {
  try {
    const url = "/auth/profile/idea";
    const response = await get<ProfileIdeasResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch profile ideas");
  }
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const url = `/auth/profile`;
    const response = await get<ProfileResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch user profile");
  }
}

export async function changePassword(
  changePasswordData: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  try {
    const url = "/auth/update-password";
    const response = await post<ChangePasswordRequest, ChangePasswordResponse>(
      url,
      changePasswordData
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to change password");
  }
}
