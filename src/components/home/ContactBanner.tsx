"use client";

import React from "react";
import { MessageCircle, Send, ShieldCheck, Zap } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function ContactBanner() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Bonjour l'équipe Digitex, j'ai une question avant de passer commande."
  )}`;

  const telegramUrl = `https://t.me/${siteConfig.telegramUsername}`;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1726] via-[#101B2C] to-[#0A1220] border border-cyan/30 p-8 sm:p-12 lg:p-16 shadow-[0_0_50px_-15px_rgba(7,91,219,0.35)]">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-cyan/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-0 h-72 w-72 rounded-full bg-electric/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan/10 border border-cyan/30 px-3.5 py-1 text-xs font-bold text-cyan mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>Besoin d&apos;aide ou d&apos;un compte sur-mesure ?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Notre équipe d&apos;assistance vous répond en{" "}
              <span className="text-cyan">moins de 5 minutes</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-silver/80">
              Des doutes sur un service ? Une commande urgente pour votre entreprise ou agence ? Contactez nos conseillers directement par WhatsApp ou Telegram 7j/7.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-silver/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Remplacement Garanti</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Conseillers en ligne actuellement</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white py-4 px-8 font-bold text-base shadow-[0_0_25px_rgba(37,211,102,0.4)] transition active:scale-95"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white py-4 px-8 font-bold text-base shadow-[0_0_25px_rgba(0,136,204,0.35)] transition active:scale-95"
            >
              <Send className="h-5 w-5" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

