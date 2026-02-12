// Payment Types

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "ESCROW_LOCK" | "ESCROW_RELEASE" | "TASK_PAYOUT" | "ADJUSTMENT";
export type EscrowStatus = "LOCKED" | "RELEASED" | "REFUNDED";

export interface TokenAccount {
  userId: number;
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
  updatedAt: string;
}

export interface TokenLedger {
  id: number;
  txType: TransactionType;
  fromUserId?: number;
  toUserId?: number;
  taskId?: number;
  amount: number;
  chainTxHash?: string;
  createdAt: string;
}

export interface TaskEscrow {
  taskId: number;
  lockedAmount: number;
  status: EscrowStatus;
  lockedAt: string;
  releasedAt?: string;
}

// Request DTOs
export interface DepositRequest {
  amount: number;
  chainTxHash?: string;
}

export interface WithdrawRequest {
  amount: number;
  destinationAddress?: string;
}

// Response DTOs
export type TokenAccountResponse = TokenAccount;
