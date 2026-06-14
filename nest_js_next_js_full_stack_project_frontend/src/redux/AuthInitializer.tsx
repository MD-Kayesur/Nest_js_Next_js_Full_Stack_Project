"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setCredentials, logoutUser } from "./features/auth/authSlice";
import { useGetMeQuery } from "./features/auth/authApi";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "access_token";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  
  // Try to sync token from cookie to Redux on client-side mount
  useEffect(() => {
    const cookieToken = Cookies.get(COOKIE_NAME);
    
    if (cookieToken && !token) {
      // If cookie exists but Redux doesn't know about it (e.g. after page refresh)
      dispatch(setCredentials({ token: cookieToken, user: null }));
    } else if (!cookieToken && token) {
      // If Redux has token but cookie is missing (e.g. cookie expired)
      dispatch(logoutUser());
    }
  }, [dispatch, token]);

  // Automatically fetch user details if we have a token
  const { isError } = useGetMeQuery(undefined, {
    skip: !token, // Skip the query if there is no token yet
  });

  useEffect(() => {
    // If the token is invalid or expired on the backend, clear everything
    if (isError) {
       dispatch(logoutUser());
    }
  }, [isError, dispatch]);

  return <>{children}</>;
}
