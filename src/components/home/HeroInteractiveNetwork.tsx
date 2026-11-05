"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Tv,
  ShieldCheck,
  KeyRound,
  Music,
  Sparkles,
  Palette,
  Cloud,
  Terminal,
  ArrowRight,
} from "lucide-react";

interface ServiceNode {
  id: string;
  name: string;
  categorySlug: string;
  popularItems: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  offsetClass: string;
}

const leftNodes: ServiceNode[] = [
  {
    id: "streaming",
    name: "Streaming 4K",
    categorySlug: "streaming",
    popularItems: "Netflix 4K • Prime Video",
    icon: Tv,
    color: "#e50914",
    offsetClass: "-translate-x-6 xl:-translate-x-8",
  },
  {
    id: "vpn",
    name: "VPN & Sécurité",
    categorySlug: "utilities",
    popularItems: "NordVPN • ExpressVPN",
    icon: ShieldCheck,
    color: "#00BFFF",
    offsetClass: "translate-x-3 xl:translate-x-4",
  },
  {
    id: "licenses",
    name: "Clés & Licences",
    categorySlug: "utilities",
    popularItems: "Windows 11 • Office 365",
    icon: KeyRound,
    color: "#0078d4",
    offsetClass: "-translate-x-8 xl:-translate-x-10",
  },
  {
    id: "music",
    name: "Audio & Musique",
    categorySlug: "streaming",
    popularItems: "Spotify • Tidal HiFi",
    icon: Music,
    color: "#1db954",
    offsetClass: "-translate-x-2 xl:-translate-x-3",
  },
];

const rightNodes: ServiceNode[] = [
  {
    id: "ai",
    name: "Outils IA",
    categorySlug: "ai",
    popularItems: "ChatGPT Plus • Claude Pro",
    icon: Sparkles,
    color: "#10a37f",
    offsetClass: "translate-x-6 xl:translate-x-8",
  },
  {
    id: "design",
    name: "Design & Vidéo",
    categorySlug: "design",
    popularItems: "Canva Pro • CapCut Pro",
    icon: Palette,
    color: "#00c4cc",
    offsetClass: "-translate-x-3 xl:-translate-x-4",
  },
  {
    id: "cloud",
    name: "Cloud & Stockage",
    categorySlug: "utilities",
    popularItems: "Google One 2To • iCloud",
    icon: Cloud,
    color: "#075BDB",
    offsetClass: "translate-x-8 xl:translate-x-10",
  },
  {
    id: "dev",
    name: "Études & Dev",
    categorySlug: "ai",
    popularItems: "GitHub Copilot • JetBrains",
    icon: Terminal,
    color: "#9333ea",
    offsetClass: "translate-x-2 xl:translate-x-3",
  },
];

// Independent desynchronized floating motions
const leftMotionConfigs = [
  { y: [-5, 5, -5], duration: 4.2, delay: 0.1 },
  { y: [-7, 4, -7], duration: 5.1, delay: 0.6 },
  { y: [-4, 6, -4], duration: 3.8, delay: 0.3 },
  { y: [-6, 5, -6], duration: 4.7, delay: 0.8 },
];

const rightMotionConfigs = [
  { y: [-6, 6, -6], duration: 4.5, delay: 0.2 },
  { y: [-4, 5, -4], duration: 3.9, delay: 0.5 },
  { y: [-7, 5, -7], duration: 5.3, delay: 0.7 },
  { y: [-5, 4, -5], duration: 4.1, delay: 0.4 },
];

// Calculated SVG conduit anchors matching the staggered horizontal offsets
const leftCablePaths = [
  { d: "M 330 126 C 260 126, 230 24, 176 24", dur: "2.4s" },
  { d: "M 330 126 C 275 126, 250 92, 216 92", dur: "2.8s" },
  { d: "M 330 126 C 265 126, 220 160, 166 160", dur: "3.2s" },
  { d: "M 330 126 C 260 126, 230 228, 192 228", dur: "2.6s" },
];

