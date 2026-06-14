"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Shield, MapPin, CreditCard, Lock } from "lucide-react";
import { useGetMyCartQuery, useClearCartMutation } from "../../redux/features/cart/cartApi";
import { useCreateOrderMutation } from "../../redux/features/order/orderApi";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/landing/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  
  const { data: cartData, isLoading: isLoadingCart } = useGetMyCartQuery(undefined);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");

  const cart = cartData?.data || cartData;
  const cartItems = cart?.cartItems || [];

  const subtotal = cartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isLoadingCart, cartItems, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!shippingAddress.trim()) {
      setError("Please enter a valid shipping address.");
      return;
    }

    try {
      const orderItems = cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price)
      }));

      // Create Order
      const response = await createOrder({
        items: orderItems,
        shippingAddress: shippingAddress.trim()
      }).unwrap();

      // Because Stripe is not integrated yet, we assume the payment is COD or handled manually.
      // Clear the cart
      await clearCart(undefined).unwrap();

      // Redirect to success
      router.push("/checkout/success");
      
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setError(err?.data?.message || "Failed to place order. Please try again.");
    }
  };

  if (isLoadingCart || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <span className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-sm">Loading Secure Checkout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 z-10 relative">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors w-fit font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Secure <span className="text-emerald-400">Checkout</span>
          </h1>
          <p className="text-zinc-400">Complete your order securely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Shipping Section */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Shipping Details</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                    Full Shipping Address
                  </label>
                  <textarea
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Example Street, Apt 4B, City, Country, Zip Code"
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600 resize-none"
                  />
                </div>
              </div>

              {/* Payment Section (Mock) */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                </div>

                <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl flex items-start gap-4">
                  <Lock className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Cash on Delivery / Manual Payment</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Credit card processing via Stripe is currently in development mode. Your order will be placed as pending, and payment will be collected securely upon delivery or via a manual invoice link.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isCreatingOrder}
                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Place Order Securely</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Review</h3>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.product.name}</h4>
                      <div className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</div>
                      <div className="text-emerald-400 font-semibold text-sm mt-1">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800/50 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total to Pay</span>
                  <span className="text-2xl font-extrabold text-white">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
