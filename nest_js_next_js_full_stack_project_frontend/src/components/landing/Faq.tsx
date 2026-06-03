"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqItem({ q, a, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-white hover:bg-zinc-900/40 transition-colors"
      >
        <span>{q}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-zinc-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 border-t border-zinc-900/50 py-5 px-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-zinc-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "How does the role-based dashboard router work?",
      a: "When a user logs in, the authentication response determines their role (USER or ADMIN). Based on this role, the root route page dynamically mounts the corresponding user workspace or the admin console.",
    },
    {
      q: "How are cookies used for security instead of localStorage?",
      a: "Cookies are configured with Lax SameSite controls and Secure attributes. This helps protect the authentication token from common cross-site scripting (XSS) access compared to simple localStorage storage.",
    },
    {
      q: "What admin operations are supported?",
      a: "Admins have access to list all registered user profiles inside the database directory. They also possess administrative deletion permissions to remove profile access.",
    },
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        <p className="text-zinc-400 mt-2 text-sm">Quick answers to clear technical questions.</p>
      </div>

      <div className="space-y-4">
        {faqItems.map((faq, idx) => (
          <FaqItem
            key={idx}
            q={faq.q}
            a={faq.a}
            isOpen={activeFaq === idx}
            onToggle={() => toggleFaq(idx)}
          />
        ))}
      </div>
    </section>
  );
}
