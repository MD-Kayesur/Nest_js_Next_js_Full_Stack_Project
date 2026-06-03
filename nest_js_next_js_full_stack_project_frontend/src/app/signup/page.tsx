"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  const [register, { isLoading, error }] = useRegisterMutation();
  const token = useSelector((state: any) => state.auth.token);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  // Fetch Lottie animation JSON from CDN dynamically
  useEffect(() => {
    fetch("https://lottie.host/e2c0e863-8a30-4e20-9111-e6e22cfef03e/dJjVfW8e6Q.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load Lottie");
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response: any = await register({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      if (response && response.accessToken) {
        dispatch(setCredentials({ token: response.accessToken, user: response.user }));
        router.push("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white selection:bg-zinc-800">
      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-850/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        {/* Left Side: Animations & Info */}
        <div className="hidden md:flex flex-col items-center justify-center p-4">
          <div className="w-80 h-80 flex items-center justify-center">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} className="w-full h-full" />
            ) : (
              <div className="relative flex items-center justify-center w-40 h-40">
                <div className="absolute inset-0 border-4 border-t-zinc-50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-1000" />
                <div className="absolute inset-2 border-4 border-b-zinc-400 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin duration-700" />
                <div className="text-zinc-500 font-medium text-xs tracking-widest uppercase animate-pulse">Loading</div>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold tracking-tight">Create Account</h3>
            <p className="text-zinc-400 text-sm mt-2 max-w-xs">
              Join us to deploy, manage, and scale your application operations with ease.
            </p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Sign Up</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Please enter your details to create an account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 text-sm bg-red-950/20 border border-red-800/30 text-red-400 rounded-2xl flex items-center gap-2">
              <span>{(error as any)?.data?.message || "Registration failed. Try checking details or a different email."}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-sm text-white placeholder-zinc-650"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-sm text-white placeholder-zinc-650"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-sm text-white placeholder-zinc-650"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars (A, a, 1, !)"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-sm text-white placeholder-zinc-650"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all text-sm text-white placeholder-zinc-650"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all shadow-lg hover:shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-white hover:underline font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
