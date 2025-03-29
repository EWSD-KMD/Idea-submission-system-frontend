import { get, post } from "@/config/api/httpRequest/httpMethod";
import {
  CreateIdeaRequest,
  IdeaResponse,
  IdeasResponse,
  LikeIdeaResponse,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getAllIdeas(
  page: number = 1,
  limit: number = 5
): Promise<IdeasResponse> {
  try {
    const url = `/ideas?page=${page}&limit=${limit}`;
    const response = await get<IdeasResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch ideas");
  }
}

export async function getIdeaById(id:number): Promise<IdeaResponse> {
  try {
    const url = `/ideas/${id}`;
    const response = await get<IdeaResponse>(url);
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
