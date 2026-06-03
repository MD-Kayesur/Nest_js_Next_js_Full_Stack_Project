"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-650 bg-zinc-950 relative z-10">
      &copy; {new Date().getFullYear()} CorePortal. Deepmind Pair Programming.
    </footer>
  );
}
