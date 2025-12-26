"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Clock, User } from "lucide-react";
import { getCountdown } from "@/lib/utils";

interface FloatingCapsuleNodeProps {
  username: string;
  time: string;
  x: string;
  y: string;
  isYellow: boolean;
  delay?: number;
}

const FloatingCapsuleNode = ({
  username,
  time,
  x,
  y,
  isYellow,
  delay = 0,
}: FloatingCapsuleNodeProps) => {
  const [countdown, setCountdown] = useState(getCountdown(new Date(time)));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(new Date(time)));
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute z-20 hidden lg:block"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`px-6 py-4 rounded-3xl border-2 backdrop-blur-xl flex flex-col items-center gap-1 shadow-2xl ${
          isYellow
            ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
            : "bg-white/5 border-white/20 text-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isYellow ? "bg-yellow-400" : "bg-white"
            } text-black`}
          >
            <User size={12} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {username}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black uppercase opacity-40 tracking-[0.2em] text-white">
            Locking for
          </span>
          <span className="text-sm font-mono font-black">{countdown}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const CapsuleLockAnimation = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setIsLocked((prev) => !prev), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center py-24 w-full">
      {/* Floating Nodes */}
      <FloatingCapsuleNode
        username="Pioneer_Z"
        time="2026-12-31"
        x="10%"
        y="20%"
        isYellow={true}
        delay={0.2}
      />
      <FloatingCapsuleNode
        username="Future_Dev"
        time="2027-05-20"
        x="15%"
        y="65%"
        isYellow={false}
        delay={0.5}
      />
      <FloatingCapsuleNode
        username="Nova_Goal"
        time="2028-11-10"
        x="78%"
        y="18%"
        isYellow={false}
        delay={0.8}
      />
      <FloatingCapsuleNode
        username="Vault_X"
        time="2026-08-14"
        x="82%"
        y="72%"
        isYellow={true}
        delay={1.1}
      />

      <motion.div
        animate={{
          scale: isLocked ? 1.05 : 1,
          rotateZ: isLocked ? [0, 1, -1, 0] : 0,
          y: [0, -10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="w-36 h-72 md:w-48 md:h-96 border-4 border-white/20 rounded-full flex flex-col overflow-hidden backdrop-blur-3xl relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <motion.div
            animate={{
              height: isLocked ? "100%" : "60%",
              backgroundColor: isLocked
                ? "rgba(250, 204, 21, 0.15)"
                : "rgba(74, 222, 128, 0.1)",
            }}
            className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out"
          />

          <div className="flex-1 flex flex-col items-center justify-center relative z-20 gap-8">
            <AnimatePresence mode="wait">
              {isLocked ? (
                <motion.div
                  key="locked"
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                  className="bg-yellow-400 p-6 rounded-3xl shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                >
                  <Lock className="text-black" size={48} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  className="bg-green-400 p-6 rounded-3xl shadow-[0_0_30px_rgba(74,222,128,0.5)]"
                >
                  <Unlock className="text-black" size={48} strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center">
              <span
                className={`text-xs font-black uppercase tracking-[0.3em] ${
                  isLocked ? "text-yellow-400" : "text-green-400"
                }`}
              >
                {isLocked ? "Sealed" : "Accessible"}
              </span>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLocked ? "bg-yellow-400" : "bg-green-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-32 bg-white/5 border-t border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,white_10px,white_11px)]" />
            <Clock size={24} className="text-white/20 relative z-10" />
          </div>
        </div>

        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full border border-white/40 ${
              i % 2 === 0 ? "bg-yellow-400" : "bg-green-400"
            }`}
            animate={{
              rotate: angle + 360,
              x: Math.cos((angle * Math.PI) / 180) * 180,
              y: Math.sin((angle * Math.PI) / 180) * 220,
            }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>

      <motion.div
        animate={{
          opacity: isLocked ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
          scale: isLocked ? [1, 1.2, 1] : [1, 1.1, 1],
        }}
        className={`absolute inset-0 rounded-full blur-[120px] -z-10 ${
          isLocked ? "bg-yellow-400/30" : "bg-green-400/20"
        }`}
      />
    </div>
  );
};
