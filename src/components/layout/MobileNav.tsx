"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ChevronRight, Zap } from "lucide-react";
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
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Bonjour Digitex, je souhaite me renseigner sur vos abonnements."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-3 px-4 font-bold text-sm shadow-[0_0_20px_rgba(37,211,102,0.35)] transition active:scale-95"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>WhatsApp Express</span>
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
