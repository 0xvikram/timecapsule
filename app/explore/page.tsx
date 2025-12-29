"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, Lock, Unlock, Target, Zap } from "lucide-react";
import { Navbar, BackgroundEffect } from "@/components/shared";
import { STYLES } from "@/lib/constants";
import { getCountdown, isUnlocked } from "@/lib/utils";
import { Capsule } from "@/lib/types";

// Live Countdown Component
const LiveCountdown = ({ date }: { date: string }) => {
  const [countdown, setCountdown] = useState(getCountdown(date));
  const unlocked = isUnlocked(date);

  useEffect(() => {
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
      <span className="font-mono font-black text-xs">{countdown}</span>
    </div>
  );
};

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [filter, setFilter] = useState<"latest" | "trending">("latest");
  const [likingId, setLikingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Fetch capsules based on filter
  const fetchCapsules = async (sortType: "latest" | "trending") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/capsules?type=public&sort=${sortType}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCapsules(data);
      }
    } catch (err) {
      console.error("Failed to fetch capsules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules(filter);
  }, [filter]);

  // Handle like/unlike
  const handleLike = async (e: React.MouseEvent, capsuleId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!session?.user) {
      // Redirect to auth if not logged in
      router.push("/auth");
      return;
    }

    setLikingId(capsuleId);

    try {
      const res = await fetch(`/api/capsules/${capsuleId}/like`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        // Update local state
        setCapsules((prev) =>
          prev.map((cap) =>
            cap.id === capsuleId
              ? { ...cap, likeCount: data.likeCount, likedByMe: data.liked }
              : cap
          )
        );
      }
    } catch (err) {
      console.error("Failed to like capsule:", err);
    } finally {
      setLikingId(null);
    }
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <h1 className="text-7xl font-black italic mb-4 tracking-tighter">
                THE CHRONICLES
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-yellow-400" />
                <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black">
                  Public Temporal Records
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
              <button
                onClick={() => setFilter("latest")}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === "latest"
                    ? "bg-yellow-400 text-black"
                    : "hover:text-white text-white/40"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setFilter("trending")}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === "trending"
                    ? "bg-yellow-400 text-black"
                    : "hover:text-white text-white/40"
                }`}
              >
                Trending
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {capsules.map((cap) => (
              <Link key={cap.id} href={`/capsule/${cap.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`${STYLES.glass} ${STYLES.glassHover} p-10 rounded-[60px] cursor-pointer relative overflow-hidden group`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
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
                      {/* Electricity/Like Button */}
                      <button
                        onClick={(e) => handleLike(e, cap.id)}
                        disabled={likingId === cap.id}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all ${
                          cap.likedByMe
                            ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-yellow-400/50 hover:text-yellow-400"
                        } ${likingId === cap.id ? "opacity-50" : ""}`}
                      >
                        <Zap
                          size={18}
                          className={cap.likedByMe ? "fill-yellow-400" : ""}
                        />
                        <span className="font-black text-sm">
                          {cap.likeCount || 0}
                        </span>
                      </button>
                    </div>
                    <div className="text-right">
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
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest truncate max-w-[120px]">
                      @{cap.user?.name || cap.userId.substring(0, 8)}
                    </span>
                    <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      View <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <p className="text-white/40 text-xl">Loading chronicles...</p>
            </div>
          )}

          {!loading && capsules.length === 0 && (
            <div className="text-center py-32">
              <p className="text-white/40 text-xl mb-8">
                No public capsules yet.
              </p>
              <Link
                href="/create"
                className={`inline-flex items-center gap-4 px-12 py-6 rounded-3xl ${STYLES.yellowBtn} text-xl`}
              >
                Create the First <ArrowRight />
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
            <div className="w-2 h-2 rounded-full bg-yellow-400 mb-2 shadow-[0_0_10px_rgba(250,204,21,1)] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">
              Node
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
              Public Capsules
            </span>
            <span className="text-2xl font-black font-mono text-yellow-400 tracking-tighter">
              {capsules.length.toString().padStart(3, "0")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
              Time Lattice
            </span>
            <span className="text-2xl font-black text-green-400 italic tracking-tighter">
              STABLE
            </span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
