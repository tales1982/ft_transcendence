import { api } from "./client";
import type {
  TokenAccountResponse,
  DepositRequest,
  WithdrawRequest,
} from "../../types";

// Payment / Token Account API
export const paymentApi = {
  // Get current user's account
  getMyAccount: () =>
    api.get<TokenAccountResponse>("/api/account").then((res) => res.data),

  // Get account by user ID
  getAccount: (userId: number) =>
    api.get<TokenAccountResponse>(`/api/account/${userId}`).then((res) => res.data),

  // Deposit tokens
  deposit: (data: DepositRequest) =>
    api.post<TokenAccountResponse>("/api/account/deposit", data).then((res) => res.data),

  // Withdraw tokens
  withdraw: (data: WithdrawRequest) =>
    api.post<TokenAccountResponse>("/api/account/withdraw", data).then((res) => res.data),
};
