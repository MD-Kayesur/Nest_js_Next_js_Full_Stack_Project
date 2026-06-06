import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "access_token";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1/",
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? Cookies.get(COOKIE_NAME) : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const {} = baseApi;