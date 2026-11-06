"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ShieldCheck,
  Check,
  MessageCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Product, SubscriptionTier } from "@/types";
import { siteConfig } from "@/data/siteConfig";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderModal } from "@/components/products/OrderModal";
import { useOrderState } from "@/hooks/useOrderState";
import { formatPrice } from "@/lib/utils";

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

  // Order modal hook
  const {
    isOpen,
    product: orderProduct,
    selectedPlan,
    setSelectedPlan,
    formData,
    updateField,
    openOrder,
    closeOrder,
    getWhatsAppMessageUrl,
  } = useOrderState();

  const handleOpenOrder = () => {
    openOrder(product, currentPlan);
  };

  const whatsappDirectUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Bonjour Digitex, j'ai une question concernant l'abonnement ${product.name} (${currentPlan.duration}).`
  )}`;

  const description =
    product.fullDesc || product.shortDesc || product.subtitle || product.tagline;
  const categoryLabel = product.categoryLabel || product.category;

  return (
    <div className="py-8 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-silver/60 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-cyan transition">
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-cyan transition">
          Abonnements
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Visual Showcase Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl glass-elevated p-8 text-center overflow-hidden shadow-[0_0_40px_-10px_rgba(7,91,219,0.25)] lg:sticky lg:top-24">
            {/* Ambient Brand Glow */}
            <div
              className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: product.brandColor || "#075BDB" }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Backlit App Squircle Icon */}
              <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden bg-[#05070C]/80 border border-white/10 shadow-2xl mb-6">
                <div
                  className="absolute inset-0 blur-xl opacity-50"
                  style={{ backgroundColor: product.brandColor || "#00BFFF" }}
                />
                <div className="relative z-10 flex items-center justify-center p-3">
                  {product.image && product.image.startsWith("/") ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg border border-white/10"
                      style={{ backgroundColor: product.brandColor || "#075BDB" }}
                    >
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {categoryLabel && (
                <Badge variant="cyan" size="md">
                  {categoryLabel}
                </Badge>
              )}

              <h2 className="mt-3 text-2xl font-black text-white">
                {product.name}
              </h2>

              {(product.subtitle || product.tagline) && (
                <p className="mt-2 text-xs sm:text-sm text-silver/80 leading-relaxed max-w-sm">
                  {product.subtitle || product.tagline}
                </p>
              )}

              {/* Delivery & Warranty Badges (only rendered if specified) */}
              {(product.deliveryTime || product.warranty) && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {product.deliveryTime && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Livraison {product.deliveryTime}
                    </span>
                  )}

                  {product.warranty && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/15 border border-electric/30 px-3 py-1 text-xs font-semibold text-blue-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {product.warranty}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Plan Selection, Action & Avantages (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
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

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {product.name}
            </h1>

            {description && (
              <p className="mt-3 text-sm sm:text-base text-silver/80 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Plan Duration Selector Box */}
          <div className="rounded-2xl glass-elevated border border-cyan/40 p-6 shadow-[0_0_30px_-5px_rgba(0,191,255,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-silver">
                Sélectionnez votre formule :
              </span>
              <span className="text-xs font-semibold text-cyan">
                {currentPlan.accountType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availablePlans.map((plan) => {
                const isSelected = currentPlan.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setCurrentPlan(plan)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-electric/25 border-cyan shadow-[0_0_20px_rgba(0,191,255,0.3)] ring-1 ring-cyan backdrop-blur-md"
                        : "bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {plan.duration}
                      </span>
                      {plan.savingsBadge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan/20 text-cyan font-bold">
                          {plan.savingsBadge}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-lg font-black text-white">
                      {formatPrice(plan.priceDZD)}{" "}
                      <span className="text-xs font-bold text-cyan">DZD</span>
                    </div>

                    {plan.oldPriceDZD && (
                      <span className="text-[11px] text-silver/40 line-through block mt-0.5">
                        {formatPrice(plan.oldPriceDZD)} DZD
                      </span>
                    )}

                    <span className="text-[10px] text-silver/60 mt-1 block">
                      {plan.accountType}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Total Price Bar & Checkout Trigger */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-silver/60 block">Total à payer :</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {formatPrice(currentPlan.priceDZD)}
                  </span>
                  <span className="text-sm font-bold text-cyan">
                    {product.currency || "DZD"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenOrder}
                  className="w-full sm:w-auto text-base"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Commander Maintenant
                </Button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl glass-button-secondary p-3.5 text-emerald-400 hover:text-emerald-300 transition shrink-0"
                  title="Poser une question sur WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Avantages & Inclus dans votre commande — fully driven by product.features */}
          {product.features && product.features.length > 0 && (
            <div className="rounded-2xl glass-base p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan" />
                <span>Avantages & Inclus dans votre commande</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-silver/85">
                    <Check className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Order / Checkout Modal */}
      <OrderModal
        isOpen={isOpen}
        onClose={closeOrder}
        product={orderProduct}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        formData={formData}
        onUpdateField={updateField}
        getWhatsAppUrl={getWhatsAppMessageUrl}
      />
    </div>
  );
}
