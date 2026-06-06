"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Package, Check, ShoppingCart, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetProductByIdQuery } from "../../../redux/features/product/productApi";
import { useAddToCartMutation } from "../../../redux/features/cart/cartApi";
import { Header } from "../../../components/landing/Header";
import { Footer } from "../../../components/landing/Footer";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap the promise to access the id, standard in Next.js 13+ dynamic routes if needed
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const token = useSelector((state: any) => state.auth.token);
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const product = data?.data || data; // Assuming it might wrap in { data: ... } or just return product

  const handleAddToCart = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <span className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-sm">Loading Product...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <Package className="w-16 h-16 text-red-500/50 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-zinc-400 mb-8 max-w-md">The product you are looking for does not exist or has been removed from our catalog.</p>
          <button 
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 z-10 relative">
        <button 
          onClick={() => router.push("/products")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors w-fit font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-zinc-900/50 border border-zinc-800/50 rounded-3xl overflow-hidden flex items-center justify-center p-8 backdrop-blur relative">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <Package className="w-32 h-32 text-zinc-800" />
            )}
            
            {product.stock === 0 && (
              <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full w-fit mb-4">
              {product.categoryName || "Uncategorized"}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-emerald-400">${Number(product.price).toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-sm text-zinc-300 font-medium bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
                  <Check className="w-4 h-4 text-emerald-500" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-sm text-red-400 font-medium bg-red-950/30 px-3 py-1 rounded-full border border-red-900/50">
                  Currently Unavailable
                </span>
              )}
            </div>

            <div className="h-px w-full bg-zinc-800/60 my-6" />

            <div className="mb-8">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {product.sku && (
              <div className="mb-10 flex items-center gap-2 text-sm text-zinc-500">
                <span className="font-semibold text-zinc-400">SKU:</span> {product.sku}
              </div>
            )}

            <button 
              disabled={product.stock === 0 || isAdding}
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 shadow-xl shadow-emerald-500/20"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
              {product.stock === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
            </button>
            
            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-2 gap-4 pt-8 border-t border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Secure Checkout</div>
                  <div className="text-xs text-zinc-500">256-bit encryption</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Fast Shipping</div>
                  <div className="text-xs text-zinc-500">Ships within 24hrs</div>
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


