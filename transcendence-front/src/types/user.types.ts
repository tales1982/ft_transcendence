// User Types

export interface User {
  id: number;
  email: string;
  displayName?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserStatus = "ACTIVE" | "SUSPENDED";
export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  userId: number;
  fullName?: string;
  country: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  updatedAt: string;
}

export interface UserWallet {
  id: number;
  userId: number;
  chainId: number;
  address: string;
  isPrimary: boolean;
  connectedAt: string;
  disconnectedAt?: string;
}

// Request DTOs
export interface UserProfileRequest {
  fullName?: string;
  country: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface WalletRequest {
  chainId: number;
  address: string;
  isPrimary?: boolean;
}

// Response DTOs
export interface UserProfileResponse {
  userId: number;
  fullName?: string;
  country: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  updatedAt: string;
}

export interface WalletResponse {
  id: number;
  userId: number;
  chainId: number;
  address: string;
  isPrimary: boolean;
  connectedAt: string;
  disconnectedAt?: string;
}
