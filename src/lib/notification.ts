const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import { MarkAsReadResponse, NotificationsResponse, NotificationsResponseData } from "@/constant/type";

export async function getNotifications(
    page = 1,
    limit = 10,
    accessToken?: string,
  ): Promise<NotificationsResponseData> {
    const res = await fetch(
      `${API_URL}/notifications?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    const response: NotificationsResponse = await res.json();
    if (response.err !== 0) {
      throw new Error(response.message || "Failed to get notifications");
    }
    return response.data;
  }
  
  
  /**
   * Marks a single notification as read.
   * The notificationId is provided via the URL.
   */
  export async function markNotificationAsRead(
    notificationId: number,
    accessToken?: string
  ): Promise<MarkAsReadResponse["data"]> {
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PUT", // Adjust the method if your API uses PUT instead
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    const response: MarkAsReadResponse = await res.json();
    if (response.err !== 0) {
      throw new Error(response.message || "Failed to mark notification as read");
    }
    return response.data;
  }
  
  /**
   * Marks all notifications as read.
   */
  export async function markAllNotificationsAsRead(
    accessToken?: string
  ): Promise<MarkAsReadResponse["data"]> {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PUT", // Adjust the method if necessary
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    const response: MarkAsReadResponse = await res.json();
    if (response.err !== 0) {
      throw new Error(response.message || "Failed to mark all notifications as read");
    }
    return response.data;
  }