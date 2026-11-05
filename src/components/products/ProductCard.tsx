"use client";

import React from "react";
import Link from "next/link";
import { Product, SubscriptionTier } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product, plan?: SubscriptionTier) => void;
}

function ProductBrandLogo({ slug, name, color }: { slug: string; name: string; color?: string }) {
  const brandColor = color || "#00BFFF";

  // Authentic vector logos for services
  if (slug.includes("chatgpt")) {
    // OpenAI Rosette
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
        <path
          d="M21.5 10.3c-.3-1.6-1.5-2.9-3.1-3.3-.2-.8-.6-1.6-1.3-2.2-1.3-1.2-3.2-1.5-4.8-.8-.6-.6-1.4-1-2.3-1.1-1.8-.2-3.6.8-4.4 2.4-1.6.3-2.9 1.5-3.3 3.1-.8.2-1.6.6-2.2 1.3-1.2 1.3-1.5 3.2-.8 4.8-.6.6-1 1.4-1.1 2.3-.2 1.8.8 3.6 2.4 4.4.3 1.6 1.5 2.9 3.1 3.3.2.8.6 1.6 1.3 2.2 1.3 1.2 3.2 1.5 4.8.8.6.6 1.4 1 2.3 1.1 1.8.2 3.6-.8 4.4-2.4 1.6-.3 2.9-1.5 3.3-3.1.8-.2 1.6-.6 2.2-1.3 1.2-1.3 1.5-3.2.8-4.8.6-.6 1-1.4 1.1-2.3.2-1.8-.8-3.6-2.4-4.4z"
          stroke={brandColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7.5v9M7.5 12h9M8.8 8.8l6.4 6.4M8.8 15.2l6.4-6.4"
          stroke={brandColor}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug.includes("claude")) {
    // Anthropic Starburst
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill={brandColor}>
        <path d="M12 2l1.6 5.8 5.8-1.6-3.6 4.8 5.4 2.8-5.8 1.8 2.6 5.4-5.4-2.8-2.6 5.4-1.8-5.8-5.4 2.8 2.8-5.4-5.8-1.8 5.4-2.8-3.6-4.8 5.8 1.6z" />
      </svg>
    );
  }

  if (slug.includes("netflix")) {
    // Netflix bold N
    return (
      <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none">
        <path d="M4 2h4.5v20H4z" fill="#E50914" />
        <path d="M15.5 2H20v20h-4.5z" fill="#E50914" />
        <path d="M4 2l12 20h4L7.5 2H4z" fill="#B20710" />
      </svg>
    );
  }

  if (slug.includes("spotify")) {
    // Spotify Waves
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.858.207c-2.35-1.436-5.308-1.76-8.792-.963a.625.625 0 0 1-.28-1.22c3.805-.87 7.075-.497 9.722 1.118a.624.624 0 0 1 .208.858zm1.226-2.723a.78.78 0 0 1-1.074.257c-2.69-1.654-6.79-2.133-9.972-1.168a.781.781 0 0 1-.469-1.491c3.633-1.103 8.153-.569 11.258 1.328a.78.78 0 0 1 .257 1.074zm.105-2.835c-3.226-1.916-8.544-2.093-11.624-1.158a.936.936 0 1 1-.55-1.79c3.535-1.073 9.404-.863 13.116 1.341a.936.936 0 1 1-.942 1.607z" />
      </svg>
    );
  }

  if (slug.includes("canva")) {
    // Canva Stylized C
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-md"
        style={{
          background: "linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)",
        }}
      >
        <span className="italic font-serif">C</span>
      </div>
    );
  }

  if (slug.includes("capcut")) {
    // CapCut Modern Monogram
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0E1726" />
        <path d="M5 9l7 3-7 3V9zm14 0l-7 3 7 3V9z" fill="#00BFFF" />
        <path d="M12 4v16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug.includes("midjourney")) {
    // Midjourney Sailboat
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.7">
        <path d="M12 3v13M12 3l7 9h-7M12 6L6 12h6M4 18l3 3h10l3-3H4z" />
      </svg>
    );
  }

  if (slug.includes("adobe")) {
    // Adobe Creative Cloud A
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M14.5 2H23v20h-4.3l-4.2-10.8zm-5 0H1v20h4.3l4.2-10.8zM12 9.5l3.8 10.5h-2.5l-1.3-3.8H8.5z" />
      </svg>
    );
  }

  if (slug.includes("windows")) {
    // Windows 4 Tiles
    return (
      <svg className="w-11 h-11" viewBox="0 0 24 24" fill="#0078D4">
        <path d="M2 3.5l8-1.1v8.8H2V3.5zm9.6-1.3L22 1v10.2h-10.4V2.2zM2 12.8h8v8.8l-8-1.1v-7.7zm9.6 0H22V23l-10.4-1.2v-9z" />
      </svg>
    );
  }

  if (slug.includes("office") || slug.includes("microsoft")) {
    // Office / Microsoft 365
    return (
      <svg className="w-11 h-11" viewBox="0 0 24 24" fill="#D83B01">
        <path d="M21.5 6.2L13.8 2.3c-.5-.3-1.1-.3-1.6 0L4.5 6.2c-.5.3-.8.8-.8 1.4v8.8c0 .6.3 1.1.8 1.4l7.7 3.9c.5.3 1.1.3 1.6 0l7.7-3.9c.5-.3.8-.8.8-1.4V7.6c0-.6-.3-1.1-.8-1.4zM12 4.1l6.4 3.2L12 10.5 5.6 7.3 12 4.1z" />
      </svg>
    );
  }

  if (slug.includes("nordvpn")) {
    // NordVPN Mountain
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4687FF" fillOpacity="0.2" />
        <path d="M4 17l5-8 4 6 3-4 4 6H4z" fill="#4687FF" />
      </svg>
    );
  }

  // Fallback: stylish monogram badge
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg border border-white/10"
      style={{ backgroundColor: brandColor }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const lowestPrice = Math.min(...product.plans.map((p) => p.priceDZD));
  const popularPlan = product.plans.find((p) => p.isPopular) || product.plans[0];

  return (
    <div className="relative rounded-2xl p-4 bg-[#101B2C]/50 border border-[#C8D5E5]/10 hover:border-[#00BFFF]/40 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md flex flex-col justify-between">
      {/* 1. Top Badge Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-cyan px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/20">
            {popularPlan.duration || "1 Mois"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Instantané
          </span>
        </div>

        {/* 2. Visual Center */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative overflow-hidden rounded-xl bg-[#05070C]/60 border border-white/5 p-4 aspect-video flex items-center justify-center group/visual"
        >
          {/* Subtle brand glow backdrop */}
          <div
            className="absolute inset-0 opacity-20 group-hover/visual:opacity-35 transition-opacity blur-xl pointer-events-none"
            style={{ backgroundColor: product.brandColor || "#075BDB" }}
          />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <ProductBrandLogo slug={product.slug} name={product.name} color={product.brandColor} />
          </div>
        </Link>

        {/* 3. Product Title */}
        <Link href={`/products/${product.slug}`} className="block mt-3">
          <h3 className="text-base font-semibold text-white group-hover:text-[#00BFFF] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* 4. Footer Info & Action Row */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-[#C8D5E5]/60 block leading-tight">À partir de</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-white">{formatPrice(lowestPrice)}</span>
            <span className="text-xs font-bold text-cyan">DZD</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOrderClick(product, popularPlan)}
          className="px-4 py-1.5 rounded-full bg-[#075BDB] hover:bg-[#075BDB]/90 text-xs font-medium text-white shadow-[0_0_12px_rgba(7,91,219,0.3)] hover:shadow-[0_0_18px_rgba(0,191,255,0.5)] transition active:scale-95 cursor-pointer"
        >
          Commander
        </button>
      </div>
    </div>
  );
}
