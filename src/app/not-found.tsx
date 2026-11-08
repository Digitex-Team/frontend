import React from "react";
import Link from "next/link";
import { Sparkles, Home, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export default function NotFound() {

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

        {/* Direct Instagram help link */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-silver/50 mb-2.5">
            Vous cherchez un abonnement introuvable ?
          </p>
          <a
            href={siteConfig.instagramUrl || "https://www.instagram.com/digitex.web/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Demandez-le directement à notre équipe sur Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}

