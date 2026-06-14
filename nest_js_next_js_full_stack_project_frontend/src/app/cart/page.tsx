"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { 
  useGetMyCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation,
  useClearCartMutation
} from "../../redux/features/cart/cartApi";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/landing/Footer";

export default function CartPage() {
  const { data: cartData, isLoading } = useGetMyCartQuery(undefined);
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const cart = cartData?.data || cartData; // Depending on how the backend wrapper looks
  const cartItems = cart?.cartItems || [];

  const subtotal = cartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap();
    } catch (err) {
      console.error("Failed to update cart item", err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(undefined).unwrap();
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Your <span className="text-emerald-400">Cart</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Review your items before proceeding to checkout.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button 
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm font-semibold text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-xl backdrop-blur border border-zinc-800"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <span className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-sm">Loading Cart...</span>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-4 backdrop-blur hover:border-emerald-500/30 transition-all duration-300">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    {item.product.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-zinc-800" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">
                          {item.product.categoryName}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          <Link href={`/products/${item.product.id}`} className="hover:text-emerald-300 transition-colors">
                            {item.product.name}
                          </Link>
                        </h3>
                        <div className="text-sm text-zinc-500">
                          ${Number(item.product.price).toFixed(2)} each
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-white">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-white text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                        className="text-zinc-500 hover:text-red-400 p-2 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Taxes</span>
                    <span className="text-white font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="mt-4 text-center">
                  <Link href="/products" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">
                    or Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center border border-zinc-800/50 rounded-3xl bg-zinc-900/20 backdrop-blur">
            <ShoppingBag className="w-20 h-20 text-zinc-800 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Your cart is empty</h3>
            <p className="text-zinc-500 max-w-sm text-center mb-8">
              Looks like you haven't added any premium gear to your cart yet.
            </p>
            <Link 
              href="/products"
              className="flex items-center gap-2 py-3 px-6 bg-white hover:bg-zinc-200 text-black font-semibold rounded-2xl transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
