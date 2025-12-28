// --- STYLES ---
export const STYLES = {
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

// --- MOCK DATA (To replace with database) ---
export const SEED_CAPSULES = [
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
