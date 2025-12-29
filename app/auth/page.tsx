"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundEffect, CapsuleLogo } from "@/components/shared";
import { STYLES } from "@/lib/constants";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        className={`min-h-screen ${STYLES.bg} text-white flex items-center justify-center`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${STYLES.bg} text-white font-sans selection:bg-yellow-400 selection:text-black flex items-center justify-center p-6 overflow-hidden`}
    >
      <BackgroundEffect />

      {/* Scanning Line Effect */}
      <motion.div
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent z-50 opacity-40 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
      />

      <motion.div layout className="relative w-full max-w-lg z-10">
        <div
          className={`${STYLES.glass} rounded-[60px] p-10 md:p-16 border-white/5 relative overflow-hidden`}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-12 text-center">
            <CapsuleLogo className="w-16 h-16" />
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black italic tracking-tighter uppercase mt-6"
            >
              Establish Link
            </motion.h1>
            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] mt-2">
              Pioneer Verification Required
            </p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-6 rounded-3xl bg-white text-black font-black text-xl italic flex items-center justify-center gap-4 relative overflow-hidden hover:bg-gray-100 transition-colors`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-4 border-black border-t-transparent rounded-full"
              />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs font-black uppercase tracking-widest">
              Secure Protocol
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Info */}
          <div className="text-center space-y-4">
            <p className="text-white/40 text-sm">
              Sign in with your Google account to create and manage your time
              capsules.
            </p>
            <div className="flex justify-center gap-6 text-white/20">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400" />
                <span className="text-xs font-bold">Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-xs font-bold">Instant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Security HUD */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6">
          <div
            className={`${STYLES.glass} p-6 rounded-3xl flex flex-col items-center gap-2`}
          >
            <ShieldCheck className="text-green-400" size={32} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 [writing-mode:vertical-rl]">
              Secured
            </span>
          </div>
          <div
            className={`${STYLES.glass} p-6 rounded-3xl flex flex-col items-center gap-2`}
          >
            <Zap className="text-yellow-400" size={32} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 [writing-mode:vertical-rl]">
              Protocol
            </span>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="fixed bottom-10 left-10 hidden md:flex items-center gap-4 opacity-20">
        <Clock size={20} />
        <span className="text-xs font-black uppercase tracking-[0.5em] italic">
          TimeCapsule Auth v3.0
        </span>
      </div>
    </div>
  );
}
