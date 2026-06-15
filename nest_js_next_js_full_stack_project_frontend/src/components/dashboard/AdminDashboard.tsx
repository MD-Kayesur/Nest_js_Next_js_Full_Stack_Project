"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  LogOut,
  UserCheck,
  Search,
  Loader2,
  Trash2,
  Home as HomeIcon,
  Package,
  Tags,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useDeleteUserByIdMutation,
} from "../../redux/features/user/userApi";
import { ProductManagement } from "./ProductManagement";
import { CategoryManagement } from "./CategoryManagement";
import { OrderManagement } from "./OrderManagement";

interface DashboardProps {
  currentUser: any;
  onSignOut: () => void;
}

export function AdminDashboard({ currentUser, onSignOut }: DashboardProps) {
  const router = useRouter();
  const { data: users, isLoading: isLoadingUsers, refetch } = useGetAllUsersQuery(undefined);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByIdMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "products" | "categories" | "orders">("users");

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user profile?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const filteredUsers = users?.filter((u: any) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-white selection:bg-zinc-800">
      
      {/* Sidebar (Left Side) */}
      <aside className="w-64 lg:w-72 flex-shrink-0 border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl flex flex-col z-20 relative">
        <div className="p-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push("/")}>
             <Shield className="w-8 h-8 text-emerald-400" />
             <span className="font-bold text-xl tracking-tight">CorePortal</span>
          </div>
          
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/50">
             <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2.5 rounded-xl text-emerald-500 shadow-inner shadow-black/50">
                   <Shield className="w-5 h-5" />
                </div>
                <div>
                   <h2 className="font-bold text-sm text-white leading-tight">Admin Console</h2>
                   <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-0.5">Global Directory</p>
                </div>
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Management</div>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
            }`}
          >
            <UserCheck className="w-5 h-5" />
            Users
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "products"
                ? "bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
            }`}
          >
            <Tags className="w-5 h-5" />
            Categories
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
            }`}
          >
            <Package className="w-5 h-5" />
            Orders
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-800/60 bg-zinc-950/50">
          <button
            onClick={onSignOut}
            className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold py-3.5 px-4 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content (Right Side) */}
      <main className="flex-1 overflow-y-auto relative w-full h-full">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full min-h-full">
          {activeTab === "users" ? (
            <div className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-emerald-500" />
                    <span>User Database Management</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1.5 max-w-lg">
                    Perform directory administrative actions and view account roles across the platform.
                  </p>
                </div>
                
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto border border-zinc-800/80 rounded-2xl bg-zinc-950/40">
                {isLoadingUsers ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
                    <span className="text-sm font-medium text-zinc-400">Loading Directory...</span>
                  </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                  <table className="w-full border-collapse text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-5">User</th>
                        <th className="px-6 py-5">Role</th>
                        <th className="px-6 py-5">Phone</th>
                        <th className="px-6 py-5">Address</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredUsers.map((u: any) => (
                        <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-emerald-500/30 transition-colors">
                                {u.firstName?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {u.firstName} {u.lastName}
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              u.role === "ADMIN" 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-zinc-800/50 border-zinc-700 text-zinc-400"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">{u.phoneNumber || "-"}</td>
                          <td className="px-6 py-4 text-zinc-400 truncate max-w-[200px]">{u.address || "-"}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(u.id)}
                              disabled={isDeleting || u.id === currentUser?.id}
                              className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center">
                    <UserCheck className="w-12 h-12 text-zinc-700 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-1">No users found</h3>
                    <p className="text-zinc-500 text-sm max-w-sm">
                      There are no users matching your current search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "products" ? (
            <ProductManagement />
          ) : activeTab === "orders" ? (
            <OrderManagement />
          ) : (
            <CategoryManagement />
          )}
        </div>
      </main>
    </div>
  );
}
