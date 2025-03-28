import { get } from "@/config/api/httpRequest/httpMethod";
import { DepartmentsResponse } from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getDepartments(): Promise<DepartmentsResponse> {
  try {
    const url = `/departments`;
    const response = await get<DepartmentsResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch departments");
  }
}
