"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Package, Search } from "lucide-react";
import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/landing/Footer";

export default function ProductsPage() {
  const { data: productsData, isLoading } = useGetAllProductsQuery(undefined);
  const products = productsData?.data || [];
  
  // Only show active products to regular users (though the backend might already filter this)
  const activeProducts = products.filter((p: any) => p.isActive !== false);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Our <span className="text-emerald-400">Products</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Explore our curated collection of premium gadgets and tech gear designed to elevate your everyday workflow.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-600 transition-all backdrop-blur"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <span className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-sm">Loading Catalog...</span>
          </div>
        ) : activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product: any) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="group h-full flex flex-col bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/80 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer backdrop-blur">
                  <div className="aspect-square w-full bg-zinc-950 relative overflow-hidden flex items-center justify-center p-6">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-zinc-800 group-hover:text-zinc-700 transition-colors" />
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
                      {product.categoryName || "Uncategorized"}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-1">
                      {product.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                      <div className="text-xl font-extrabold text-white">
                        ${Number(product.price).toFixed(2)}
                      </div>
                      <div className="text-sm font-medium text-emerald-500 group-hover:underline underline-offset-4">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center border border-zinc-800/50 rounded-3xl bg-zinc-900/20 backdrop-blur">
            <Package className="w-16 h-16 text-zinc-800 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-zinc-500 max-w-sm text-center">
              We couldn't find any products in our catalog right now. Check back later!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
