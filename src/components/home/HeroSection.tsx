"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, MessageCircle, ArrowRight, ShieldCheck, Users, Clock, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Bonjour Digitex, je souhaite commander un abonnement ou poser une question."
  )}`;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Cyber Glow & Tech Grids */}
      <div className="absolute inset-0 -z-10 tech-radial-bg pointer-events-none" />
      <div className="absolute inset-0 -z-10 tech-grid-pattern opacity-40 pointer-events-none" />

      {/* Radial Cyan accent flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-64 w-[600px] rounded-full bg-cyan/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-navy/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-silver shadow-[0_0_20px_rgba(0,191,255,0.15)] backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_#00BFFF] animate-pulse" />
          <span className="text-white font-bold">⚡ Livraison en 5 à 15 minutes</span>
          <span className="text-silver/50">•</span>
          <span className="text-cyan">100% Garantie & Remplacement</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
        >
          Vos Abonnements Digitaux &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue-400 to-electric glow-text-cyan">
            Outils IA
          </span>{" "}
          au Meilleur Prix en Algérie
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-silver/80 max-w-2xl mx-auto leading-relaxed"
        >
          Accédez à Netflix, ChatGPT Plus, Claude Pro, Canva, CapCut et licences officielles sans carte internationale. Paiement simple et instantané via{" "}
          <strong className="text-white font-bold">BaridiMob & CCP</strong>.
        </motion.p>

        {/* Dual Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-electric hover:bg-electric-hover text-white px-8 py-4 font-bold text-base shadow-[0_0_25px_rgba(7,91,219,0.45)] hover:shadow-[0_0_35px_rgba(7,91,219,0.7)] transition active:scale-95"
          >
            <Sparkles className="h-5 w-5 text-cyan" />
            <span>Explorer le catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-navy-border bg-navy/90 hover:bg-navy-light text-white px-6 py-4 font-bold text-base hover:border-cyan/40 shadow-sm transition active:scale-95"
          >
            <MessageCircle className="h-5 w-5 text-emerald-400 fill-current" />
            <span>Assistance Directe</span>
          </a>
        </motion.div>

        {/* Trust Badges Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-navy/50 border border-navy-border/80 backdrop-blur-sm">
            <Users className="h-6 w-6 text-cyan mb-1.5" />
            <span className="text-xl font-black text-white">4,800+</span>
            <span className="text-xs text-silver/60">Clients satisfaits en Algérie</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-navy/50 border border-navy-border/80 backdrop-blur-sm">
            <Clock className="h-6 w-6 text-electric mb-1.5" />
            <span className="text-xl font-black text-white">5 - 15 Min</span>
            <span className="text-xs text-silver/60">Livraison instantanée</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-navy/50 border border-navy-border/80 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-emerald-400 mb-1.5" />
            <span className="text-xl font-black text-white">100% Garanti</span>
            <span className="text-xs text-silver/60">Remplacement sans frais</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-navy/50 border border-navy-border/80 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-yellow-400 mb-1.5" />
            <span className="text-xl font-black text-white">BaridiMob</span>
            <span className="text-xs text-silver/60">Paiement local immédiat</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

