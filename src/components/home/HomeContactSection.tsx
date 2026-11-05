"use client";

import React from "react";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function HomeContactSection() {
  const whatsappSalesUrl = `https://wa.me/${(siteConfig.whatsappSalesNumber || siteConfig.whatsappNumber).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Bonjour Digitex, je souhaite passer une commande ou obtenir des informations commerciales."
  )}`;

  const whatsappSupportUrl = `https://wa.me/${(siteConfig.whatsappSupportNumber || "+213770987654").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Bonjour Digitex SAV, j'ai besoin d'une assistance technique pour mon abonnement."
  )}`;

  const contactChannels = [
    {
      id: "whatsapp-sales",
      title: "WhatsApp Commercial",
      subtitle: siteConfig.whatsappSalesDisplay || "+213 (0) 555 12 34 56",
      badge: "Ventes & Commandes",
      href: whatsappSalesUrl,
      icon: <MessageCircle className="h-5 w-5 text-[#25D366]" />,
    },
    {
      id: "whatsapp-support",
      title: "WhatsApp Support & SAV",
      subtitle: siteConfig.whatsappSupportDisplay || "+213 (0) 770 98 76 54",
      badge: "Assistance 7j/7",
      href: whatsappSupportUrl,
      icon: <MessageCircle className="h-5 w-5 text-[#00BFFF]" />,
    },
    {
      id: "discord",
      title: "Communauté Discord",
      subtitle: "Rejoindre le serveur",
      badge: "Entraide & Annonces",
      href: siteConfig.discordUrl || "https://discord.gg/digitex",
      icon: <DiscordIcon className="h-5 w-5 text-[#5865F2]" />,
    },
    {
      id: "instagram",
      title: "Instagram Direct",
      subtitle: "@digitex.store",
      badge: "Nouveautés & DM",
      href: siteConfig.instagramUrl || "https://instagram.com/digitex.store",
      icon: <InstagramIcon className="h-5 w-5 text-[#E1306C]" />,
    },
    {
      id: "facebook",
      title: "Facebook Messenger",
      subtitle: "Digitex Store DZ",
      badge: "Page Officielle",
      href: siteConfig.facebookUrl || "https://facebook.com/digitex.storedz",
      icon: <FacebookIcon className="h-5 w-5 text-[#1877F2]" />,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      {/* Subtle ambient glows */}
      <div className="glow-orb-cyan w-[450px] h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Besoin d&apos;aide ou d&apos;une commande personnalisée ?
        </h2>

        <p className="mt-3 text-sm sm:text-base text-silver/70 max-w-2xl mx-auto">
          Notre équipe est disponible 7j/7 pour vous assister et activer vos abonnements immédiatement.
        </p>

        {/* 5 Action Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8 text-left">
          {contactChannels.map((channel, idx) => {
            const isLast = idx === 4;
            return (
              <a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-elevated flex items-center justify-between gap-3 px-5 py-4 rounded-2xl hover:border-[#00BFFF]/60 transition-all duration-300 group hover:-translate-y-0.5 ${isLast ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {channel.icon}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight block truncate group-hover:text-cyan transition-colors">
                        {channel.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#C8D5E5]/60 block truncate mt-0.5">
                      {channel.subtitle}
                    </span>
                  </div>
                </div>

                <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-silver/40 group-hover:text-cyan group-hover:border-cyan/40 shrink-0 transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
