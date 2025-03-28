import { get } from "@/config/api/httpRequest/httpMethod";
import { CategoriesResponse } from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const url = "/categories";
    const response = get<CategoriesResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch categories");
  }
}
