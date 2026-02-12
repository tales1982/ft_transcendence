// Notification Types

export type NotificationType = "NEW_MESSAGE" | "TASK_UPDATE" | "PAYMENT";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

// Response DTOs
export type NotificationResponse = Notification;

export interface UnreadCountResponse {
  count: number;
}
