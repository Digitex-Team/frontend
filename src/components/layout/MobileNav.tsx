"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Tous les abonnements", href: "/products", badge: "Catalogue" },
    { label: "Comment ça marche", href: "/#how-it-works" },
    { label: "Contact & Support", href: "/#contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs bg-[#0E1726] border-l border-white/10 p-5 sm:p-6 shadow-2xl flex flex-col justify-between md:hidden overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                  <Image
                    src="/logo.png"
                    alt="Digitex Logo"
                    width={36}
                    height={36}
                    className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(0,191,255,0.45)]"
                  />
                  <span className="text-xl font-black tracking-tight text-white">
                    Digitex<span className="text-cyan">.</span>
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-silver/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-1.5">
                {navLinks.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-silver hover:text-white hover:bg-white/[0.06] transition group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-silver/40 group-hover:text-cyan group-hover:translate-x-0.5 transition" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Guarantee banner */}
              <div className="mt-6 rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
                <div className="flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Livraison 5-15 min</span>
                </div>
                <p className="mt-1.5 text-xs text-silver/80 leading-relaxed">
                  Paiement 100% sécurisé via BaridiMob & CCP. Support direct 7j/7.
                </p>
              </div>
            </div>

            {/* Bottom Actions & Social */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href={siteConfig.instagramUrl || "https://www.instagram.com/digitex.web/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-3 px-4 font-bold text-sm shadow-[0_0_20px_rgba(253,29,29,0.35)] transition active:scale-95"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram Direct</span>
              </a>

              <a
                href={siteConfig.discordUrl || "https://discord.gg/Z3ZnhfrXR5"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#5865F2] py-2.5 px-4 font-bold text-xs transition"
              >
                <span>Serveur Discord Officiel</span>
              </a>

              <p className="text-center text-[11px] text-silver/50">
                {siteConfig.workingHours}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
