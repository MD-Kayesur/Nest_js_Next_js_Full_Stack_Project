"use client";

import React from "react";
import { Server, Database, Layers } from "lucide-react";

export function Architecture() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-snug">
            Secure Data Lifecycle Management
          </h2>
          <p className="text-zinc-400 mt-6 leading-relaxed">
            Our frontend interfaces with a highly secured NestJS API. Authentication state is hydrated instantly from the browser cookie jar, resolving active sessions without layout flickers.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mt-1 shrink-0">1</div>
              <div>
                <h5 className="font-semibold text-white">Client Handshake</h5>
                <p className="text-sm text-zinc-500 mt-1">Credentials verified and JWT cookie issued with secure SameSite attributes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs mt-1 shrink-0">2</div>
              <div>
                <h5 className="font-semibold text-white">Auto-Hydration Request</h5>
                <p className="text-sm text-zinc-500 mt-1">Page load initiates `getMe` to load user metadata dynamically.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs mt-1 shrink-0">3</div>
              <div>
                <h5 className="font-semibold text-white">Role-Based Rendering</h5>
                <p className="text-sm text-zinc-500 mt-1">App layout locks unauthorized access and boots the appropriate panel.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Stack Visualization Cards */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-8 rounded-3xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-3xl pointer-events-none" />
          <div className="relative space-y-6">
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="font-bold text-sm">NestJS Backend API</div>
                  <div className="text-xs text-zinc-500">Node.js server container</div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/30">Active</span>
            </div>
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-sm">Prisma ORM & PostgreSQL</div>
                  <div className="text-xs text-zinc-500">Database schemas and migration</div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/30">Synced</span>
            </div>
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-pink-400" />
                <div>
                  <div className="font-bold text-sm">RTK Query & Cookies</div>
                  <div className="text-xs text-zinc-500">Token storage and state machine</div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/30">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
