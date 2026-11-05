"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Send, Mail, Phone, ShieldCheck, Zap, Clock, Heart } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-[#101B2C] bg-[#05070C] pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-electric/10 to-transparent blur-2xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Digitex Logo"
                width={48}
                height={48}
                className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(0,191,255,0.45)]"
              />
              <span className="text-2xl font-black tracking-tight text-white">
                Digitex<span className="text-cyan">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-silver/70">
              La référence en Algérie pour l&apos;achat d&apos;abonnements digitaux, outils d&apos;intelligence artificielle et licences logicielles authentiques au meilleur tarif.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-navy border border-navy-border flex items-center justify-center text-silver hover:text-white hover:border-cyan hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`https://t.me/${siteConfig.telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-navy border border-navy-border flex items-center justify-center text-silver hover:text-white hover:border-cyan hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] transition"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="h-10 w-10 rounded-xl bg-navy border border-navy-border flex items-center justify-center text-silver hover:text-white hover:border-cyan hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] transition"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Catalogue & Services
            </h4>
            <ul className="space-y-2.5 text-sm text-silver/70">
              <li>
                <Link href="/products?category=ai" className="hover:text-cyan transition">
                  Intelligence Artificielle (ChatGPT, Claude)
                </Link>
              </li>
              <li>
                <Link href="/products?category=streaming" className="hover:text-cyan transition">
                  Streaming & Cinéma (Netflix 4K, Spotify)
                </Link>
              </li>
              <li>
                <Link href="/products?category=design" className="hover:text-cyan transition">
                  Design & Création (Canva, CapCut, Adobe)
                </Link>
              </li>
              <li>
                <Link href="/products?category=utilities" className="hover:text-cyan transition">
                  Licences Windows, Office & NordVPN
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-cyan transition text-cyan font-medium">
                  → Voir tout le catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pourquoi Choisir Digitex */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Nos Engagements
            </h4>
            <ul className="space-y-3 text-sm text-silver/80">
              <li className="flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                <span>Livraison ultra rapide en 5 à 15 minutes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Garantie de remplacement 100% sur toute la durée</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-electric shrink-0 mt-0.5" />
                <span>Support réactif 7j/7 par WhatsApp & Telegram</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-bold text-silver/60">
                Paiements acceptés en Algérie
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-[#101B2C] border border-white/10 text-[11px] font-semibold text-white">
                  BaridiMob
                </span>
                <span className="px-2.5 py-1 rounded bg-[#101B2C] border border-white/10 text-[11px] font-semibold text-white">
                  CCP
                </span>
                <span className="px-2.5 py-1 rounded bg-[#101B2C] border border-white/10 text-[11px] font-semibold text-white">
                  Binance Pay (USDT)
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Assistance Client
            </h4>
            <div className="space-y-2.5 text-sm text-silver/70">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan" />
                <span className="text-white font-medium">{siteConfig.whatsappDisplay}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan" />
                <span>{siteConfig.email}</span>
              </p>
              <p className="text-xs text-silver/50 pt-2">
                Horaires de traitement : 09h00 - 00h00
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-navy-border bg-navy hover:bg-navy-light text-white px-4 py-2 text-xs font-semibold hover:border-cyan/40 transition"
              >
                <span>Accéder au support d&apos;aide</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-silver/50">
          <p>© {currentYear} {siteConfig.name}. Tous droits réservés. Conçu pour le commerce digital algérien.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <Heart className="h-3.5 w-3.5 text-red-500 fill-current" /> pour les créateurs & pros en Algérie
          </p>
        </div>
      </div>
    </footer>
  );
}
