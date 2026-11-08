"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  Loader2,
  Database,
  Layers,
  ChevronRight,
} from "lucide-react";
import { smartSearchProducts, SmartSearchResult } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface ServiceNode {
  id: string;
  name: string;
  popularItems: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  offsetClass: string;
}

const leftNodes: ServiceNode[] = [
  {
    id: "streaming",
    name: "Streaming 4K",
    popularItems: "Netflix 4K • Prime Video",
    icon: Tv,
    color: "#e50914",
    offsetClass: "-translate-x-6 xl:-translate-x-8",
  },
  {
    id: "vpn",
    name: "VPN & Sécurité",
    popularItems: "NordVPN • ExpressVPN",
    icon: ShieldCheck,
    color: "#00BFFF",
    offsetClass: "translate-x-3 xl:translate-x-4",
  },
  {
    id: "licenses",
    name: "Clés & Licences",
    popularItems: "Windows 11 • Office 365",
    icon: KeyRound,
    color: "#0078d4",
    offsetClass: "-translate-x-8 xl:-translate-x-10",
  },
  {
    id: "music",
    name: "Audio & Musique",
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
    popularItems: "ChatGPT Plus • Claude Pro",
    icon: Sparkles,
    color: "#10a37f",
    offsetClass: "translate-x-6 xl:translate-x-8",
  },
  {
    id: "design",
    name: "Design & Vidéo",
    popularItems: "Canva Pro • CapCut Pro",
    icon: Palette,
    color: "#00c4cc",
    offsetClass: "-translate-x-3 xl:-translate-x-4",
  },
  {
    id: "cloud",
    name: "Cloud & Stockage",
    popularItems: "Google One 2To • iCloud",
    icon: Cloud,
    color: "#075BDB",
    offsetClass: "translate-x-8 xl:translate-x-10",
  },
  {
    id: "dev",
    name: "Études & Dev",
    popularItems: "GitHub Copilot • JetBrains",
    icon: Terminal,
    color: "#9333ea",
    offsetClass: "translate-x-2 xl:translate-x-3",
  },
];

const leftMotionConfigs = [
  { y: [-4, 4, -4], duration: 4.2, delay: 0.1 },
  { y: [-5, 3, -5], duration: 5.1, delay: 0.6 },
  { y: [-3, 5, -3], duration: 3.8, delay: 0.3 },
  { y: [-5, 4, -5], duration: 4.7, delay: 0.8 },
];

const rightMotionConfigs = [
  { y: [-5, 5, -5], duration: 4.5, delay: 0.2 },
  { y: [-3, 4, -3], duration: 3.9, delay: 0.5 },
  { y: [-6, 4, -6], duration: 5.3, delay: 0.7 },
  { y: [-4, 3, -4], duration: 4.1, delay: 0.4 },
];

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

