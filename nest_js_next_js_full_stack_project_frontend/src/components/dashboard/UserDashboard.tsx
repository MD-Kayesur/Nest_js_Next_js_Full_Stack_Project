"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Edit2,
  CheckCircle,
  Loader2,
  Home as HomeIcon,
} from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/features/user/userApi";

interface DashboardProps {
  currentUser: any;
  onSignOut: () => void;
}

export function UserDashboard({ currentUser, onSignOut }: DashboardProps) {
  const router = useRouter();
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
              <div className="bg-zinc-800 p-2.5 rounded-2xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight">User Dashboard</h2>
                <p className="text-xs text-zinc-400">Workspace</p>
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
