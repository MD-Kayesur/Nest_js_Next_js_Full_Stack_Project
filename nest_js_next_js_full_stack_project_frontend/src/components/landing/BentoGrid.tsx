import React from 'react';
import { Globe, CreditCard, Sparkles, Coins, Building2, Repeat } from 'lucide-react';

export function BentoGrid() {
  return (
    <section className="py-24 relative max-w-7xl mx-auto px-6 z-10">
      <div className="mb-16 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          Flexible solutions for every business model.
        </h2>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Grow your business with a comprehensive set of payments and financial tools—designed to work individually or together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">
        {/* 1. Accept Payments Globally (Top Left, spans 4 cols) */}
        <div className="md:col-span-4 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-8 flex flex-col justify-end backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Globe className="w-8 h-8 text-indigo-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Accept and optimize payments globally</h3>
          <p className="text-zinc-400 max-w-md">Increase authorization rates, optimize checkout conversion, and offer local payment methods in every market.</p>
        </div>

        {/* 2. Billing Model (Top Right, spans 2 cols) */}
        <div className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-8 flex flex-col justify-end backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Repeat className="w-8 h-8 text-pink-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Enable any billing model</h3>
          <p className="text-zinc-400">Launch subscriptions, manage recurring billing, and accept one-off payments.</p>
        </div>

        {/* 3. Agentic Commerce (Middle Left, spans 2 cols) */}
        <div className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-8 flex flex-col justify-end backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Monetize through agentic commerce</h3>
          <p className="text-zinc-400">Embed financial features directly into AI workflows and agents.</p>
        </div>

        {/* 4. Card Issuing (Middle Center, spans 2 cols) */}
        <div className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-8 flex flex-col justify-end backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CreditCard className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Create a card issuing program</h3>
          <p className="text-zinc-400">Create, manage, and distribute virtual and physical cards globally.</p>
        </div>

        {/* 5. Crypto/Stablecoins (Middle Right, spans 2 cols) */}
        <div className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-8 flex flex-col justify-end backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Coins className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Access borderless money movement</h3>
          <p className="text-zinc-400">Accept and payout in stablecoins seamlessly across borders.</p>
        </div>

        {/* 6. Embedded Platforms (Bottom, spans all 6 cols) */}
        <div className="md:col-span-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative group p-10 flex flex-col md:flex-row items-start md:items-end justify-between backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="max-w-2xl">
            <Building2 className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">Embed payments in your platform</h3>
            <p className="text-zinc-400 text-lg">Onboard sellers, manage complex compliance, and route funds instantly across your marketplace or software platform.</p>
          </div>
          
          <button className="mt-8 md:mt-0 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors z-10">
            Explore Platforms
          </button>
        </div>
      </div>
    </section>
  );
}
