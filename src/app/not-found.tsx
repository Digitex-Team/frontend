import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, MessageCircle, Home, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export default function NotFound() {
  const cleanPhone = (siteConfig.whatsappSalesNumber || siteConfig.whatsappNumber || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Bonjour Digitex, je recherche un abonnement spécifique qui n'apparaît pas sur le site."
  )}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      {/* Background cyber glows */}
      <div
        className="glow-orb-blue w-[500px] h-[500px] -top-20 -left-20 opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[450px] h-[450px] -bottom-20 -right-20 opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          <span>Erreur 404 • Page Introuvable</span>
        </div>

        {/* 404 Giant Display */}
        <div className="relative my-2 select-none">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-[#C8D5E5] to-[#101B2C] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,191,255,0.35)] block">
            404
          </span>
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#075BDB]/20 border border-[#00BFFF]/40 text-cyan shadow-[0_0_15px_rgba(0,191,255,0.4)]">
              RESOURCE_NOT_FOUND
            </span>
          </div>
        </div>

        {/* Informative Text */}
        <h1 className="mt-6 text-2xl sm:text-3xl font-black text-white tracking-tight">
          Oups ! Ce service ou cette page n&apos;existe pas.
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-silver/70 leading-relaxed max-w-md mx-auto">
          L&apos;URL est peut-être erronée, l&apos;abonnement a été déplacé ou notre catalogue a été mis à jour.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Home className="w-4 h-4 text-silver" />
            <span>Accueil</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Voir le Catalogue</span>
          </Link>
        </div>

        {/* Direct WhatsApp help link */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-silver/50 mb-2.5">
            Vous cherchez un abonnement introuvable ?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Demandez-le directement à notre équipe sur WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