const rightCablePaths = [
  { d: "M 770 126 C 840 126, 870 24, 924 24", dur: "2.5s" },
  { d: "M 770 126 C 825 126, 850 92, 884 92", dur: "2.9s" },
  { d: "M 770 126 C 835 126, 880 160, 934 160", dur: "3.3s" },
  { d: "M 770 126 C 840 126, 870 228, 908 228", dur: "2.7s" },
];

const popularTags: string[] = [
  "ChatGPT Plus",
  "Canva Pro",
  "Netflix 4K",
  "CapCut Pro",
  "Midjourney",
  "Claude Pro",
  "Windows 11",
];

export function HeroInteractiveNetwork() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/products?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] max-h-[750px] flex flex-col justify-between py-6 md:py-8 lg:py-10 bg-[#05070C] border-b border-[#101B2C] overflow-hidden">
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 -z-20 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 27, 44, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 27, 44, 0.5) 1px, transparent 1px)`,
          backgroundSize: "3.5rem 3.5rem",
          maskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, #000 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, #000 65%, transparent 100%)",
        }}
      />

      {/* Ambient Radial Cyber Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[300px] bg-electric/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[380px] h-[200px] bg-cyan/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col justify-between flex-1">

        {/* =========================================================================
            TOP TYPOGRAPHY ZONE
            ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto pt-2">
          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
          >
            TOUS VOS ABONNEMENTS{" "}
            <span className="bg-gradient-to-r from-[#075BDB] via-[#00BFFF] to-[#C8D5E5] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,191,255,0.4)]">
              DIGITAUX
            </span>
            .<br className="hidden sm:inline" /> UNE SEULE PLATEFORME.
          </motion.h1>
        </div>

        {/* =========================================================================
            3-COLUMN INTERACTIVE COMMAND CENTER (Organic Staggered Offsets)
            ========================================================================= */}
        <div className="relative my-4 md:my-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 w-full">

          {/* -----------------------------------------------------------------------
              LEFT COLUMN: 4 STAGGERED NON-INTERACTIVE DISPLAY BADGES
              ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex flex-col gap-5 w-52 xl:w-56 shrink-0 z-10">
            {leftNodes.map((node, idx) => {
              const IconComp = node.icon;
              const isHovered = hoveredNode === node.id;
              const motionConfig = leftMotionConfigs[idx] || leftMotionConfigs[0];
              return (
                <motion.div
                  key={node.id}
                  animate={{ y: motionConfig.y }}
                  transition={{
                    duration: motionConfig.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: motionConfig.delay,
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`w-full cursor-default select-none transition-transform duration-300 ${node.offsetClass}`}
                >
                  <div
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass-base transition-all duration-300 ${isHovered
                      ? "border-[#00BFFF]/60 shadow-[0_0_20px_rgba(0,191,255,0.3)] bg-navy/80"
                      : "border-white/10 hover:border-[#00BFFF]/40"
                      }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl bg-[#05070C] border border-[#C8D5E5]/15 flex items-center justify-center shrink-0"
                      style={{ color: node.color }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="text-left flex-1 min-w-0">
                      <span className="text-xs font-semibold text-white tracking-tight leading-none block truncate">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-[#C8D5E5]/60 truncate mt-1 block">
                        {node.popularItems}
                      </span>
                    </div>

                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* -----------------------------------------------------------------------
              CENTER SEARCH CONSOLE: THE CORE HUB
              ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full flex-1 max-w-xl xl:max-w-2xl mx-auto z-20 flex flex-col items-center"
          >
            {/* The Shell */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative h-13 md:h-15 w-full rounded-full glass-elevated border border-white/20 p-1.5 flex items-center justify-between gap-1.5 md:gap-2 transition-all duration-300 focus-within:border-cyan/70 focus-within:shadow-[0_0_30px_rgba(0,191,255,0.4)]"
            >
              {/* Search Icon & Input */}
              <div className="flex items-center flex-1 h-full min-w-0">
                <Search className="text-[#C8D5E5]/60 w-4 h-4 md:w-5 md:h-5 ml-3 md:ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un service, outil IA ou abonnement..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-[#C8D5E5]/40 text-xs sm:text-sm px-2.5 md:px-3"
                />
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="h-full px-5 sm:px-7 rounded-full glass-button-primary text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          </motion.div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN: 4 STAGGERED NON-INTERACTIVE DISPLAY BADGES
              ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex flex-col gap-5 w-52 xl:w-56 shrink-0 z-10">
            {rightNodes.map((node, idx) => {
              const IconComp = node.icon;
              const isHovered = hoveredNode === node.id;
              const motionConfig = rightMotionConfigs[idx] || rightMotionConfigs[0];
              return (
                <motion.div
                  key={node.id}
                  animate={{ y: motionConfig.y }}
                  transition={{
                    duration: motionConfig.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: motionConfig.delay,
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`w-full cursor-default select-none transition-transform duration-300 ${node.offsetClass}`}
                >
                  <div
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass-base transition-all duration-300 ${isHovered
                      ? "border-[#00BFFF]/60 shadow-[0_0_20px_rgba(0,191,255,0.3)] bg-navy/80"
                      : "border-white/10 hover:border-[#00BFFF]/40"
                      }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl bg-[#05070C] border border-[#C8D5E5]/15 flex items-center justify-center shrink-0"
                      style={{ color: node.color }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="text-left flex-1 min-w-0">
                      <span className="text-xs font-semibold text-white tracking-tight leading-none block truncate">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-[#C8D5E5]/60 truncate mt-1 block">
                        {node.popularItems}
                      </span>
                    </div>

                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* -----------------------------------------------------------------------
              DYNAMIC SVG CONNECTING SIGNAL CABLES LAYER (Aligned with staggered nodes)
              ----------------------------------------------------------------------- */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none -z-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 1100 252"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="beam-glow-l" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#075BDB" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#00BFFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.1" />
                </linearGradient>

                <linearGradient id="beam-glow-r" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#075BDB" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#00BFFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* 4 Left Cable Conduits with calculated S-curves tracking staggered offsets */}
              {leftCablePaths.map((cable, i) => {
                const isHovered = hoveredNode === leftNodes[i]?.id;
                return (
                  <g key={`l-cable-${i}`}>
                    <path
                      d={cable.d}
                      stroke="url(#beam-glow-l)"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeOpacity={isHovered ? 0.9 : 0.25}
                      className="transition-all duration-300"
                    />
                    <path
                      d={cable.d}
                      stroke="#00BFFF"
                      strokeWidth={isHovered ? 3 : 2}
                      strokeDasharray="16 110"
                      strokeDashoffset="126"
                      className="animate-pulse"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="126"
                        to="0"
                        dur={cable.dur}
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                );
              })}

              {/* 4 Right Cable Conduits with calculated S-curves tracking staggered offsets */}
              {rightCablePaths.map((cable, i) => {
                const isHovered = hoveredNode === rightNodes[i]?.id;
                return (
                  <g key={`r-cable-${i}`}>
                    <path
                      d={cable.d}
                      stroke="url(#beam-glow-r)"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeOpacity={isHovered ? 0.9 : 0.25}
                      className="transition-all duration-300"
                    />
                    <path
                      d={cable.d}
                      stroke="#00BFFF"
                      strokeWidth={isHovered ? 3 : 2}
                      strokeDasharray="16 110"
                      strokeDashoffset="126"
                      className="animate-pulse"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="126"
                        to="0"
                        dur={cable.dur}
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            MOBILE / TABLET ADAPTATION (< 1024px): Responsive 2x4 Display Grid
            ----------------------------------------------------------------------- */}
        <div className="lg:hidden w-full my-3">
          <div className="text-left mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Abonnements Populaires :</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[...leftNodes, ...rightNodes].map((node) => {
              const IconComp = node.icon;
              return (
                <div
                  key={`mobile-${node.id}`}
                  className="flex items-center gap-2 p-2 rounded-xl glass-base border border-white/10 cursor-default select-none"
                >
                  <div
                    className="w-7 h-7 rounded-lg bg-[#05070C] border border-[#C8D5E5]/15 flex items-center justify-center shrink-0"
                    style={{ color: node.color }}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left truncate">
                    <span className="text-[11px] font-semibold text-white block truncate">
                      {node.name}
                    </span>
                    <span className="text-[9px] text-[#C8D5E5]/60 block truncate">
                      {node.popularItems.split("•")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
