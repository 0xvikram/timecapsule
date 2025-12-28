"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  X,
  Share2,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import {
  Navbar,
  BackgroundEffect,
  CapsuleLogo,
  CapsuleLockAnimation,
} from "@/components/shared";
import { STYLES } from "@/lib/constants";
import { getCapsuleById } from "@/lib/capsule-store";
import { getCountdown, isUnlocked, formatDate } from "@/lib/utils";
import { Capsule, Goal } from "@/lib/types";

// Format goal date (YYYY-MM to Month Year)
const formatGoalDate = (date: string) => {
  const [year, month] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Goal status icon component
const GoalStatusIcon = ({ status }: { status: Goal["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="text-green-400" size={20} />;
    case "in-progress":
      return <Loader2 className="text-yellow-400 animate-spin" size={20} />;
    default:
      return <Circle className="text-white/30" size={20} />;
  }
};

// Live Countdown Display
const CapsuleCountdown = ({ date }: { date: string }) => {
  const [countdown, setCountdown] = useState(getCountdown(date));
  const unlocked = isUnlocked(date);

  useEffect(() => {
    if (unlocked) return;
    const timer = setInterval(() => {
      setCountdown(getCountdown(date));
    }, 1000);
    return () => clearInterval(timer);
  }, [date, unlocked]);

  return (
    <div className="text-center mt-12">
      <h3 className="text-xs font-black uppercase text-yellow-400 tracking-[0.3em] mb-6">
        Synchronization Status
      </h3>
      <div
        className={`text-5xl md:text-7xl font-mono font-black mb-6 italic tracking-tighter ${
          unlocked ? "text-green-400" : "text-white"
        }`}
      >
        {unlocked ? "UNLOCKED" : countdown}
      </div>
      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 inline-block">
        <span className="text-green-400 font-mono font-bold text-xl flex items-center gap-3">
          <Clock size={18} />
          {date}
        </span>
      </div>
    </div>
  );
};

export default function CapsulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cap = getCapsuleById(id);
    if (cap) {
      setCapsule(cap);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div
        className={`min-h-screen ${STYLES.bg} text-white flex items-center justify-center`}
      >
        <div className="animate-pulse text-yellow-400 font-black text-2xl">
          Loading Capsule...
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div
        className={`min-h-screen ${STYLES.bg} text-white flex flex-col items-center justify-center gap-8`}
      >
        <BackgroundEffect />
        <h1 className="text-5xl font-black italic">Capsule Not Found</h1>
        <p className="text-white/40">
          This temporal vessel does not exist in our records.
        </p>
        <Link
          href="/explore"
          className={`px-8 py-4 rounded-2xl ${STYLES.yellowBtn} text-lg`}
        >
          Explore Chronicles
        </Link>
      </div>
    );
  }

  const unlocked = isUnlocked(capsule.unlockDate);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const getTwitterShareUrl = () => {
    const url = getShareUrl();
    const goalsCount = capsule.goals?.length || 0;
    const unlockYear = new Date(capsule.unlockDate).getFullYear();

    let tweetText = "";
    if (capsule.isPublic) {
      tweetText = `🔒 I just locked my goals for ${unlockYear} in a TimeCapsule!\n\n"${
        capsule.title
      }"\n${
        goalsCount > 0
          ? `\n📌 ${goalsCount} goal${
              goalsCount !== 1 ? "s" : ""
            } sealed until reveal day\n`
          : ""
      }\nCheck out my future intentions 👇\n${url}\n\n#TimeCapsule #Goals #FutureSelf`;
    } else {
      tweetText = `🔒 Just sealed my goals in a TimeCapsule for ${unlockYear}!\n\nLocking away "${capsule.title}" until the reveal date.\n\nCreate your own at TimeCapsule ⏳\n\n#TimeCapsule #Goals #FutureSelf`;
    }

    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
  };

  const copyToClipboard = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: capsule.title,
          text: `Check out my TimeCapsule: "${capsule.title}" - locked until ${capsule.unlockDate}`,
          url,
        });
      } catch (err) {
        // User cancelled
      }
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
          <Link
            href="/explore"
            className="flex items-center gap-4 text-white/40 hover:text-yellow-400 transition-colors mb-16 font-black uppercase text-[10px] tracking-[0.5em] group"
          >
            <div className="p-3 border border-white/10 rounded-full group-hover:rotate-90 transition-transform">
              <X size={20} />
            </div>
            Back to Chronicles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start pb-20">
            <div className="relative">
              <div
                className={`${
                  STYLES.glass
                } rounded-[100px] p-12 md:p-24 flex flex-col items-center sticky top-32 ${
                  unlocked ? "border-green-400/20" : "border-yellow-400/10"
                }`}
              >
                {/* Full CapsuleLockAnimation from the original design */}
                <CapsuleLockAnimation />
                <CapsuleCountdown date={capsule.unlockDate} />
              </div>
            </div>

            <div className="space-y-16 py-10">
              <div className="flex items-center gap-6 flex-wrap">
                <CapsuleLogo className="w-16 h-16" />
                <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                  {capsule.isPublic ? "Universal Ledger" : "Private Storage"}
                </div>
                <div
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] ${
                    unlocked
                      ? "bg-green-400/20 text-green-400 border border-green-400/30"
                      : "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                  }`}
                >
                  {unlocked ? "Revealed" : "Sealed"}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black leading-[0.85] italic tracking-tighter">
                {capsule.title}
              </h1>

              <div className="p-12 border-l-[12px] border-yellow-400 bg-yellow-400/5 text-2xl md:text-3xl font-medium leading-relaxed italic text-white/90">
                &ldquo;{capsule.description}&rdquo;
              </div>

              {/* Goals Section */}
              {capsule.goals && capsule.goals.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-400/20 flex items-center justify-center">
                      <Target className="text-green-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic">
                        Mission Objectives
                      </h3>
                      <p className="text-xs font-black uppercase tracking-widest text-white/40">
                        {capsule.goals.length} goal
                        {capsule.goals.length !== 1 ? "s" : ""} sealed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {capsule.goals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl border transition-all ${
                          goal.status === "completed"
                            ? "bg-green-400/10 border-green-400/30"
                            : goal.status === "in-progress"
                            ? "bg-yellow-400/10 border-yellow-400/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <GoalStatusIcon status={goal.status} />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-xl font-bold ${
                                goal.status === "completed"
                                  ? "line-through text-white/50"
                                  : ""
                              }`}
                            >
                              {goal.text}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs font-black uppercase tracking-widest text-white/40">
                                Target: {formatGoalDate(goal.expectedDate)}
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                  goal.status === "completed"
                                    ? "bg-green-400/20 text-green-400"
                                    : goal.status === "in-progress"
                                    ? "bg-yellow-400/20 text-yellow-400"
                                    : "bg-white/10 text-white/40"
                                }`}
                              >
                                {goal.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16 border-t border-white/10">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <span className="block text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">
                    Transmission Origin
                  </span>
                  <span className="text-2xl font-black italic">
                    {formatDate(capsule.createdAt)}
                  </span>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <span className="block text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">
                    Created By
                  </span>
                  <span className="text-2xl font-black font-mono text-yellow-400">
                    @{capsule.userId.replace("local-", "")}
                  </span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-4">
                {/* Twitter/X Share Button */}
                <a
                  href={getTwitterShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-8 rounded-[40px] ${STYLES.greenBtn} text-2xl flex items-center justify-center gap-4 italic tracking-tighter shadow-green-400/30 no-underline`}
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </a>

                {/* Copy Link & Native Share */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="py-6 rounded-[30px] bg-white/5 border-2 border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all text-lg font-black flex items-center justify-center gap-3"
                  >
                    {copied ? (
                      <>
                        <Check size={22} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={22} />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleNativeShare}
                    className="py-6 rounded-[30px] bg-white/5 border-2 border-white/10 hover:border-green-400/30 hover:bg-white/10 transition-all text-lg font-black flex items-center justify-center gap-3"
                  >
                    <Share2 size={22} />
                    More Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
