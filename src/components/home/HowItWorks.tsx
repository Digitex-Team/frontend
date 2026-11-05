"use client";

import React from "react";
import { CheckCircle2, CreditCard, Send, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choisissez votre abonnement",
      description:
        "Parcourez notre catalogue et sélectionnez la formule idéale : profil partagé économique ou compte privé exclusif, pour 1 mois, 3 mois ou 1 an.",
      icon: <Sparkles className="h-6 w-6 text-cyan" />,
      badge: "Formules Flexibles",
    },
    {
      number: "02",
      title: "Paiement Rapide & 100% Algérien",
      description:
        "Réglez en quelques secondes sans carte internationale via BaridiMob (virement instantané sans frais), CCP à la poste ou Binance Pay USDT.",
      icon: <CreditCard className="h-6 w-6 text-electric" />,
      badge: "BaridiMob & CCP",
    },
    {
      number: "03",
      title: "Activation & Livraison Immédiate",
      description:
        "Recevez vos accès officiels directement sur WhatsApp et Email en 5 à 15 minutes, accompagnés de notre garantie totale de remplacement.",
      icon: <Send className="h-6 w-6 text-emerald-400" />,
      badge: "5 - 15 Minutes",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#080E18] border-y border-[#101B2C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan block mb-2">
            Simplicité & Rapidité
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-silver/70">
            Un processus d&apos;achat optimisé en 3 étapes sans complication pour obtenir vos services préférés en Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-3xl glass-elevated glass-glare overflow-hidden p-8 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl glass-button-secondary flex items-center justify-center group-hover:scale-110 transition duration-300">
                    {step.icon}
                  </div>
                  <span className="font-mono text-3xl font-black text-white/10 group-hover:text-cyan/20 transition">
                    {step.number}
                  </span>
                </div>

                <div className="inline-block rounded-md bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-silver/80 mb-3">
                  {step.badge}
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan transition">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-silver/70 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Assistance dédiée 7j/7</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
