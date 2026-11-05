"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Abonnements", href: "/products" },
    { label: "Comment ça marche", href: "/#how-it-works" },
    { label: "Contact & Support", href: "/contact" },
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs bg-[#0E1726] border-l border-[#1F2E45] p-6 shadow-2xl flex flex-col justify-between lg:hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                  <Image
                    src="/logo.png"
                    alt="Digitex Logo"
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(0,191,255,0.45)]"
                  />
                  <span className="text-xl font-black tracking-tight text-white">
                    Digitex<span className="text-cyan">.</span>
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-silver hover:text-white hover:bg-white/5 transition"
                  aria-label="Fermer le menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-silver hover:text-white hover:bg-navy-light/60 transition group"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-silver/40 group-hover:text-cyan transition" />
                  </Link>
                ))}
              </nav>

              {/* Guarantee banner */}
              <div className="mt-8 rounded-xl border border-cyan/20 bg-cyan/5 p-4">
                <div className="flex items-center gap-2 text-cyan font-bold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Livraison 5-15 min</span>
                </div>
                <p className="mt-1 text-xs text-silver/80">
                  Paiement sécurisé via BaridiMob & CCP. Support 7j/7 par WhatsApp.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Bonjour Digitex, je souhaite me renseigner sur vos abonnements."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-electric hover:bg-electric-hover text-white py-3 px-4 font-bold text-sm shadow-[0_0_20px_rgba(7,91,219,0.35)] transition"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>WhatsApp Express</span>
              </a>
              <p className="text-center text-xs text-silver/50">
                {siteConfig.workingHours}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

