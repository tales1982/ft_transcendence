import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { paymentApi } from "../../lib/api";
import type { TokenAccountResponse, DepositRequest, WithdrawRequest } from "../../types";

interface PaymentState {
  account: TokenAccountResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  account: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAccount = createAsyncThunk(
  "payment/fetchAccount",
  async () => {
    return await paymentApi.getMyAccount();
  }
);

export const deposit = createAsyncThunk(
  "payment/deposit",
  async (data: DepositRequest) => {
    return await paymentApi.deposit(data);
  }
);

export const withdraw = createAsyncThunk(
  "payment/withdraw",
  async (data: WithdrawRequest) => {
    return await paymentApi.withdraw(data);
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch account
    builder.addCase(fetchAccount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAccount.fulfilled, (state, action: PayloadAction<TokenAccountResponse>) => {
      state.loading = false;
      state.account = action.payload;
    });
    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch account";
    });

    // Deposit
    builder.addCase(deposit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deposit.fulfilled, (state, action: PayloadAction<TokenAccountResponse>) => {
      state.loading = false;
      state.account = action.payload;
    });
    builder.addCase(deposit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Deposit failed";
    });

    // Withdraw
    builder.addCase(withdraw.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(withdraw.fulfilled, (state, action: PayloadAction<TokenAccountResponse>) => {
      state.loading = false;
      state.account = action.payload;
    });
    builder.addCase(withdraw.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Withdrawal failed";
    });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
