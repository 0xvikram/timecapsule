"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Lock,
  Unlock,
  Clock,
  Globe,
  Plus,
  ChevronRight,
  Share2,
  Target,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MousePointer2,
  X,
  Layers,
  Fingerprint,
  User,
  Github,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";

// --- MOCK DATA (To replace Firebase "Public Feed") ---
const SEED_CAPSULES = [
  {
    id: "seed-1",
    title: "Silicon Valley Vision",
    description:
      "Locking away my 2024 coding goals. Building the next-gen AI interface.",
    unlockDate: "2026-12-31",
    userId: "Dev_Alpha",
    createdAt: new Date().toISOString(),
    isPublic: true,
  },
  {
    id: "seed-2",
    title: "World Traveler 2025",
    description:
      "Memories from the Tokyo expedition. To be opened when I move to Japan.",
    unlockDate: "2025-06-15",
    userId: "Nomad_Pioneer",
    createdAt: new Date().toISOString(),
    isPublic: true,
  },
  {
    id: "seed-3",
    title: "Fitness Transformation",
    description:
      "Current stats and a letter to my future self about resilience.",
    unlockDate: "2025-01-01",
    userId: "Meta_Human",
    createdAt: new Date().toISOString(),
    isPublic: true,
  },
];

// --- STYLES ---
const STYLES = {
  bg: "bg-[#000000]",
  glass: "backdrop-blur-2xl bg-white/5 border border-white/10",
  glassHover:
    "hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/30",
  gradientText:
    "bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-green-400 to-white",
  gradientBg: "bg-gradient-to-br from-yellow-400 to-green-500",
  yellowBtn:
    "bg-yellow-400 text-black font-black hover:bg-green-400 transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]",
  greenBtn:
    "bg-green-400 text-black font-black hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_20px_rgba(74,222,128,0.4)]",
};

