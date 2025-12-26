"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Instagram, Mail } from "lucide-react";
import { CapsuleLogo } from "./CapsuleLogo";

export const Footer = () => {
  return (
    <footer className="bg-[#0b0b0b] border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <CapsuleLogo className="w-12 h-12" />
            <span className="text-3xl font-black italic tracking-tighter uppercase">
              TimeCapsule
            </span>
          </div>
          <p className="text-white/40 max-w-md text-lg leading-relaxed mb-8 font-medium">
            The world's most vibrant and secure platform for temporal
            manifestations. We help you connect with your future self through
            locked intentions.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Instagram, Mail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, color: "#facc15" }}
                className="p-3 bg-white/5 rounded-xl text-white/60 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-yellow-400 font-black uppercase text-xs tracking-widest mb-8">
            Navigation
          </h4>
          <ul className="space-y-4 text-white/40 font-bold">
            {[
              "The Chronicles",
              "How it Works",
              "Privacy Vault",
              "System Status",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition-colors uppercase tracking-widest text-[11px]"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-green-400 font-black uppercase text-xs tracking-widest mb-8">
            Join the Node
          </h4>
          <p className="text-white/40 text-xs mb-4">
            Stay updated on temporal shifts and new vault features.
          </p>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <input
              type="text"
              placeholder="Email"
              className="bg-transparent px-4 py-2 outline-none text-xs w-full"
            />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          © 2025 TIMECAPSULE PROTOCOL. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 text-[10px] font-black text-white/20 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
