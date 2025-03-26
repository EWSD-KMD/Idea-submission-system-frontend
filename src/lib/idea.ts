import { get } from "@/config/api/httpRequest/httpMethod";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Category type
export interface Category {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
