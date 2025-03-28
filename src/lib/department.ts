import { get } from "@/config/api/httpRequest/httpMethod";
import { DepartmentsResponse } from "@/constant/type";

export async function getDepartments(): Promise<DepartmentsResponse> {
  try {
    const url = `/departments`;
    const response = await get<DepartmentsResponse>(url);
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
