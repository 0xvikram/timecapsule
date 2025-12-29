"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  Target,
  Plus,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from "lucide-react";
import { Navbar, BackgroundEffect } from "@/components/shared";
import { STYLES } from "@/lib/constants";
import { getCountdown, isUnlocked } from "@/lib/utils";
import { Capsule } from "@/lib/types";

// Live Countdown Component
const LiveCountdown = ({ date }: { date: string }) => {
  const [countdown, setCountdown] = useState("");
  const [mounted, setMounted] = useState(false);
  const unlocked = isUnlocked(date);

  useEffect(() => {
    setMounted(true);
    setCountdown(getCountdown(date));
    if (unlocked) return;
    const timer = setInterval(() => {
      setCountdown(getCountdown(date));
    }, 1000);
    return () => clearInterval(timer);
  }, [date, unlocked]);

  if (unlocked) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <Unlock size={14} />
        <span className="font-mono font-black text-xs">UNLOCKED</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-yellow-400">
      <Lock size={14} className="animate-pulse" />
      <span className="font-mono font-black text-xs">
        {mounted ? countdown : "..."}
      </span>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  const [loading, setLoading] = useState(true);

  // Fetch user's capsules from database
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/capsules?type=user")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCapsules(data);
          }
        })
        .catch((err) => console.error("Failed to fetch capsules:", err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const filteredCapsules = capsules.filter((c) => {
    if (filter === "public") return c.isPublic;
    if (filter === "private") return !c.isPublic;
    return true;
  });

  const publicCount = capsules.filter((c) => c.isPublic).length;
  const privateCount = capsules.filter((c) => !c.isPublic).length;
  const unlockedCount = capsules.filter((c) => isUnlocked(c.unlockDate)).length;

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

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div
      className={`min-h-screen ${STYLES.bg} text-white font-sans selection:bg-yellow-400 selection:text-black`}
    >
      <BackgroundEffect />
      <Navbar />

      <main className="pt-32 pb-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black text-2xl font-black">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">
                    {session?.user?.name?.split(" ")[0]}&apos;s Vault
                  </h1>
                  <p className="text-white/40 text-sm">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-12 h-1 bg-yellow-400" />
                <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black">
                  Your Temporal Archives
                </p>
              </div>
            </div>
            <Link
              href="/create"
              className={`px-10 py-5 rounded-3xl ${STYLES.yellowBtn} text-sm uppercase flex items-center gap-3 tracking-widest`}
            >
              <Plus size={18} strokeWidth={3} /> New Capsule
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className={`${STYLES.glass} p-6 rounded-3xl`}>
              <div className="flex items-center gap-3 mb-2">
                <Layers className="text-yellow-400" size={20} />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Total
                </span>
              </div>
              <span className="text-3xl font-black font-mono text-white">
                {capsules.length.toString().padStart(2, "0")}
              </span>
            </div>
            <div className={`${STYLES.glass} p-6 rounded-3xl`}>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="text-green-400" size={20} />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Public
                </span>
              </div>
              <span className="text-3xl font-black font-mono text-green-400">
                {publicCount.toString().padStart(2, "0")}
              </span>
            </div>
            <div className={`${STYLES.glass} p-6 rounded-3xl`}>
              <div className="flex items-center gap-3 mb-2">
                <EyeOff className="text-purple-400" size={20} />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Private
                </span>
              </div>
              <span className="text-3xl font-black font-mono text-purple-400">
                {privateCount.toString().padStart(2, "0")}
              </span>
            </div>
            <div className={`${STYLES.glass} p-6 rounded-3xl`}>
              <div className="flex items-center gap-3 mb-2">
                <Unlock className="text-cyan-400" size={20} />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Unlocked
                </span>
              </div>
              <span className="text-3xl font-black font-mono text-cyan-400">
                {unlockedCount.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === "all"
                  ? "bg-yellow-400 text-black"
                  : "hover:text-white text-white/40"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("public")}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                filter === "public"
                  ? "bg-green-400 text-black"
                  : "hover:text-white text-white/40"
              }`}
            >
              <Eye size={14} /> Public
            </button>
            <button
              onClick={() => setFilter("private")}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                filter === "private"
                  ? "bg-purple-400 text-black"
                  : "hover:text-white text-white/40"
              }`}
            >
              <EyeOff size={14} /> Private
            </button>
          </div>

          {/* Capsules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCapsules.map((cap) => (
              <Link key={cap.id} href={`/capsule/${cap.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`${STYLES.glass} ${STYLES.glassHover} p-10 rounded-[60px] cursor-pointer relative overflow-hidden group`}
                >
                  {/* Privacy Badge */}
                  <div
                    className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      cap.isPublic
                        ? "bg-green-400/20 text-green-400"
                        : "bg-purple-400/20 text-purple-400"
                    }`}
                  >
                    {cap.isPublic ? (
                      <span className="flex items-center gap-1">
                        <Eye size={10} /> Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <EyeOff size={10} /> Private
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={`p-4 rounded-3xl shadow-lg ${
                        isUnlocked(cap.unlockDate)
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      } text-black`}
                    >
                      {isUnlocked(cap.unlockDate) ? (
                        <Unlock size={24} />
                      ) : (
                        <Lock size={24} />
                      )}
                    </div>
                    <div className="text-right mt-6">
                      <span className="block text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                        {isUnlocked(cap.unlockDate) ? "Revealed" : "Unlocks In"}
                      </span>
                      <LiveCountdown date={cap.unlockDate} />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-4 italic leading-tight group-hover:text-yellow-400 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-white/40 line-clamp-2 mb-6 text-lg leading-relaxed">
                    {cap.description}
                  </p>

                  {/* Goals count badge */}
                  {cap.goals && cap.goals.length > 0 && (
                    <div className="mb-6 flex items-center gap-2 text-green-400">
                      <Target size={14} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {cap.goals.length} Goal
                        {cap.goals.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      Created{" "}
                      {new Date(cap.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      View <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredCapsules.length === 0 && (
            <div className="text-center py-32">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8"
              >
                <Sparkles className="text-yellow-400" size={40} />
              </motion.div>
              <p className="text-white/40 text-xl mb-2">
                {filter === "all"
                  ? "No capsules yet"
                  : filter === "public"
                  ? "No public capsules"
                  : "No private capsules"}
              </p>
              <p className="text-white/20 text-sm mb-8">
                Start preserving your memories for the future
              </p>
              <Link
                href="/create"
                className={`inline-flex items-center gap-4 px-12 py-6 rounded-3xl ${STYLES.yellowBtn} text-xl`}
              >
                Create Your First Capsule <ArrowRight />
              </Link>
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom HUD */}
      <footer className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200]">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={`${STYLES.glass} px-12 py-6 rounded-[50px] flex items-center gap-16 border-yellow-400/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]`}
        >
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mb-2 shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">
              Synced
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
              Your Capsules
            </span>
            <span className="text-2xl font-black font-mono text-yellow-400 tracking-tighter">
              {capsules.length.toString().padStart(3, "0")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
              Vault Status
            </span>
            <span className="text-2xl font-black text-green-400 italic tracking-tighter">
              SECURED
            </span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
