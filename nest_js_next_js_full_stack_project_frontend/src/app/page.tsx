"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "../redux/features/auth/authApi";
import { logoutUser } from "../redux/features/auth/authSlice";

import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Architecture } from "../components/landing/Architecture";
import { Faq } from "../components/landing/Faq";
import { Cta } from "../components/landing/Cta";
import { Footer } from "../components/landing/Footer";

import { UserDashboard } from "../components/dashboard/UserDashboard";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Check if we want to show dashboard
  const showDashboard = searchParams.get("view") === "dashboard";

  // Router based on user role
  if (!token || !showDashboard) {
    return <GuestView />;
  }

  const currentUser = user || getMeUser;

  if (currentUser?.role === "ADMIN") {
    return <AdminDashboard currentUser={currentUser} onSignOut={handleSignOut} />;
  }

  return <UserDashboard currentUser={currentUser} onSignOut={handleSignOut} />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <span className="mt-4 text-zinc-400 text-sm tracking-wider uppercase">Loading CorePortal...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
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

