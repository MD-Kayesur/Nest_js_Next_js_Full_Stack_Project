"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Header } from "../../components/landing/Header";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  const [login, { isLoading, error }] = useLoginMutation();
  const token = useSelector((state: any) => state.auth.token);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  // Fetch Lottie animation JSON from CDN dynamically
  useEffect(() => {
    fetch("https://lottie.host/b0ba8c91-23ee-4ee4-bc84-9debf7bc1808/3Z5l15m8jG.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load Lottie");
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await login({ email, password }).unwrap();
      if (response && response.accessToken) {
        dispatch(setCredentials({ token: response.accessToken, user: response.user }));
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white selection:bg-zinc-800">
      <Header />
      
      <div className="flex-grow flex items-center justify-center p-4 relative">
        {/* Dynamic Ambient Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        {/* Left Side: Animations & Info */}
        <div className="hidden md:flex flex-col items-center justify-center p-4">
          <div className="w-80 h-80 flex items-center justify-center">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} className="w-full h-full" />
            ) : (
              // High premium CSS animated fallback loader if CDN is loading/unreachable
              <div className="relative flex items-center justify-center w-40 h-40">
                <div className="absolute inset-0 border-4 border-t-zinc-50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-1000" />
                <div className="absolute inset-2 border-4 border-b-zinc-400 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin duration-700" />
                <div className="text-zinc-500 font-medium text-xs tracking-widest uppercase animate-pulse">Loading</div>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold tracking-tight">Welcome Back</h3>
            <p className="text-zinc-400 text-sm mt-2 max-w-xs">
              Access your personalized workspace and start building high-performance projects.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Sign In</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Enter your credentials to manage your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm bg-red-950/20 border border-red-800/30 text-red-400 rounded-2xl flex items-center gap-2">
              <span>{(error as any)?.data?.message || "Invalid email or password."}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white placeholder-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-white placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded-2xl transition-all shadow-lg hover:shadow-white/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-white hover:underline font-semibold"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}
