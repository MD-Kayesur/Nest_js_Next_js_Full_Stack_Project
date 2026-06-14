"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./hooks/store";

import { AuthInitializer } from "./AuthInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}
