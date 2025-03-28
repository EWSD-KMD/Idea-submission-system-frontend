import { get } from "@/config/api/httpRequest/httpMethod";
import { CategoriesResponse } from "@/constant/type";

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const url = "/categories";
    const response = get<CategoriesResponse>(url);
    return response;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      throw new Error(
        (error as { message: string }).message || "Failed to fetch user"
      );
    }
    throw new Error("Failed to fetch user");
  }
}
