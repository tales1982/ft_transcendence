import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  email: string;
  displayName: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  status: "guest" | "authenticated";
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: "guest",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; email: string; displayName: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = {
        email: action.payload.email,
        displayName: action.payload.displayName,
      };
      state.status = "authenticated";
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.status = "guest";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
