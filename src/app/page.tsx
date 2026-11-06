"use client";

import React from "react";
import { HeroInteractiveNetwork } from "@/components/home/HeroInteractiveNetwork";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { TopProducts } from "@/components/home/TopProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeContactSection } from "@/components/home/HomeContactSection";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient glow orbs — behind all content */}
      <div
        className="glow-orb-blue w-[600px] h-[600px] -top-40 -left-40 opacity-70 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[500px] h-[500px] top-[30%] -right-32 opacity-50 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-blue w-[400px] h-[400px] bottom-[10%] left-1/4 opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <HeroInteractiveNetwork />
      <BrandsMarquee />
      <TopProducts />
      <HowItWorks />
      <HomeContactSection />
    </div>
  );
}
