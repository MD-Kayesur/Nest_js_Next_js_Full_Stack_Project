"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-24 pb-20 flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 text-xs mb-8 hover:border-zinc-700 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Full-Stack Integration Ready
      </div>
      <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
        Unified <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Identity</span> & Operations
      </h1>
      <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
        A high-performance workspace combining NestJS API services, Redux Toolkit Query lifecycle handlers, and secure browser cookies.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
        <button
          onClick={() => router.push("/signup")}
          className="flex-1 px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => router.push("/login")}
          className="flex-1 px-8 py-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded-2xl font-semibold transition-all hover:bg-zinc-900/60 hover:scale-[1.02] active:scale-[0.98]"
        >
          Access Console
        </button>
      </div>
    </section>
  );
}
