"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { CapsuleLogo } from "./CapsuleLogo";
import { STYLES } from "@/lib/constants";
import { useState } from "react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

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
      <div className="flex items-center gap-6 md:gap-10">
        <Link
          href="/explore"
          className="hidden md:block text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors"
        >
          The Chronicles
        </Link>

        {status === "loading" ? (
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
        ) : session?.user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 group"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white/10 group-hover:border-yellow-400 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="hidden md:block text-xs font-black text-white/60 group-hover:text-white uppercase tracking-widest transition-colors">
                {session.user.name?.split(" ")[0]}
              </span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-w-[200px]">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-bold text-white truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <User size={16} />
                  My Capsules
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="hidden md:flex items-center gap-2 text-xs font-black text-white/60 hover:text-yellow-400 uppercase tracking-widest transition-colors"
          >
            <User size={14} strokeWidth={3} /> Portal
          </Link>
        )}

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
