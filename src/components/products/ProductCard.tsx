"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ChevronRight, Crown } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

/**
 * Authentic vector logos for services rendered inside the backlit squircle.
 */
function ProductBrandLogo({
  slug,
  name,
  color,
}: {
  slug: string;
  name: string;
  color?: string;
}) {
  const brandColor = color || "#00BFFF";
  const s = slug.toLowerCase();

  // 1. OpenAI ChatGPT Rosette
  if (s.includes("chatgpt") || s.includes("openai")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none">
        <path
          d="M21.5 10.3c-.3-1.6-1.5-2.9-3.1-3.3-.2-.8-.6-1.6-1.3-2.2-1.3-1.2-3.2-1.5-4.8-.8-.6-.6-1.4-1-2.3-1.1-1.8-.2-3.6.8-4.4 2.4-1.6.3-2.9 1.5-3.3 3.1-.8.2-1.6.6-2.2 1.3-1.2 1.3-1.5 3.2-.8 4.8-.6.6-1 1.4-1.1 2.3-.2 1.8.8 3.6 2.4 4.4.3 1.6 1.5 2.9 3.1 3.3.2.8.6 1.6 1.3 2.2 1.3 1.2 3.2 1.5 4.8.8.6.6 1.4 1 2.3 1.1 1.8.2 3.6-.8 4.4-2.4 1.6-.3 2.9-1.5 3.3-3.1.8-.2 1.6-.6 2.2-1.3 1.2-1.3 1.5-3.2.8-4.8.6-.6 1-1.4 1.1-2.3.2-1.8-.8-3.6-2.4-4.4z"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7.5v9M7.5 12h9M8.8 8.8l6.4 6.4M8.8 15.2l6.4-6.4"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 2. Anthropic Claude Starburst
  if (s.includes("claude") || s.includes("anthropic")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="#D97706">
        <path d="M12 2l1.6 5.8 5.8-1.6-3.6 4.8 5.4 2.8-5.8 1.8 2.6 5.4-5.4-2.8-2.6 5.4-1.8-5.8-5.4 2.8 2.8-5.4-5.8-1.8 5.4-2.8-3.6-4.8 5.8 1.6z" />
      </svg>
    );
  }

  // 3. Google Gemini Starburst
  if (s.includes("gemini") || s.includes("google")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="gemini-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E8FFF" />
            <stop offset="50%" stopColor="#9B72CB" />
            <stop offset="80%" stopColor="#D96570" />
            <stop offset="100%" stopColor="#FFC876" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
          fill="url(#gemini-star-grad)"
        />
      </svg>
    );
  }

  // 4. Snapchat+
  if (s.includes("snapchat") || s.includes("snap")) {
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#FFFC00] flex items-center justify-center shadow-md">
        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2">
          <path d="M12 3.5c-2.3 0-3.8 1.6-3.8 3.6 0 .8.2 1.8.4 2.2-.5.2-1.2.5-1.4 1.1-.2.5.1 1 .5 1.2.1.1.2.1.2.2-.1.3-.4.8-.8 1.1-.3.2-.5.5-.3.8.2.3.8.4 1.5.3.3.4.8.8 1.5.8.3 0 .7-.1 1-.2.4.2 1 .3 1.7.3.7 0 1.3-.1 1.7-.3.3.1.7.2 1 .2.7 0 1.2-.4 1.5-.8.7.1 1.3 0 1.5-.3.2-.3 0-.6-.3-.8-.4-.3-.7-.8-.8-1.1 0-.1.1-.1.2-.2.4-.2.7-.7.5-1.2-.2-.6-.9-.9-1.4-1.1.2-.4.4-1.4.4-2.2 0-2-1.5-3.6-3.8-3.6z" />
        </svg>
      </div>
    );
  }

  // 5. Apple iCloud
  if (s.includes("icloud") || s.includes("apple")) {
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#38B6FF] flex items-center justify-center shadow-lg">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      </div>
    );
  }

  // 6. Netflix
  if (s.includes("netflix")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none">
        <path d="M4 2h4.5v20H4z" fill="#E50914" />
        <path d="M15.5 2H20v20h-4.5z" fill="#E50914" />
        <path d="M4 2l12 20h4L7.5 2H4z" fill="#B20710" />
      </svg>
    );
  }

  // 7. Spotify
  if (s.includes("spotify")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.858.207c-2.35-1.436-5.308-1.76-8.792-.963a.625.625 0 0 1-.28-1.22c3.805-.87 7.075-.497 9.722 1.118a.624.624 0 0 1 .208.858zm1.226-2.723a.78.78 0 0 1-1.074.257c-2.69-1.654-6.79-2.133-9.972-1.168a.781.781 0 0 1-.469-1.491c3.633-1.103 8.153-.569 11.258 1.328a.78.78 0 0 1 .257 1.074zm.105-2.835c-3.226-1.916-8.544-2.093-11.624-1.158a.936.936 0 1 1-.55-1.79c3.535-1.073 9.404-.863 13.116 1.341a.936.936 0 1 1-.942 1.607z" />
      </svg>
    );
  }

  // 8. Canva
  if (s.includes("canva")) {
    return (
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xl text-white shadow-md"
        style={{ background: "linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)" }}
      >
        <span className="italic font-serif">C</span>
      </div>
    );
  }

  // 9. CapCut
  if (s.includes("capcut")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0E1726" />
        <path d="M5 9l7 3-7 3V9zm14 0l-7 3 7 3V9z" fill="#00BFFF" />
        <path d="M12 4v16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 10. Midjourney
  if (s.includes("midjourney")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.7">
        <path d="M12 3v13M12 3l7 9h-7M12 6L6 12h6M4 18l3 3h10l3-3H4z" />
      </svg>
    );
  }

  // 11. Adobe
  if (s.includes("adobe")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M14.5 2H23v20h-4.3l-4.2-10.8zm-5 0H1v20h4.3l4.2-10.8zM12 9.5l3.8 10.5h-2.5l-1.3-3.8H8.5z" />
      </svg>
    );
  }

  // 12. Windows / Microsoft
  if (s.includes("windows")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="#0078D4">
        <path d="M2 3.5l8-1.1v8.8H2V3.5zm9.6-1.3L22 1v10.2h-10.4V2.2zM2 12.8h8v8.8l-8-1.1v-7.7zm9.6 0H22V23l-10.4-1.2v-9z" />
      </svg>
    );
  }

  // 13. Office
  if (s.includes("office") || s.includes("microsoft")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="#D83B01">
        <path d="M21.5 6.2L13.8 2.3c-.5-.3-1.1-.3-1.6 0L4.5 6.2c-.5.3-.8.8-.8 1.4v8.8c0 .6.3 1.1.8 1.4l7.7 3.9c.5.3 1.1.3 1.6 0l7.7-3.9c.5-.3.8-.8.8-1.4V7.6c0-.6-.3-1.1-.8-1.4zM12 4.1l6.4 3.2L12 10.5 5.6 7.3 12 4.1z" />
      </svg>
    );
  }

  // 14. NordVPN
  if (s.includes("nordvpn") || s.includes("vpn")) {
    return (
      <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4687FF" fillOpacity="0.2" />
        <path d="M4 17l5-8 4 6 3-4 4 6H4z" fill="#4687FF" />
      </svg>
    );
  }

  // Fallback: stylish monogram badge
  return (
    <div
      className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg border border-white/10"
      style={{ backgroundColor: brandColor }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  // Determine default active plan or fallback price
  const defaultPlan =
    product.plans && product.plans.length > 0
      ? product.plans.find((p) => p.isPopular) || product.plans[0]
      : undefined;

  const currentPrice = defaultPlan ? defaultPlan.priceDZD : (product.price || 0);
  const isPopular = Boolean(product.isPopular || product.isBestseller);
  const subtitle = product.subtitle || product.tagline || product.categoryLabel;

  // Features list: take first 2 bullets
  const displayFeatures =
    product.features && product.features.length > 0
      ? product.features.slice(0, 2)
      : ["Accès officiel garanti", "Support technique 7j/7"];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        prefetch={true}
        className="group relative rounded-2xl p-4 md:p-5 bg-[#101B2C]/50 backdrop-blur-xl border border-white/10 hover:border-[#00BFFF]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(5,7,12,0.8)] hover:shadow-[0_15px_35px_rgba(0,191,255,0.18)] transition-all duration-300 flex flex-col justify-between h-full overflow-hidden block"
      >
        {/* Subtle specular top glare overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

        {/* =========================================================================
            A. TOP SECTION: App Squircle Icon (Left) + Details & Bullets (Right)
            ========================================================================= */}
        <div className="relative z-10 flex items-start gap-3.5 md:gap-4">
          {/* 1. Backlit App Squircle Icon */}
          <div
            className="w-13 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl relative shrink-0 flex items-center justify-center overflow-hidden bg-[#05070C]/80 border border-white/10 transition-transform duration-300 group-hover:scale-105"
            aria-label={product.name}
          >
            {/* Accent Halo / Backlight corresponding to brand color */}
            <div
              className="absolute inset-0 blur-lg opacity-40 transition-opacity duration-300 group-hover:opacity-75"
              style={{ backgroundColor: product.brandColor || "#00BFFF" }}
            />

            {/* Logo element */}
            <div className="relative z-10 flex items-center justify-center w-full h-full p-2">
              {product.image && product.image.startsWith("/") ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              ) : (
                <ProductBrandLogo
                  slug={product.slug}
                  name={product.name}
                  color={product.brandColor}
                />
              )}
            </div>
          </div>

          {/* 2. Product Info & Bullets */}
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {isPopular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]">
                  <Crown className="w-3 h-3 text-[#00BFFF]" />
                  <span>Populaire</span>
                </span>
              )}
              {product.deliveryTime && (
                <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">
                  ⚡ {product.deliveryTime}
                </span>
              )}
            </div>

            {/* Title Header */}
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#00BFFF] transition-colors truncate">
              {product.name}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-[#C8D5E5]/60 mt-0.5 line-clamp-1">
                {subtitle}
              </p>
            )}

            {/* Features List (2 concise bullets) */}
            <ul className="mt-2.5 space-y-1">
              {displayFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-xs text-[#C8D5E5]/90">
                  <Check className="w-3.5 h-3.5 text-[#00BFFF] shrink-0" strokeWidth={2.5} />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =========================================================================
            B. BOTTOM ACTION BAR: Price Display (Left) + "Voir l'offre" CTA (Right)
            ========================================================================= */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          {/* Left: Price Display */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-silver/50 tracking-wider">
              {product.plans && product.plans.length > 1 ? "À partir de" : "Prix"}
            </span>
            <div className="text-lg md:text-xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{formatPrice(currentPrice)}</span>
              <span className="text-xs font-semibold text-[#00BFFF]">
                {product.currency || "DZD"}
              </span>
            </div>
          </div>

          {/* Right: Clean View Offer indicator */}
          <div className="px-3.5 py-1.5 rounded-full bg-white/5 group-hover:bg-[#075BDB] border border-white/10 group-hover:border-[#00BFFF]/50 text-white text-xs font-semibold flex items-center gap-1 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_15px_rgba(0,191,255,0.35)] shrink-0">
            <span className="group-hover:text-white text-silver/80">Voir l&apos;offre</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
