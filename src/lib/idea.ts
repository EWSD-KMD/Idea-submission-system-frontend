import { get, post } from "@/config/api/httpRequest/httpMethod";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Category type
export interface Category {
  id: number;
  name: string;
}

// Department type
export interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// User type
export interface User {
  id: number;
  name: string;
  email: string;
}

// Idea type
export interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  categoryId: number;
  departmentId: number;
  userId: number;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  department: Department;
  user: User;
  comments: any[];
  imageSrc?: string;
}

// Response data type
export interface IdeasResponseData {
  ideas: Idea[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
  categoryId: number;
  departmentId: number;
  userId: number;
}

// Full API response type
export interface IdeasResponse {
  err: number;
  message: string;
  data: IdeasResponseData;
}

export async function getAllIdeas(
  page: number = 1,
  limit: number = 5
): Promise<IdeasResponse> {
  try {
    const url = `/ideas?page=${page}&limit=${limit}`;
    const response = await get<IdeasResponse>(url);
    console.log("response", response);
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
