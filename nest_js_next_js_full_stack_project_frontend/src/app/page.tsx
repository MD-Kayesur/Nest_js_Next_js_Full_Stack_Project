"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Shield,
  LogOut,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  Loader2,
  Key,
  Layers,
  Cpu,
  Database,
  Server,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "../redux/features/auth/authApi";
import { logoutUser } from "../redux/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserByIdMutation,
} from "../redux/features/user/userApi";

import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Architecture } from "../components/landing/Architecture";
import { Faq } from "../components/landing/Faq";
import { Cta } from "../components/landing/Cta";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  // Trigger getMe if token is present but user state is null (e.g. page refresh)
  const { data: getMeUser, isLoading: isLoadingMe } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  const [logout] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      await logout(undefined).unwrap();
    } catch (e) {
      console.warn("Logout failed on server, cleaning client state anyway");
    } finally {
      dispatch(logoutUser());
      router.push("/login");
    }
  };

  if (isLoadingMe && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <span className="mt-4 text-zinc-400 text-sm tracking-wider uppercase">Initializing Session...</span>
      </div>
    );
  }

  // Router based on user role
  if (!token) {
    return <GuestView />;
  }

  const currentUser = user || getMeUser;

  if (currentUser?.role === "ADMIN") {
    return <AdminDashboard currentUser={currentUser} onSignOut={handleSignOut} />;
  }

  return <UserDashboard currentUser={currentUser} onSignOut={handleSignOut} />;
}

// -------------------------------------------------------------
// 1. Guest Landing View
// -------------------------------------------------------------
function GuestView() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <Header />
      <Hero />
      <Features />
      <Architecture />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}

// -------------------------------------------------------------
// 2. User Profile Workspace Dashboard
// -------------------------------------------------------------
interface DashboardProps {
  currentUser: any;
  onSignOut: () => void;
}

function UserDashboard({ currentUser, onSignOut }: DashboardProps) {
  // Query specific profile details
  const { data: profile, refetch } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const activeProfile = profile || currentUser;
    if (activeProfile) {
      setFirstName(activeProfile.firstName || "");
      setLastName(activeProfile.lastName || "");
      setPhoneNumber(activeProfile.phoneNumber || "");
      setAddress(activeProfile.address || "");
      setBio(activeProfile.bio || "");
    }
  }, [profile, currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      await updateProfile({
        firstName,
        lastName,
        phoneNumber,
        address,
        bio,
      }).unwrap();
      setSuccessMsg("Profile updated successfully!");
      refetch();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Navigation / Header */}
        <header className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 backdrop-blur p-4 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-800 p-2.5 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">User Dashboard</h2>
              <p className="text-xs text-zinc-400">Workspace</p>
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

        {/* Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card: Profile Metadata Overview */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-extrabold text-white">
              {currentUser?.firstName?.charAt(0) || "U"}
            </div>
            <h3 className="mt-4 text-xl font-bold">
              {profile?.firstName || currentUser?.firstName} {profile?.lastName || currentUser?.lastName}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">{currentUser?.email}</p>
            <span className="mt-3 px-3 py-1 bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-zinc-300 rounded-full tracking-wider uppercase">
              {currentUser?.role}
            </span>

            <div className="w-full border-t border-zinc-850 mt-6 pt-6 space-y-4 text-left text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span>{profile?.phoneNumber || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{profile?.address || "No address added"}</span>
              </div>
            </div>
          </div>

          {/* Form: Profile details edit */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Edit2 className="w-5 h-5" />
              <span>Modify Workspace Profile</span>
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Update your account information and preferences below.
            </p>

            {successMsg && (
              <div className="mb-6 p-4 text-sm bg-emerald-950/20 border border-emerald-800/30 text-emerald-400 rounded-2xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  Bio / Details
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief biography..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-zinc-200 text-black font-semibold rounded-2xl transition-all shadow hover:shadow-white/5 active:scale-[0.98] disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Workspace...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. Admin Workspace Dashboard
// -------------------------------------------------------------
function AdminDashboard({ currentUser, onSignOut }: DashboardProps) {
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
          <div className="flex items-center gap-3">
            <div className="bg-zinc-800 p-2.5 rounded-2xl text-emerald-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">Admin Console</h2>
              <p className="text-xs text-zinc-400">Identity Directory</p>
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
