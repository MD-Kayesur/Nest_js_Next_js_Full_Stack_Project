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
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useDeleteUserByIdMutation,
} from "../../redux/features/user/userApi";

interface DashboardProps {
  currentUser: any;
  onSignOut: () => void;
}

export function AdminDashboard({ currentUser, onSignOut }: DashboardProps) {
  const router = useRouter();
  const { data: users, isLoading: isLoadingUsers, refetch } = useGetAllUsersQuery(undefined);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByIdMutation();
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Navigation / Header */}
        <header className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 backdrop-blur p-4 rounded-3xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold py-2 px-3.5 rounded-xl border border-zinc-700/50 hover:border-zinc-700 transition-all text-zinc-300 hover:text-white"
            >
              <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Home Page</span>
            </button>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2.5 rounded-2xl text-emerald-500">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight">Admin Console</h2>
                <p className="text-xs text-zinc-400">Identity Directory</p>
              </div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-800 text-sm font-semibold py-2 px-4 rounded-2xl border border-zinc-700/50 hover:border-zinc-700 transition-all text-zinc-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Directory Layout */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <span>User Database Management</span>
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Perform directory administrative actions and view account roles.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 text-sm text-white placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-zinc-850 rounded-2xl bg-zinc-950/30">
            {isLoadingUsers ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                <span className="text-xs text-zinc-500 mt-2">Loading Directory...</span>
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              <table className="w-full border-collapse text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/60 border-b border-zinc-850 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs">
                            {u.firstName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-xs text-zinc-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          u.role === "ADMIN" 
                            ? "bg-emerald-950/30 border border-emerald-800/40 text-emerald-400"
                            : "bg-zinc-850 border border-zinc-700 text-zinc-300"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{u.phoneNumber || "-"}</td>
                      <td className="px-6 py-4 text-zinc-400 truncate max-w-xs">{u.address || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={isDeleting || u.id === currentUser?.id}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No users found matching the search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
