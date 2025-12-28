"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Fingerprint,
  ShieldCheck,
  MousePointer2,
} from "lucide-react";
import {
  Navbar,
  BackgroundEffect,
  CapsuleLockAnimation,
  Footer,
} from "@/components/shared";
import { STYLES } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div
      className={`min-h-screen ${STYLES.bg} text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden`}
    >
      <BackgroundEffect />
      <Navbar />

      <main className="pt-24 pb-0">
        <motion.div className="relative">
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
            <CapsuleLockAnimation />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-5xl relative z-30"
            >
              <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] mb-8 tracking-tighter italic">
                LOCK YOUR <br />
                <span className={STYLES.gradientText}>DESTINY.</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/40 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
                Secure your ambitions in a high-energy digital vault. Lock
                intentions today. Reveal them when the clock aligns.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/create"
                  className={`px-14 py-7 rounded-3xl ${STYLES.yellowBtn} text-2xl flex items-center gap-4 group italic`}
                >
                  Initialize Vault{" "}
                  <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                </Link>
                <Link
                  href="/explore"
                  className="px-14 py-7 rounded-3xl bg-white/5 border-2 border-white/10 text-2xl font-black hover:bg-white/10 transition-all italic"
                >
                  Explore Chronicles
                </Link>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-20 opacity-20 flex flex-col items-center"
            >
              <MousePointer2 size={24} />
              <span className="text-[10px] uppercase font-black mt-3 tracking-[0.5em]">
                The Journey
              </span>
            </motion.div>
          </section>

          {/* How it Works Section */}
          <section className="py-40 px-6 max-w-7xl mx-auto border-t border-white/5">
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-yellow-400/30 bg-yellow-400/5 mb-6"
              >
                <Zap size={14} className="text-yellow-400" />
                <span className="text-yellow-400 font-black tracking-widest text-[10px] uppercase">
                  Temporal Path
                </span>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">
                Securing Your Timeline
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  icon: Fingerprint,
                  title: "Initialize Identity",
                  desc: "Define your future self. Seal your intentions with a temporal key.",
                },
                {
                  step: "02",
                  icon: ShieldCheck,
                  title: "Quantum Storage",
                  desc: "Data is fragmented and encrypted. The timeline is the only master key.",
                },
                {
                  step: "03",
                  icon: Zap,
                  title: "The Revelation",
                  desc: "Unlock day arrives. Witness your evolution. Close the loop.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -20,
                    borderColor: "rgba(250,204,21,0.5)",
                  }}
                  className={`${STYLES.glass} p-12 rounded-[50px] relative overflow-hidden group transition-all duration-500`}
                >
                  <span className="absolute -top-4 -right-4 text-[12rem] font-black text-white/5 leading-none pointer-events-none group-hover:text-yellow-400/10 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-20 h-20 bg-yellow-400 text-black rounded-3xl flex items-center justify-center mb-10 shadow-xl">
                    <item.icon size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black mb-6 italic">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-lg leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* High-Impact CTA Section */}
          <section className="py-40 text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className={`${STYLES.glass} max-w-6xl mx-auto p-24 rounded-[100px] border-green-400/20 relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400" />
              <h2 className="text-6xl md:text-9xl font-black mb-12 italic tracking-tighter leading-none">
                YOUR FUTURE <br />{" "}
                <span className="text-green-400">STARTS NOW.</span>
              </h2>
              <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">
                Stop letting your long-term visions fade into the background.
                Seal them in the vault and let time do the work.
              </p>
              <Link
                href="/create"
                className={`inline-block px-20 py-10 rounded-[40px] ${STYLES.greenBtn} text-3xl uppercase tracking-tighter italic`}
              >
                Launch Your First Capsule
              </Link>
            </motion.div>
          </section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </main>
    </div>
  );
}
