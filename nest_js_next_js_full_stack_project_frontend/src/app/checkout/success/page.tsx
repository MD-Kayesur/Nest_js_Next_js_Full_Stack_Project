"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Header } from "../../../components/landing/Header";
import { Footer } from "../../../components/landing/Footer";
import { ParticleBurst } from "../../../components/animations/ParticleBurst";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("type");

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-20 z-10 relative text-center">
        {/* Ambient Glow / Particle Animation */}
        <ParticleBurst />

        <div className="relative z-10 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-2xl flex flex-col items-center w-full max-w-2xl">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 mb-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-zinc-400 text-lg max-w-md mb-8">
            Thank you for your purchase. We've received your order and are getting it ready to be shipped securely.
          </p>

          <div className="w-full bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50 mb-10 text-left flex items-start gap-4">
            <Package className="w-6 h-6 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-white font-bold mb-1">What happens next?</h3>
              {paymentType === 'cod' ? (
                <p className="text-sm text-zinc-400 leading-relaxed">
                  You will be contacted regarding your manual payment/cash on delivery. You can track your order status from your dashboard.
                </p>
              ) : (
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Your secure credit card payment was processed successfully. You will receive an email confirmation shortly, and you can track your order from your dashboard.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/products"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              <span>Go to Homepage</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
