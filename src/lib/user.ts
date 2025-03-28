import { get, post } from "@/config/api/httpRequest/httpMethod";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
  UserResponse,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getUserById(id: number): Promise<User> {
  try {
    const url = `/users/${id}`;
    const response = await get<UserResponse>(url);
    return response.data;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch user");
  }
}

export async function changePassword(
  changePasswordData: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  try {
    const url = "/auth/update-password";
    const response = await post<ChangePasswordRequest, ChangePasswordResponse>(
      url,
      changePasswordData
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to change password");
  }
}
