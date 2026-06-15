"use client";

import React from "react";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/landing/Footer";
import { useGetMyOrdersQuery } from "../../redux/features/order/orderApi";
import { Loader2, Package, CheckCircle2, Clock, Truck, ShieldAlert } from "lucide-react";

export default function DashboardPage() {
  const { data: ordersData, isLoading } = useGetMyOrdersQuery({});
  
  // The API response shape is generally { data: [orders...] } depending on the backend controller
  const orders = ordersData?.data || ordersData || [];

  const getStatusConfig = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return { icon: <Clock className="w-5 h-5 text-amber-500" />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'Order Pending' };
      case 'PROCESSING':
        return { icon: <Package className="w-5 h-5 text-blue-500" />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'Processing' };
      case 'SHIPPED':
        return { icon: <Truck className="w-5 h-5 text-indigo-500" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'Shipped' };
      case 'DELIVERED':
        return { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'Delivered' };
      case 'CANCELLED':
        return { icon: <ShieldAlert className="w-5 h-5 text-red-500" />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'Cancelled' };
      default:
        return { icon: <Clock className="w-5 h-5 text-zinc-500" />, color: 'text-zinc-500', bg: 'bg-zinc-800/50', border: 'border-zinc-700', text: status || 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            My <span className="text-emerald-400">Dashboard</span>
          </h1>
          <p className="text-zinc-400">Track your order statuses and recent history.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="text-zinc-500 font-medium">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
            <p className="text-zinc-400">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order: any) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <div key={order.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <div className="text-sm text-zinc-500 font-medium mb-1">
                        Order #{order.orderNumber?.slice(0, 8).toUpperCase() || order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-lg font-bold text-white">
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} w-fit`}>
                      {statusConfig.icon}
                      <span className="font-bold text-sm">{statusConfig.text}</span>
                    </div>
                  </div>

                  {/* Visual Timeline Bar */}
                  <div className="mt-8 relative pt-2">
                    <div className="absolute top-4 left-0 w-full h-1 bg-zinc-800 rounded-full -z-10"></div>
                    <div className="flex justify-between relative z-10">
                      {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                        const stepStates = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                        const currentIdx = stepStates.indexOf(order.status?.toUpperCase());
                        const isCompleted = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;
                        
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full border-4 ${isCompleted ? 'bg-emerald-500 border-emerald-950' : 'bg-zinc-800 border-zinc-950'} ${isCurrent ? 'ring-2 ring-emerald-500/50' : ''}`}></div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 uppercase ${isCompleted ? 'text-emerald-400' : 'text-zinc-600'}`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
