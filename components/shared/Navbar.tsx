"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CapsuleLogo } from "./CapsuleLogo";
import { STYLES } from "@/lib/constants";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-8 flex justify-between items-center backdrop-blur-md border-b border-white/5">
      <Link href="/" className="flex items-center gap-4 cursor-pointer group">
        <CapsuleLogo className="w-10 h-10 md:w-12 md:h-12" />
        <div className="flex flex-col leading-none">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic group-hover:text-yellow-400 transition-colors">
            TimeCapsule
          </span>
          <span className="text-[8px] font-bold text-green-400 tracking-[0.4em] uppercase mt-1">
            Temporal Vault
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-10">
        <Link
          href="/explore"
          className="hidden md:block text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors"
        >
          The Chronicles
        </Link>
        <Link
          href="/create"
          className={`px-8 py-3.5 rounded-full ${STYLES.yellowBtn} text-[10px] uppercase flex items-center gap-2 tracking-widest`}
        >
          <Plus size={14} strokeWidth={3} /> Seal Capsule
        </Link>
      </div>
    </nav>
  );
};
