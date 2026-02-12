// Chat Types

export type MessageType = "TEXT" | "SYSTEM" | "ATTACHMENT";

export interface Conversation {
  id: number;
  taskId?: number;
  createdAt: string;
  participantIds: number[];
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderEmail: string;
  content: string;
  sentAt: string;
  readAt?: string;
  type: MessageType;
}

// Request DTOs
export interface MessageRequest {
  content: string;
}

// Response DTOs
export type ConversationResponse = Conversation;
export type MessageResponse = Message;
