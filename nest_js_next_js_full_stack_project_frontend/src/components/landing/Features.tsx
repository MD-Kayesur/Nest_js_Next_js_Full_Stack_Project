"use client";

import React from "react";
import { Key, Layers, UserCheck, Cpu } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800/85 p-6 rounded-3xl transition-all hover:translate-y-[-4px] hover:bg-zinc-900/40">
      <div className="p-3 bg-zinc-950 rounded-2xl w-fit border border-zinc-850 mb-5">
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-3">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export function Features() {
  const featuresList = [
    {
      icon: <Key className="w-6 h-6 text-emerald-400" />,
      title: "Secure JWT Authentication",
      desc: "Robust, role-based credentials validation. Access tokens are client-stored using secure cookies to automatically persist user state across requests.",
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      title: "Redux State Hydration",
      desc: "State synchronization using RTK Query. Instantly checks valid active sessions on page refresh, retrieving profile schemas without redundancy.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-purple-400" />,
      title: "Workspace Dashboards",
      desc: "Distinctive control hubs designed for USER and ADMIN access levels, offering user directory registries and custom bio fields.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
      title: "High-Performance Next.js",
      desc: "Built on Next.js with compilation and type-checking guards. Highly optimized routing structure, fast rendering, and clean structure.",
    },
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Engineered for Production</h2>
        <p className="text-zinc-400 mt-3 text-sm">
          Leveraging state-of-the-art architectures to deliver reliable, fast, and structured state synchronization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresList.map((feat, idx) => (
          <FeatureCard
            key={idx}
            icon={feat.icon}
            title={feat.title}
            desc={feat.desc}
          />
        ))}
      </div>
    </section>
  );
}
