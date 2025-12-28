"use client";

import { motion } from "framer-motion";

interface CapsuleLogoProps {
  className?: string;
}

export const CapsuleLogo = ({ className = "w-12 h-12" }: CapsuleLogoProps) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    className={`relative ${className} flex items-center justify-center cursor-pointer`}
  >
    <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
    >
      <rect
        x="35"
        y="20"
        width="30"
        height="60"
        rx="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-yellow-400"
      />
      <path
        d="M35 50 H65"
        stroke="currentColor"
        strokeWidth="4"
        className="text-yellow-400 opacity-50"
      />
      <motion.rect
        x="42"
        y="28"
        width="16"
        height="44"
        rx="8"
        fill="currentColor"
        className="text-green-400"
        animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="50" cy="50" r="4" fill="black" />
    </svg>
  </motion.div>
);
