import { get } from "@/config/api/httpRequest/httpMethod";
import { AcademicYearsResponse } from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getAcademicYearById(yearId: number): Promise<AcademicYearsResponse> {
  try {
    const url = `/academicYears/${yearId}`;
    const response = await get<AcademicYearsResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch Academic Year");
  }
}