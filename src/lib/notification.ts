import { get, put } from "@/config/api/httpRequest/httpMethod";
import {
  MarkAsReadResponse,
  NotificationsResponse,
  NotificationsResponseData,
} from "@/constant/type";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

export async function getNotifications(
  page: number,
  limit: number,
): Promise<NotificationsResponseData> {
  try {
    const url = `/notifications?page=${page}&limit=${limit}`;
    const response = await get<NotificationsResponse>(url);
    return response.data;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch notifications");
  }
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<MarkAsReadResponse["data"]> {
  try {
    const url = `/notifications/${notificationId}/read`;
    const response = await put<null, MarkAsReadResponse>(url, null);
    return response.data;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllNotificationsAsRead(
): Promise<MarkAsReadResponse["data"]> {
  try {
    const url = `/notifications/read-all`;
    const response = await put<null, MarkAsReadResponse>(url, null);
    return response.data;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to mark all notifications as read");
  }
}
