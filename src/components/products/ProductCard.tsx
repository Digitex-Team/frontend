"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Check, ArrowRight, Sparkles } from "lucide-react";
import { Product, SubscriptionTier } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product, plan?: SubscriptionTier) => void;
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const lowestPrice = Math.min(...product.plans.map((p) => p.priceDZD));
  const popularPlan = product.plans.find((p) => p.isPopular) || product.plans[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0E1726] border border-[#1F2E45] p-5 sm:p-6 transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_0_35px_-8px_rgba(0,191,255,0.25)]"
    >
      {/* Top Banner & Category */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="cyan" size="sm">
            {product.categoryLabel}
          </Badge>
          {product.badge && (
            <Badge variant="electric" size="sm" icon={<Sparkles className="h-3 w-3" />}>
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Product Title & Short description */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-cyan transition">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs sm:text-sm text-silver/70 line-clamp-2 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Duration pills available */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.plans.map((plan) => (
            <span
              key={plan.id}
              className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                plan.isPopular
                  ? "bg-electric/20 border-electric/40 text-blue-200"
                  : "bg-navy-light/40 border-white/5 text-silver/75"
              }`}
            >
              {plan.duration}
            </span>
          ))}
        </div>

        {/* Key bullets */}
        <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
          {product.features.slice(0, 2).map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-silver/80">
              <Check className="h-3.5 w-3.5 text-cyan shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Area: Pricing & Actions */}
      <div className="mt-6 border-t border-[#1F2E45]/60 pt-4">
        {/* Availability & Delivery */}
        <div className="flex items-center justify-between text-xs text-silver/60 mb-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En Stock
          </span>
          <span className="inline-flex items-center gap-1 text-silver/70">
            <Zap className="h-3 w-3 text-cyan" />
            {product.deliveryTime}
          </span>
        </div>

        {/* Price display */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-silver/50 block">
              À partir de
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">
                {formatPrice(lowestPrice)}
              </span>
              <span className="text-xs font-bold text-cyan">DZD</span>
            </div>
          </div>
          {popularPlan.oldPriceDZD && (
            <span className="text-xs text-silver/40 line-through">
              {formatPrice(popularPlan.oldPriceDZD)} DZD
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-navy-border bg-navy hover:bg-navy-light text-silver hover:text-white text-xs font-semibold py-2.5 transition active:scale-95 text-center"
          >
            Détails
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOrderClick(product, popularPlan)}
            className="w-full justify-center"
            iconRight={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Commander
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
