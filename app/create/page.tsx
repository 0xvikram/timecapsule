"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  Fingerprint,
  Layers,
  Clock,
  ShieldCheck,
  Plus,
  Target,
  Trash2,
  Calendar,
} from "lucide-react";
import { Navbar, BackgroundEffect } from "@/components/shared";
import { STYLES } from "@/lib/constants";
import { saveCapsule } from "@/lib/capsule-store";
import { CapsuleFormData, Goal } from "@/lib/types";

export default function CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: "",
    description: "",
    unlockDate: "",
    isPublic: true,
    goals: [],
  });

  // Goal input state
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  const addGoal = () => {
    if (!newGoalText.trim() || !newGoalDate) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      text: newGoalText.trim(),
      expectedDate: newGoalDate,
      status: "pending",
    };

    setFormData({
      ...formData,
      goals: [...formData.goals, newGoal],
    });
    setNewGoalText("");
    setNewGoalDate("");
  };

  const removeGoal = (goalId: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((g) => g.id !== goalId),
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const newCapsule = {
      ...formData,
      id: `local-${Date.now()}`,
      userId: "local-explorer",
      createdAt: new Date().toISOString(),
      status: "locked" as const,
    };

    saveCapsule(newCapsule);
    router.push("/explore");
  };

  // Format date for display (YYYY-MM to Month Year)
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

  return (
    <div
      className={`min-h-screen ${STYLES.bg} text-white font-sans selection:bg-yellow-400 selection:text-black`}
    >
      <BackgroundEffect />
      <Navbar />

      <main className="pt-32 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="mb-20 flex items-center gap-8">
            <Link
              href="/"
              className="p-5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all text-white/40 hover:text-white"
            >
              <X size={32} />
            </Link>
            <div>
              <h1 className="text-6xl font-black italic tracking-tighter">
                NEW VESSEL
              </h1>
              <p className="text-yellow-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Timeline Initialization
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-12 pb-20">
            <div className="space-y-6">
              <label className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 flex items-center gap-2">
                <Fingerprint size={14} /> Identification
              </label>
              <input
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-[40px] px-10 py-8 text-3xl font-black italic outline-none focus:border-yellow-400/50 transition-all placeholder:text-white/5"
                placeholder="Vessel Designation..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 flex items-center gap-2">
                <Layers size={14} /> Core Objectives
              </label>
              <textarea
                required
                rows={6}
                className="w-full bg-white/5 border-2 border-white/10 rounded-[40px] px-10 py-8 text-xl font-medium outline-none focus:border-yellow-400/50 transition-all resize-none placeholder:text-white/5 leading-relaxed"
                placeholder="Define your transmission parameters..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 flex items-center gap-2">
                  <Clock size={14} /> Unlock Trigger
                </label>
                <input
                  required
                  type="date"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-[40px] px-10 py-8 text-xl font-black outline-none focus:border-yellow-400/50 transition-all appearance-none uppercase tracking-widest"
                  value={formData.unlockDate}
                  onChange={(e) =>
                    setFormData({ ...formData, unlockDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-6">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 flex items-center gap-2">
                  <ShieldCheck size={14} /> Access Protocol
                </label>
                <div className="grid grid-cols-2 gap-3 bg-white/5 border-2 border-white/10 p-3 rounded-[40px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: true })}
                    className={`py-5 rounded-[30px] text-xs font-black uppercase tracking-widest transition-all ${
                      formData.isPublic
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                        : "text-white/30 hover:text-white"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isPublic: false })
                    }
                    className={`py-5 rounded-[30px] text-xs font-black uppercase tracking-widest transition-all ${
                      !formData.isPublic
                        ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
                        : "text-white/30 hover:text-white"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>

            {/* Goals Section */}
            <div className="space-y-6">
              <label className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 flex items-center gap-2">
                <Target size={14} /> Mission Objectives
              </label>
              <p className="text-white/40 text-sm -mt-2">
                Add specific goals you want to achieve by the unlock date
              </p>

              {/* Goal Input */}
              <div className="bg-white/5 border-2 border-white/10 rounded-[40px] p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Enter your goal..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-medium outline-none focus:border-yellow-400/50 transition-all placeholder:text-white/20"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGoal();
                    }
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">
                      <Calendar size={10} className="inline mr-1" />
                      Expected Completion
                    </label>
                    <input
                      type="month"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-yellow-400/50 transition-all"
                      value={newGoalDate}
                      onChange={(e) => setNewGoalDate(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addGoal}
                    disabled={!newGoalText.trim() || !newGoalDate}
                    className="self-end px-8 py-3 rounded-xl bg-green-400 text-black font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-300 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Goals List */}
              <AnimatePresence mode="popLayout">
                {formData.goals.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    {formData.goals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-yellow-400/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-black text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold">{goal.text}</p>
                          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                            Target: {formatGoalDate(goal.expectedDate)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGoal(goal.id)}
                          className="p-3 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                    <div className="text-center pt-4">
                      <span className="text-xs font-black uppercase tracking-widest text-white/20">
                        {formData.goals.length} objective
                        {formData.goals.length !== 1 ? "s" : ""} locked
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className={`w-full py-10 rounded-[60px] ${STYLES.yellowBtn} text-4xl italic tracking-tighter mt-12 flex items-center justify-center gap-6 group`}
            >
              SEAL TRANSMISSION{" "}
              <ArrowRight
                className="group-hover:translate-x-4 transition-transform"
                size={40}
              />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
