"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function Cta() {
  const router = useRouter();
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-zinc-900 w-full text-center">
      <div className="bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-purple-500/5 border border-zinc-900 rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to verify the architecture?</h2>
          <p className="text-zinc-400 mt-4 text-sm max-w-md">
            Create an account or sign in to witness dynamic cookie persistence, session hydration, and role separation in action.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Sign Up Now
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded-xl font-semibold hover:bg-zinc-900/60 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
