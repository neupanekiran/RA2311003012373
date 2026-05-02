import { Log } from "../logging_midd/logger";
import { Notification } from "../logging_midd/priority";

const BASE_URL = "http://20.207.122.201/evaluation-service";

export interface FetchNotificationsParams {
  token: string;
  limit?: number;
  page?: number;
  notification_type?: string;
}

export const fetchNotifications = async ({ token, limit, page, notification_type }: FetchNotificationsParams): Promise<Notification[]> => {
  try {
    const url = new URL(`${BASE_URL}/notifications`);
    if (limit) url.searchParams.append("limit", limit.toString());
    if (page) url.searchParams.append("page", page.toString());
    if (notification_type) url.searchParams.append("notification_type", notification_type);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notifications");
    }

    const data = await response.json();
    Log("frontend", "info", "notifications_service", "Successfully fetched notifications");
    return data.notifications || [];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("frontend", "error", "notifications_service", `Failed to fetch notifications: ${msg}`);
    throw error;
  }
};
