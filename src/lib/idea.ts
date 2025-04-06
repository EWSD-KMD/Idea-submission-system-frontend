import { get, post, put, remove } from "@/config/api/httpRequest/httpMethod";
import {
  CreateIdeaRequest,
  DeleteIdeaResponse,
  GetAllIdeasParams,
  IdeaDetailResponse,
  IdeasResponse,
  LikeIdeaResponse,
  ReportIdeaRequest,
  ReportIdeaResponse,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getAllIdeas({
  page = 1,
  limit = 5,
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
