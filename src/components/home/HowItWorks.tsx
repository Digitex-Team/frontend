"use client";

import React from "react";
import { CheckCircle2, MessageCircle, Sparkles, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      pillTag: "Explorez le catalogue",
      title: "1. Choisissez ce qui vous intéresse",
      description:
        "Parcourez nos services (IA, streaming, design, licences) et repérez l'offre ou la durée qui correspond exactement à votre besoin.",
      icon: <Sparkles className="h-6 w-6 text-cyan" />,
      status: "Catalogue toujours à jour",
    },
    {
      number: "02",
      pillTag: "Devis clair & transparent",
      title: "2. Regardez le prix et contactez-nous",
      description:
        "Le tarif est affiché en toute clarté. Cliquez simplement sur votre moyen préféré (WhatsApp, Instagram, etc.) pour lancer la discussion avec nous.",
      icon: <MessageCircle className="h-6 w-6 text-[#075BDB]" />,
      status: "Réponse rapide garantie",
    },
    {
      number: "03",
      pillTag: "On s'occupe de tout",
      title: "3. On finalise ensemble en 2 minutes",
      description:
        "On vous répond tout de suite, on valide votre paiement (BaridiMob, CCP, etc.) et on vous envoie vos accès prêts à l'emploi.",
      icon: <Zap className="h-6 w-6 text-emerald-400" />,
      status: "Accompagnement & support 7j/7",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#080E18] border-y border-[#101B2C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan block mb-2">
            Simplicité & Rapidité
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-silver/70">
            Rien de compliqué. 3 étapes simples pour recevoir votre abonnement en quelques minutes.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-3xl glass-elevated glass-glare overflow-hidden p-6 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {/* Top Icon & Number Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl glass-button-secondary flex items-center justify-center group-hover:scale-110 transition duration-300">
                    {step.icon}
                  </div>
                  <span className="font-mono text-3xl font-black text-white/10 group-hover:text-cyan/20 transition">
                    {step.number}
                  </span>
                </div>

                {/* Pill Tag */}
                <div className="inline-block rounded-full bg-cyan/10 border border-cyan/20 px-3 py-0.5 text-[11px] font-semibold text-cyan mb-3">
                  {step.pillTag}
                </div>

                {/* Step Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-cyan transition-colors leading-snug tracking-tight">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-silver/70 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Status Row */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{step.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
