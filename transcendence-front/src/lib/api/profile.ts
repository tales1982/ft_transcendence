import { api } from "./client";
import type {
  UserProfileRequest,
  UserProfileResponse,
  WalletRequest,
  WalletResponse,
} from "../../types";

// Profile API
export const profileApi = {
  // Get current user's profile
  getMyProfile: () =>
    api.get<UserProfileResponse>("/api/profile").then((res) => res.data),

  // Get user profile by ID
  getProfile: (userId: number) =>
    api.get<UserProfileResponse>(`/api/profile/${userId}`).then((res) => res.data),

  // Update current user's profile
  updateProfile: (data: UserProfileRequest) =>
    api.put<UserProfileResponse>("/api/profile", data).then((res) => res.data),
};

// Wallet API
export const walletApi = {
  // Get all user wallets
  getMyWallets: () =>
    api.get<WalletResponse[]>("/api/wallets").then((res) => res.data),

  // Get primary wallet
  getPrimaryWallet: () =>
    api.get<WalletResponse>("/api/wallets/primary").then((res) => res.data),

  // Connect a new wallet
  connectWallet: (data: WalletRequest) =>
    api.post<WalletResponse>("/api/wallets", data).then((res) => res.data),

  // Disconnect a wallet
  disconnectWallet: (walletId: number) =>
    api.delete(`/api/wallets/${walletId}`),

  // Set wallet as primary
  setPrimaryWallet: (walletId: number) =>
    api.put<WalletResponse>(`/api/wallets/${walletId}/primary`).then((res) => res.data),
};
