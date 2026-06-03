"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./hooks/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
