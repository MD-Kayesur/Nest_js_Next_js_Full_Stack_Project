import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "access_token";

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
  token: typeof window !== "undefined" ? Cookies.get(COOKIE_NAME) || null : null,
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
        Cookies.set(COOKIE_NAME, action.payload.token, { expires: 7, secure: true, sameSite: "lax" });
      }
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        Cookies.remove(COOKIE_NAME);
      }
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
