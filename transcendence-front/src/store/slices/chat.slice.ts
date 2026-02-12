import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { chatApi } from "../../lib/api";
import type { ConversationResponse, MessageResponse, Page } from "../../types";

interface ChatState {
  conversations: ConversationResponse[];
  activeConversation: ConversationResponse | null;
  messages: MessageResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async () => {
    return await chatApi.getMyConversations();
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ conversationId, page = 0 }: { conversationId: number; page?: number }) => {
    return await chatApi.getMessages(conversationId, page, 50);
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, content }: { conversationId: number; content: string }) => {
    return await chatApi.sendMessage(conversationId, { content });
  }
);

export const getOrCreateTaskConversation = createAsyncThunk(
  "chat/getOrCreateTaskConversation",
  async (taskId: number) => {
    return await chatApi.getOrCreateTaskConversation(taskId);
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<ConversationResponse | null>) => {
      state.activeConversation = action.payload;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<MessageResponse>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.activeConversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action: PayloadAction<ConversationResponse[]>) => {
      state.loading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch conversations";
    });

    // Fetch messages
    builder.addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Page<MessageResponse>>) => {
      state.messages = action.payload.content.reverse();
    });

    // Send message
    builder.addCase(sendMessage.fulfilled, (state, action: PayloadAction<MessageResponse>) => {
      state.messages.push(action.payload);
    });

    // Get or create task conversation
    builder.addCase(getOrCreateTaskConversation.fulfilled, (state, action: PayloadAction<ConversationResponse>) => {
      state.activeConversation = action.payload;
      if (!state.conversations.find((c) => c.id === action.payload.id)) {
        state.conversations.push(action.payload);
      }
    });
  },
});

export const { setActiveConversation, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
