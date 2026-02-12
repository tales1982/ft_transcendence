import { api } from "./client";
import type {
  NotificationResponse,
  UnreadCountResponse,
  Page,
} from "../../types";

// Notifications API
export const notificationApi = {
  // Get current user's notifications (paginated)
  getNotifications: (page = 0, size = 20) =>
    api.get<Page<NotificationResponse>>("/api/notifications", {
      params: { page, size }
    }).then((res) => res.data),

  // Get unread notifications
  getUnreadNotifications: () =>
    api.get<NotificationResponse[]>("/api/notifications/unread").then((res) => res.data),

  // Get unread count
  getUnreadCount: () =>
    api.get<UnreadCountResponse>("/api/notifications/unread/count").then((res) => res.data),

  // Mark notification as read
  markAsRead: (notificationId: number) =>
    api.post(`/api/notifications/${notificationId}/read`),

  // Mark all notifications as read
  markAllAsRead: () =>
    api.post("/api/notifications/read-all"),
};
