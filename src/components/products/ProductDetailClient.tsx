"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  Check,
  Layers,
  Star,
  Copy,
  ArrowUpRight,
  Smartphone,
  Building2,
  Coins,
  CreditCard,
  Zap,
} from "lucide-react";
import { Product, SubscriptionTier } from "@/types";
import { siteConfig } from "@/data/siteConfig";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { OrderModal } from "@/components/products/OrderModal";

// Vector Icons for Messengers (matching design system)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.19 8.19 0 0 1-1.26-4.46c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.49-1.41-1.74-.14-.26-.02-.39.11-.52.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
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

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Resolve available plans: use product.plans or create a default plan from price & duration
  const availablePlans: SubscriptionTier[] =
    product.plans && product.plans.length > 0
      ? product.plans
      : [
          {
            id: `${product.id}-default`,
            duration: product.duration || "1 Mois",
            durationMonths: 1,
            priceDZD: product.price || 0,
            accountType: "Compte Privé",
            isPopular: true,
          },
        ];

  // Active plan state
  const defaultPlan =
    availablePlans.find((p) => p.isPopular) || availablePlans[0];
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>(defaultPlan);

  const [copied, setCopied] = useState<boolean>(false);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);

  // Ref to scroll to order section from mobile sticky bar
  const orderSectionRef = useRef<HTMLDivElement>(null);

  // Pre-filled message for communication channels
  const orderMessage = `Bonjour Digitex ! Je souhaite commander ${product.name} (Formule : ${currentPlan.duration}) au prix de ${formatPrice(currentPlan.priceDZD)} DZD.`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Channel direct destination URLs
  const cleanPhone = (siteConfig.whatsappSalesNumber || siteConfig.whatsappNumber).replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMessage)}`;
  const instagramUrl = siteConfig.instagramUrl || "https://instagram.com/digitex.store";
  const facebookUrl = siteConfig.facebookUrl || "https://facebook.com/digitex.storedz";
  const discordUrl = siteConfig.discordUrl || "https://discord.gg/digitex";

  // Communication channels styled to perfectly match the site's dark cyber glassmorphism design system
  const communicationChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      subtitle: "Réponse en 5-15 min",
      badge: "Recommandé",
      icon: <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />,
      href: whatsappUrl,
    },
    {
      id: "instagram",
      name: "Instagram",
      subtitle: "@digitex.store",
      badge: "DM Direct",
      icon: <InstagramIcon className="h-5 w-5 text-[#E1306C]" />,
      href: instagramUrl,
    },
    {
      id: "facebook",
      name: "Facebook",
      subtitle: "Digitex Store DZ",
      badge: "Messenger",
      icon: <FacebookIcon className="h-5 w-5 text-[#1877F2]" />,
      href: facebookUrl,
    },
    {
      id: "discord",
      name: "Discord",
      subtitle: "Serveur officiel",
      badge: "Tickets 24/7",
      icon: <DiscordIcon className="h-5 w-5 text-[#5865F2]" />,
      href: discordUrl,
    },
  ];

  // Payment methods accepted list
  const paymentMethods = [
    {
      id: "baridimob",
      name: "BaridiMob",
      badge: "Instantané 24/7",
      desc: "Virement immédiat sans frais",
      icon: <Smartphone className="h-5 w-5 text-cyan" />,
    },
    {
      id: "ccp",
      name: "CCP / Poste",
      badge: "Classique",
      desc: "Versement poste ou mandat",
      icon: <Building2 className="h-5 w-5 text-amber-400" />,
    },
    {
      id: "flexy",
      name: "Flexy (+20%)",
      badge: "Tous opérateurs",
      desc: "Mobilis • Djezzy • Ooredoo",
      icon: <Zap className="h-5 w-5 text-emerald-400" />,
    },
    {
      id: "binance",
      name: "Binance Pay",
      badge: "USDT / Crypto",
      desc: "Sans frais de transaction",
      icon: <Coins className="h-5 w-5 text-yellow-400" />,
    },
    {
      id: "redotpay",
      name: "RedotPay",
      badge: "Crypto / Visa",
      desc: "Transfert ID ou carte",
      icon: <CreditCard className="h-5 w-5 text-rose-400" />,
    },
  ];

  const scrollToOrder = () => {
    orderSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const description =
    product.fullDesc || product.shortDesc || product.subtitle || product.tagline;
  const categoryLabel = product.categoryLabel || product.category;

  return (
    <div className="py-8 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 sm:pb-20 relative">
      {/* Ambient glows */}
      <div
        className="glow-orb-blue w-[500px] h-[500px] -top-20 -left-20 opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[400px] h-[400px] top-1/3 -right-20 opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Breadcrumbs */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 text-xs text-silver/60 mb-6 sm:mb-8 overflow-x-auto relative z-10"
      >
        <Link href="/" className="hover:text-cyan transition">
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-cyan transition">
          Abonnements
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white font-medium truncate">{product.name}</span>
      </motion.nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
        {/* Left Column: Visual Showcase Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-3xl glass-elevated p-6 sm:p-8 text-center overflow-hidden shadow-[0_0_40px_-10px_rgba(7,91,219,0.25)] lg:sticky lg:top-24">
            {/* Ambient Brand Glow */}
            <div
              className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: product.brandColor || "#075BDB" }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Backlit App Squircle Icon */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.25 }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center overflow-hidden bg-[#05070C]/80 border border-white/10 shadow-2xl mb-5"
              >
                <div
                  className="absolute inset-0 blur-xl opacity-60"
                  style={{ backgroundColor: product.brandColor || "#00BFFF" }}
                />
                <div className="relative z-10 flex items-center justify-center p-3">
                  {product.image && (product.image.startsWith("/") || product.image.startsWith("data:") || product.image.startsWith("http")) ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      unoptimized={product.image.startsWith("data:")}
                      className="object-contain max-h-16 max-w-16"
                      style={{ width: "auto", height: "auto" }}
                      priority
                    />
                  ) : (
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg border border-white/10"
                      style={{ backgroundColor: product.brandColor || "#075BDB" }}
                    >
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </motion.div>

              {categoryLabel && (
                <Badge variant="cyan" size="md">
                  {categoryLabel}
                </Badge>
              )}

              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                {product.name}
              </h2>

              {(product.subtitle || product.tagline) && (
                <p className="mt-2 text-xs sm:text-sm text-silver/80 leading-relaxed max-w-sm">
                  {product.subtitle || product.tagline}
                </p>
              )}

              {/* Rating stars & review count */}
              <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{product.rating ? `${product.rating} / 5` : "4.9 / 5"}</span>
                <span className="text-silver/50 font-normal">
                  ({product.reviewsCount || 180} avis clients DZ)
                </span>
              </div>

              {/* Delivery & Warranty Badges */}
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Livraison {product.deliveryTime || "5 - 15 min"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/15 border border-electric/30 px-3 py-1 text-xs font-semibold text-blue-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {product.warranty || "Garantie officielle"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Pricing, Plan Selection, Channels & Payment Info (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-7 space-y-6 sm:space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.inStock !== false && (
                <Badge variant="success" size="sm">
                  Disponible en Stock
                </Badge>
              )}
              {product.badge && (
                <Badge variant="electric" size="sm">
                  {product.badge}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {product.name}
            </h1>

            {description && (
              <p className="mt-3 text-sm sm:text-base text-silver/80 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* =========================================================================
              PLAN DURATION SELECTOR & IN-PAGE CHANNELS (Styled with Design System)
              ========================================================================= */}
          <div
            ref={orderSectionRef}
            className="rounded-2xl sm:rounded-3xl glass-elevated border border-cyan/40 p-5 sm:p-7 shadow-[0_0_30px_-5px_rgba(0,191,255,0.15)] scroll-mt-24"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-silver">
                SÉLECTIONNEZ VOTRE FORMULE :
              </span>
              <span className="text-xs font-semibold text-cyan">
                {currentPlan.accountType}
              </span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availablePlans.map((plan) => {
                const isSelected = currentPlan.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setCurrentPlan(plan)}
                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-electric/25 border-cyan shadow-[0_0_20px_rgba(0,191,255,0.3)] ring-1 ring-cyan backdrop-blur-md"
                        : "bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {plan.duration}
                      </span>
                      {plan.savingsBadge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan/20 text-cyan font-bold">
                          {plan.savingsBadge}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-lg sm:text-xl font-black text-white">
                      {formatPrice(plan.priceDZD)}{" "}
                      <span className="text-xs font-bold text-cyan">DZD</span>
                    </div>

                    {plan.oldPriceDZD && (
                      <span className="text-[11px] text-silver/40 line-through block mt-0.5">
                        {formatPrice(plan.oldPriceDZD)} DZD
                      </span>
                    )}

                    <span className="text-[10px] sm:text-[11px] text-silver/60 mt-1 block">
                      {plan.accountType}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Total Price Bar */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-silver/60 block">Total à payer :</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatPrice(currentPlan.priceDZD)}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-cyan">
                    {product.currency || "DZD"}
                  </span>
                </div>
              </div>

              {/* Actions: Direct Checkout & Quick Copy */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(true)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,191,255,0.4)] flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Commander</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-white/5 text-silver/80 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                  title="Copier le texte de commande"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Détails</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* =====================================================================
                DIRECT COMMUNICATION CHANNELS (Styled with Website Design System)
                ===================================================================== */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Contactez-nous sur l&apos;un de nos réseaux pour passer commande :
                </h3>
              </div>

              {/* 4 Glassmorphism Buttons Grid matching website design system */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communicationChannels.map((chan) => (
                  <motion.a
                    key={chan.id}
                    href={chan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-elevated flex items-center justify-between p-3.5 rounded-2xl border border-white/10 hover:border-[#00BFFF]/60 hover:shadow-[0_0_20px_rgba(0,191,255,0.25)] transition-all duration-200 cursor-pointer block group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#00BFFF]/40 transition-all">
                        {chan.icon}
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white group-hover:text-cyan transition-colors block truncate">
                            {chan.name}
                          </span>
                          {chan.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-silver/80">
                              {chan.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-silver/60 block truncate mt-0.5">
                          {chan.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-silver/40 group-hover:text-cyan group-hover:border-cyan/40 shrink-0 transition-colors">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* =====================================================================
              MOYENS DE PAIEMENT ACCEPTÉS (BaridiMob, CCP, Flexy +20%, Binance, RedotPay)
              ===================================================================== */}
          <div className="rounded-2xl sm:rounded-3xl glass-base p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan" />
                <span>Modes de paiement acceptés en Algérie</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                100% Sécurisé
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-3 flex items-start gap-3 hover:border-white/20 transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {pm.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {pm.name}
                      </span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-cyan/90 bg-cyan/10 px-1.5 py-0.2 rounded mt-0.5">
                      {pm.badge}
                    </span>
                    <p className="text-[11px] text-silver/60 mt-1 truncate">
                      {pm.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-silver/50">
              💡 Les coordonnées de paiement vous sont transmises instantanément lors de votre échange sur le réseau choisi.
            </p>
          </div>

          {/* Avantages & Inclus dans votre commande */}
          {product.features && product.features.length > 0 && (
            <div className="rounded-2xl sm:rounded-3xl glass-base p-5 sm:p-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan" />
                <span>Avantages & Inclus dans votre commande</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-silver/85">
                    <Check className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* =========================================================================
          MOBILE STICKY BOTTOM ACTION BAR (Smart Phone UX - 1 tap to contact)
          ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0E1726]/95 backdrop-blur-2xl border-t border-white/10 p-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-semibold text-silver/60 truncate">
            {product.name} • {currentPlan.duration}
          </div>
          <div className="text-lg font-black text-white leading-tight flex items-baseline gap-1">
            <span>{formatPrice(currentPlan.priceDZD)}</span>
            <span className="text-xs font-bold text-cyan">DZD</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={scrollToOrder}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,191,255,0.4)] active:scale-95 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Commander</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl glass-button-secondary text-emerald-400 hover:text-emerald-300 border border-white/10 active:scale-95"
            aria-label="Commander via WhatsApp"
            title="Commander via WhatsApp"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Direct Guest Checkout Modal with Live Backend Integration */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        product={product}
        selectedTier={currentPlan}
        productId={product.id}
        tierId={currentPlan.id}
      />
    </div>
  );
}
