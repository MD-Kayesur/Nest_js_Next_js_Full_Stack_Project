import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie, removeCookie } from "../../../utils/cookies";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: "ADMIN" | "USER";
    profileImage?: string;
    phoneNumber?: string;
    address?: string;
    bio?: string;
  } | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? getCookie("access_token") : null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        setCookie("access_token", action.payload.token, 7); // Set token cookie for 7 days
      }
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        removeCookie("access_token");
      }
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
