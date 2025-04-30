import { get, post, put, remove } from "@/config/api/httpRequest/httpMethod";
import {
  CreateIdeaRequest,
  DeleteIdeaResponse,
  FileUploadResponse,
  GetAllIdeasParams,
  IdeaDetailResponse,
  IdeasResponse,
  LikeIdeaResponse,
  ReportIdeaRequest,
  ReportIdeaResponse,
  UpdateIdeaRequest,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllIdeas({
  page = 1,
  limit = 5,
  sortBy,
  departmentId,
  categoryId,
  status = "SHOW",
  userId,
}: GetAllIdeasParams = {}): Promise<IdeasResponse> {
  // Create base params object
  const baseParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (userId) {
    baseParams.userId = userId.toString();
  }
  if (sortBy && sortBy !== "latest") {
    baseParams.sortBy = sortBy;
  }
  if (departmentId && departmentId !== "allDept") {
    baseParams.departmentId = departmentId;
  }
  if (categoryId && categoryId !== "allCtg") {
    baseParams.categoryId = categoryId;
  }
  if (status) {
    baseParams.status = status;
  }

  const queryParams = new URLSearchParams(baseParams);

  try {
    const url = `/ideas?${queryParams.toString()}`;
    console.log("url",url)
    const response = await get<IdeasResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch ideas");
  }
}

export async function getIdeaById(ideaId: number): Promise<IdeaDetailResponse> {
  try {
    const url = `/ideas/${ideaId}`;
    const response = await get<IdeaDetailResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch idea");
  }
}

export async function createIdea(ideaData: CreateIdeaRequest) {
  try {
    const url = "/ideas";

    const response = await post<CreateIdeaRequest, IdeasResponse>(
      url,
      ideaData
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create idea");
  }
}

export async function updateIdea(
  ideaId: number,
  ideaData: UpdateIdeaRequest
): Promise<IdeaDetailResponse> {
  try {
    const url = `/ideas/${ideaId}`;
    const response = await put<UpdateIdeaRequest, IdeaDetailResponse>(
      url,
      ideaData
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update idea");
  }
}

export async function uploadIdeaFile(fileData: FormData) {
  try {
    const url = "/ideas/file/upload";
    const response = await post<FormData, FileUploadResponse>(url, fileData);
    console.log("res : ", response);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to upload file!");
  }
}

export async function getIdeaFile(fileId: string): Promise<Blob> {
  try {
    const url = `${API_URL}/ideas/file/view/${fileId}`;
    console.log("File ID", fileId);

    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (!accessToken || !refreshToken) {
      throw new Error("Not authenticated");
    }

    // Use native fetch so you can handle the response as a Blob
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      // Try to parse error info, if available
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));
      console.error("Error response data:", errorData);
      throw new Error(
        errorData.message || "An error occurred while fetching the file"
      );
    }

    const blob = await response.blob();
    console.log("Blob received:", blob);
    return blob;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch file!");
  }
}

export async function downloadFile(fileId: string): Promise<Blob> {
  try {
    const url = `${API_URL}/ideas/file/download/${fileId}`;
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (!accessToken || !refreshToken) {
      throw new Error("Not authenticated");
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      // Try to parse error message from response.
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || "Failed to download file");
    }
    // Convert response to a Blob.
    return await response.blob();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      throw new Error((error as any).message);
    }
    throw new Error("An unexpected error occurred while downloading the file.");
  }
}

export async function deleteIdea(ideaId: number): Promise<DeleteIdeaResponse> {
  try {
    const url = `/ideas/${ideaId}`;
    const response = await remove<DeleteIdeaResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete idea");
  }
}

export async function LikeIdea(ideaId: number): Promise<LikeIdeaResponse> {
  const url = `/ideas/${ideaId}/like`;
  try {
    const response = await post<null, LikeIdeaResponse>(url, null);
    return response;
  } catch (error: unknown) {
    console.log("error:", error);
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to like idea");
  }
}

export async function DislikeIdea(ideaId: number): Promise<LikeIdeaResponse> {
  const url = `/ideas/${ideaId}/dislike`;
  try {
    const response = await post<null, LikeIdeaResponse>(url, null);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to dislike idea");
  }
}

export async function reportIdea(
  ideaId: number,
  reportData: ReportIdeaRequest
): Promise<ReportIdeaResponse> {
  try {
    const url = `/ideas/${ideaId}/report`;
    const response = await post<ReportIdeaRequest, ReportIdeaResponse>(
      url,
      reportData
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to report idea");
  }
}
