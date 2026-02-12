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

function loadAuthState(): AuthState {
  try {
    const token = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");
    if (token && userJson) {
      return {
        accessToken: token,
        user: JSON.parse(userJson) as User,
        status: "authenticated",
      };
    }
  } catch {
    // ignore parse errors
  }
  return { accessToken: null, user: null, status: "guest" };
}

const initialState: AuthState = loadAuthState();

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
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.status = "guest";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
