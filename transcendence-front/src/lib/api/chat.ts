import { api } from "./client";
import type {
  ConversationResponse,
  MessageRequest,
  MessageResponse,
  Page,
} from "../../types";

// Chat API
export const chatApi = {
  // Get current user's conversations
  getMyConversations: () =>
    api.get<ConversationResponse[]>("/api/conversations").then((res) => res.data),

  // Get conversation by ID
  getConversation: (id: number) =>
    api.get<ConversationResponse>(`/api/conversations/${id}`).then((res) => res.data),

  // Get or create conversation for a task
  getOrCreateTaskConversation: (taskId: number) =>
    api.get<ConversationResponse>(`/api/conversations/task/${taskId}`).then((res) => res.data),

  // Get messages for a conversation
  getMessages: (conversationId: number, page = 0, size = 50) =>
    api.get<Page<MessageResponse>>(`/api/conversations/${conversationId}/messages`, {
      params: { page, size }
    }).then((res) => res.data),

  // Send a message
  sendMessage: (conversationId: number, data: MessageRequest) =>
    api.post<MessageResponse>(`/api/conversations/${conversationId}/messages`, data).then((res) => res.data),

  // Mark messages as read
  markAsRead: (conversationId: number) =>
    api.post(`/api/conversations/${conversationId}/read`),
};
