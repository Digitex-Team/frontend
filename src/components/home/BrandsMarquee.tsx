"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { brandPartners } from "@/data/brands";

export function BrandsMarquee() {
  // Duplicate for seamless infinite loop
  const marqueeItems = [...brandPartners, ...brandPartners];

  return (
    <section className="border-y border-[#101B2C] bg-[#070B14] py-8 relative overflow-hidden">

      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-6 py-2">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex items-center gap-3 rounded-2xl bg-navy/60 border border-navy-border/80 px-5 py-3 hover:border-cyan/40 hover:bg-navy-light/70 hover:shadow-[0_0_20px_rgba(0,191,255,0.2)] transition-all duration-200 cursor-default group shrink-0"
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-silver group-hover:text-cyan group-hover:border-cyan/40 transition">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-silver group-hover:text-white transition">
                  {brand.name}
                </span>
                <span className="text-[11px] text-silver/50 group-hover:text-cyan/80 transition">
                  {brand.popularProduct}
                </span>
              </div>

              {brand.badge && (
                <span className="ml-2 rounded-full bg-cyan/10 border border-cyan/20 px-2 py-0.5 text-[10px] font-semibold text-cyan">
                  {brand.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