export function HeroInteractiveNetwork() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SmartSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search input by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query Backend Database directly via smartSearchProducts
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResult(null);
      setIsDropdownOpen(false);
      return;
    }

    let active = true;
    setSearchLoading(true);
    setIsDropdownOpen(true);

    smartSearchProducts(debouncedQuery)
      .then((res) => {
        if (active) {
          setSearchResult(res);
          setSearchLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setSearchLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative min-h-[540px] lg:min-h-[640px] flex flex-col justify-between py-6 md:py-8 lg:py-10 bg-[#05070C] border-b border-[#101B2C]">
      {/* Background Cyber Grid & Glows in overflow-hidden container */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(16, 27, 44, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 27, 44, 0.5) 1px, transparent 1px)`,
            backgroundSize: "3.5rem 3.5rem",
            maskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, #000 65%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, #000 65%, transparent 100%)",
          }}
        />

        {/* Ambient Radial Cyber Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-electric/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[180px] bg-cyan/10 blur-[90px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col justify-between flex-1">
        {/* =========================================================================
            TOP TYPOGRAPHY ZONE
            ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto pt-2">
          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.12] max-w-4xl mx-auto"
          >
            TOUS VOS ABONNEMENTS{" "}
            <span className="bg-gradient-to-r from-[#075BDB] via-[#00BFFF] to-[#C8D5E5] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,191,255,0.4)]">
              DIGITAUX
            </span>
            .<br className="hidden sm:inline" /> UNE SEULE PLATEFORME.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-3 text-xs sm:text-sm text-silver/70 max-w-xl mx-auto"
          >
            ChatGPT, Claude, Netflix, Canva, Windows et plus. Activation 5-15 min, commande sans compte via votre messagerie préférée.
          </motion.p>
        </div>

        {/* =========================================================================
            3-COLUMN INTERACTIVE COMMAND CENTER
            ========================================================================= */}
        <div className="relative my-4 md:my-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 w-full">
          {/* -----------------------------------------------------------------------
              LEFT COLUMN: 4 NODES
              ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex flex-col gap-4 w-52 xl:w-56 shrink-0 z-10">
            {leftNodes.map((node, idx) => {
              const IconComp = node.icon;
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
                  className={`w-full transition-transform duration-300 select-none cursor-default ${node.offsetClass}`}
                >
                  <div
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass-base border border-white/10 hover:border-[#00BFFF]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-9 h-9 rounded-xl bg-[#05070C] border border-[#C8D5E5]/15 flex items-center justify-center shrink-0 shadow-sm"
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
                        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: node.color, color: node.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* -----------------------------------------------------------------------
              CENTER SEARCH CONSOLE: THE CORE HUB WITH LIVE DB CATEGORY-AWARE SEARCH
              ----------------------------------------------------------------------- */}
          <motion.div
            ref={searchContainerRef}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full flex-1 max-w-xl xl:max-w-2xl mx-auto z-30 flex flex-col items-center relative"
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
                  onFocus={() => {
                    if (
                      searchResult &&
                      (searchResult.directMatches.length > 0 ||
                        searchResult.relatedMatches.length > 0)
                    ) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un service, outil IA ou abonnement..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-[#C8D5E5]/40 text-sm px-2.5 md:px-3"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResult(null);
                      setIsDropdownOpen(false);
                    }}
                    className="p-1 rounded-full text-silver/40 hover:text-white hover:bg-white/10 mr-1.5 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
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

            {/* Smart Live DB Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && debouncedQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-[#090E1A]/95 backdrop-blur-2xl border border-white/20 p-3.5 sm:p-4 shadow-[0_25px_60px_rgba(5,7,12,0.95),0_0_35px_rgba(0,191,255,0.2)] z-50 text-left max-h-[460px] overflow-y-auto"
                >
                  {/* Realtime DB Search Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 px-1 text-[11px]">
                    {searchLoading && (
                      <div className="flex items-center gap-1.5 text-cyan font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Recherche...</span>
                      </div>
                    )}
                  </div>

                  {searchLoading && !searchResult && (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-silver/60">
                      <Loader2 className="w-5 h-5 animate-spin text-cyan" />
                      <span className="text-xs">Interrogation de la base de données...</span>
                    </div>
                  )}

                  {searchResult && (
                    <div className="space-y-4">
                      {/* Direct Matches Section */}
                      {searchResult.directMatches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Résultats Directs ({searchResult.directMatches.length})</span>
                            </span>
                            <span className="text-[10px] text-silver/40">Correspondance exacte</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {searchResult.directMatches.map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.slug}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-[#075BDB]/15 border border-white/10 hover:border-cyan/50 transition-all flex items-center gap-3 cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-lg bg-midnight border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs font-bold text-white group-hover:text-cyan transition truncate">
                                      {prod.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-silver/60 truncate">
                                      {prod.categoryLabel}
                                    </span>
                                    <span className="text-[11px] font-bold text-white">
                                      {formatPrice(prod.price ?? 0)} DZD
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-silver/40 group-hover:text-cyan group-hover:translate-x-0.5 transition shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Same Category / Sibling Suggestions Section */}
                      {searchResult.relatedMatches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                              <Layers className="w-3 h-3" />
                              <span>
                                Aussi dans la même catégorie {searchResult.categoryName ? `(${searchResult.categoryName})` : ""}
                              </span>
                            </span>
                            <span className="text-[10px] text-silver/40">Services similaires suggérés</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {searchResult.relatedMatches.map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.slug}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="group p-2.5 rounded-xl bg-white/[0.02] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/40 transition-all flex items-center gap-3 cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-lg bg-midnight border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                                      {prod.name}
                                    </h4>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                      Similaire
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-silver/50 truncate">
                                      {prod.categoryLabel}
                                    </span>
                                    <span className="text-[11px] font-bold text-white">
                                      {formatPrice(prod.price ?? 0)} DZD
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-silver/40 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Results at all */}
                      {searchResult.directMatches.length === 0 && searchResult.relatedMatches.length === 0 && !searchLoading && (
                        <div className="py-6 text-center text-xs text-silver/60">
                          <p className="font-semibold text-white">Aucun service trouvé pour &quot;{debouncedQuery}&quot;</p>
                          <p className="text-[11px] text-silver/40 mt-1">
                            Essayez un mot-clé comme Netflix, ChatGPT, Canva, Windows ou Disney+
                          </p>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(false)}
                          className="text-silver/50 hover:text-white transition text-[11px] cursor-pointer"
                        >
                          Fermer [Échap]
                        </button>
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="font-bold text-cyan hover:text-white flex items-center gap-1.5 transition text-[11px] cursor-pointer"
                        >
                          <span>Voir tous les résultats pour &quot;{debouncedQuery}&quot;</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN: 4 NODES
              ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex flex-col gap-4 w-52 xl:w-56 shrink-0 z-10">
            {rightNodes.map((node, idx) => {
              const IconComp = node.icon;
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
                  className={`w-full transition-transform duration-300 select-none cursor-default ${node.offsetClass}`}
                >
                  <div
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass-base border border-white/10 hover:border-[#00BFFF]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-9 h-9 rounded-xl bg-[#05070C] border border-[#C8D5E5]/15 flex items-center justify-center shrink-0 shadow-sm"
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
                        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: node.color, color: node.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* -----------------------------------------------------------------------
              DYNAMIC SVG CONNECTING SIGNAL CABLES LAYER
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

              {leftCablePaths.map((cable, i) => (
                <g key={`l-cable-${i}`}>
                  <path
                    d={cable.d}
                    stroke="url(#beam-glow-l)"
                    strokeWidth={1.5}
                    strokeOpacity={0.3}
                    className="transition-all duration-300"
                  />
                  <path
                    d={cable.d}
                    stroke="#00BFFF"
                    strokeWidth={2}
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
              ))}

              {rightCablePaths.map((cable, i) => (
                <g key={`r-cable-${i}`}>
                  <path
                    d={cable.d}
                    stroke="url(#beam-glow-r)"
                    strokeWidth={1.5}
                    strokeOpacity={0.3}
                    className="transition-all duration-300"
                  />
                  <path
                    d={cable.d}
                    stroke="#00BFFF"
                    strokeWidth={2}
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
              ))}
            </svg>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            MOBILE / TABLET ADAPTATION (< 1024px): Touch-Friendly 2x4 Clickable Grid
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
                  className="flex items-center gap-2 p-2 rounded-xl glass-base border border-white/10 select-none cursor-default"
                >
                  <div className="flex items-center gap-2 w-full">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
