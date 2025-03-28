import { get } from "@/config/api/httpRequest/httpMethod";
import { User, UserResponse } from "@/constant/type";

export async function getUserById(id: number): Promise<User> {
  try {
    const url = `/users/${id}`;
    const response = await get<UserResponse>(url);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      throw new Error(
        (error as { message: string }).message || "Failed to fetch user"
      );
    }
    throw new Error("Failed to fetch user");
  }
}