// --- HELPERS ---
const getCountdown = (date) => {
  const diff = new Date(date).getTime() - new Date().getTime();
  if (diff < 0) return "00:00:00";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// --- COMPONENTS ---

const CapsuleLogo = ({ className = "w-12 h-12" }) => (
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

const FloatingCapsuleNode = ({ username, time, x, y, isYellow, delay = 0 }) => {
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
          <span
            className={`text-[8px] font-black uppercase opacity-40 tracking-[0.2em] text-white`}
          >
            Locking for
          </span>
          <span className={`text-sm font-mono font-black`}>{countdown}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CapsuleLockAnimation = () => {
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

const BackgroundEffect = () => (
  <div className="fixed inset-0 -z-10 bg-[#000000] overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-yellow-500/10 blur-[150px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-green-500/10 blur-[150px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    />
  </div>
);

// --- MAIN APP ---

export default function TimeCapsuleApp() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState({ uid: "local-explorer" });
  const [capsules, setCapsules] = useState([]);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    unlockDate: "",
    isPublic: true,
    goals: [],
  });

  // Local Storage Logic
  useEffect(() => {
    const localData = localStorage.getItem("timecapsule_data");
    if (localData) {
      setCapsules(JSON.parse(localData));
    } else {
      setCapsules(SEED_CAPSULES);
      localStorage.setItem("timecapsule_data", JSON.stringify(SEED_CAPSULES));
    }
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const newCapsule = {
      ...formData,
      id: `local-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      status: "locked",
    };

    const updatedCapsules = [newCapsule, ...capsules];
    setCapsules(updatedCapsules);
    localStorage.setItem("timecapsule_data", JSON.stringify(updatedCapsules));

    setView("feed");
    setFormData({
      title: "",
      description: "",
      unlockDate: "",
      isPublic: true,
      goals: [],
    });
  };

  return (
    <div
      className={`min-h-screen ${STYLES.bg} text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden`}
    >
      <BackgroundEffect />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-8 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setView("landing")}
        >
          <CapsuleLogo className="w-10 h-10 md:w-12 md:h-12" />
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic group-hover:text-yellow-400 transition-colors">
              TimeCapsule
            </span>
            <span className="text-[8px] font-bold text-green-400 tracking-[0.4em] uppercase mt-1">
              Temporal Vault
            </span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <button
            onClick={() => setView("feed")}
            className="hidden md:block text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors"
          >
            The Chronicles
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-8 py-3.5 rounded-full ${STYLES.yellowBtn} text-[10px] uppercase flex items-center gap-2 tracking-widest`}
          >
            <Plus size={14} strokeWidth={3} /> Seal Capsule
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-0">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" className="relative">
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
                    <button
                      onClick={() => setView("create")}
                      className={`px-14 py-7 rounded-3xl ${STYLES.yellowBtn} text-2xl flex items-center gap-4 group italic`}
                    >
                      Initialize Vault{" "}
                      <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                    </button>
                    <button
                      onClick={() => setView("feed")}
                      className="px-14 py-7 rounded-3xl bg-white/5 border-2 border-white/10 text-2xl font-black hover:bg-white/10 transition-all italic"
                    >
                      Explore Chronicles
                    </button>
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
                    Stop letting your long-term visions fade into the
                    background. Seal them in the vault and let time do the work.
                  </p>
                  <button
                    onClick={() => setView("create")}
                    className={`px-20 py-10 rounded-[40px] ${STYLES.greenBtn} text-3xl uppercase tracking-tighter italic`}
                  >
                    Launch Your First Capsule
                  </button>
                </motion.div>
              </section>

              {/* Footer Section */}
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
                      manifestations. We help you connect with your future self
                      through locked intentions.
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
            </motion.div>
          )}

          {view === "feed" && (
            <motion.div
              key="feed"
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
                  <button className="px-8 py-3 bg-yellow-400 text-black font-black rounded-xl text-xs uppercase tracking-widest">
                    Latest
                  </button>
                  <button className="px-8 py-3 hover:text-white text-white/40 text-xs font-black uppercase tracking-widest transition-all">
                    Trending
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {capsules.map((cap) => (
                  <motion.div
                    key={cap.id}
                    whileHover={{ scale: 1.02 }}
                    className={`${STYLES.glass} ${STYLES.glassHover} p-10 rounded-[60px] cursor-pointer relative overflow-hidden group`}
                    onClick={() => {
                      setSelectedCapsule(cap);
                      setView("view-capsule");
                    }}
                  >
                    <div className="flex justify-between items-start mb-12">
                      <div className="bg-yellow-400 p-4 rounded-3xl text-black shadow-lg">
                        <Layers size={24} />
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                          Vault Status
                        </span>
                        <span
                          className={`text-xs font-black uppercase italic ${
                            new Date(cap.unlockDate) > new Date()
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {new Date(cap.unlockDate) > new Date()
                            ? "Locked"
                            : "Released"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-6 italic leading-tight group-hover:text-yellow-400 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-white/40 line-clamp-3 mb-10 text-lg leading-relaxed">
                      {cap.description}
                    </p>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Sig: {cap.id.slice(0, 10)}
                      </span>
                      <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                        View <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <div className="mb-20 flex items-center gap-8">
                <button
                  onClick={() => setView("landing")}
                  className="p-5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all text-white/40 hover:text-white"
                >
                  <X size={32} />
                </button>
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
                        onClick={() =>
                          setFormData({ ...formData, isPublic: true })
                        }
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
          )}

          {view === "view-capsule" && selectedCapsule && (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <button
                onClick={() => setView("feed")}
                className="flex items-center gap-4 text-white/40 hover:text-yellow-400 transition-colors mb-16 font-black uppercase text-[10px] tracking-[0.5em] group"
              >
                <div className="p-3 border border-white/10 rounded-full group-hover:rotate-90 transition-transform">
                  <X size={20} />
                </div>
                Abort Session
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start pb-20">
                <div className="relative">
                  <div
                    className={`${STYLES.glass} rounded-[100px] p-24 flex flex-col items-center sticky top-32 border-yellow-400/10`}
                  >
                    <CapsuleLockAnimation />
                    <div className="text-center mt-12">
                      <h3 className="text-xs font-black uppercase text-yellow-400 tracking-[0.3em] mb-6">
                        Synchronization Status
                      </h3>
                      <div className="text-7xl font-mono font-black mb-6 italic tracking-tighter">
                        LOCKED
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 inline-block">
                        <span className="text-green-400 font-mono font-bold text-xl">
                          {selectedCapsule.unlockDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-16 py-10">
                  <div className="flex items-center gap-6">
                    <CapsuleLogo className="w-16 h-16" />
                    <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                      {selectedCapsule.isPublic
                        ? "Universal Ledger"
                        : "Private Storage"}
                    </div>
                  </div>

                  <h1 className="text-7xl md:text-[8rem] font-black leading-[0.85] italic tracking-tighter">
                    {selectedCapsule.title}
                  </h1>

                  <div className="p-12 border-l-[12px] border-yellow-400 bg-yellow-400/5 text-3xl font-medium leading-relaxed italic text-white/90">
                    "{selectedCapsule.description}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16 border-t border-white/10">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                      <span className="block text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">
                        Transmission Origin
                      </span>
                      <span className="text-2xl font-black italic">
                        {new Date(
                          selectedCapsule.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                      <span className="block text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">
                        Pioneer Identity
                      </span>
                      <span className="text-2xl font-black font-mono text-yellow-400">
                        P-{selectedCapsule.userId.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-8 rounded-[40px] ${STYLES.greenBtn} text-2xl flex items-center justify-center gap-4 italic tracking-tighter shadow-green-400/30`}
                  >
                    <Share2 size={28} strokeWidth={2.5} /> Broadcast Signal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dynamic System HUD (App View only) */}
      {view !== "landing" && (
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
                Total Capsules
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
      )}
    </div>
  );
}
