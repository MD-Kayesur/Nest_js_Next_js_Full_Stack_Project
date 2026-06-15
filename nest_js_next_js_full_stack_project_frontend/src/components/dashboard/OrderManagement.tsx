"use client";

import React, { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../redux/features/order/orderApi";
import { Loader2, Search, Calendar, Package, ShoppingCart } from "lucide-react";

export function OrderManagement() {
  const { data: ordersData, isLoading, isError, error } = useGetAllOrdersQuery({ page: 1, limit: 50 });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [searchQuery, setSearchQuery] = useState("");

  if (isError) {
    console.error("GET ALL ORDERS ERROR:", error);
  }

  const orders = ordersData?.data || ordersData || [];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'SHIPPED': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const filteredOrders = orders.filter((o: any) =>
    `${o.orderNumber} ${o.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            <span>Order Management</span>
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            View and update the status of all customer orders across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 text-sm text-white placeholder-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-zinc-850 rounded-2xl bg-zinc-950/30">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            <span className="text-xs text-zinc-500 mt-2">Loading Orders...</span>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-red-400 text-sm">
             Failed to load orders.
          </div>
        ) : filteredOrders.length > 0 ? (
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 border-b border-zinc-850 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Date Placed</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action (Update)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-emerald-400 font-medium text-xs">#{order.orderNumber?.slice(0, 8).toUpperCase() || order.id.slice(0, 8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-300 font-mono text-xs">{order.userId.slice(0, 12)}...</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md border font-bold text-xs inline-flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-block relative">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="appearance-none bg-zinc-950 border border-zinc-700 text-white font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-all cursor-pointer hover:bg-zinc-900 text-xs"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
