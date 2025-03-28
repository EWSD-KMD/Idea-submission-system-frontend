import { get, post } from "@/config/api/httpRequest/httpMethod";
import { CreateIdeaRequest, IdeasResponse } from "@/constant/type";

export async function getAllIdeas(
  page: number = 1,
  limit: number = 5
): Promise<IdeasResponse> {
  try {
    const url = `/ideas?page=${page}&limit=${limit}`;
    const response = await get<IdeasResponse>(url);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch ideas");
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
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error(error.message || "Failed to create idea");
  }
}
