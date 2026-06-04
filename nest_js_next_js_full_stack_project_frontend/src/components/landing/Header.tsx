"use client";

import React from "react";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function Header() {
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/60 border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          <Shield className="w-6 h-6 text-emerald-400 animate-pulse" />
          <span>CorePortal</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Products
          </button>
          {token ? (
            <button
              onClick={() => router.push("/?view=dashboard")}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 hover:scale-[1.03] transition-all shadow-md shadow-white/5 active:scale-95"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
