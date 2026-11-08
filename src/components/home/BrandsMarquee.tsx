"use client";

import React from "react";
import Image from "next/image";

const partnerLogos = [
  { name: "ChatGPT", src: "/chatgpt.png", width: 120, height: 32 },
  { name: "Canva", src: "/canva.png", width: 110, height: 32 },
  { name: "Google Gemini", src: "/gemini.png", width: 100, height: 32 },
  { name: "Netflix", src: "/netflix.png", width: 95, height: 32 },
  { name: "Spotify", src: "/spotify.png", width: 95, height: 32 },
  { name: "PlayStation", src: "/playstation.png", width: 105, height: 32 },
  { name: "Xbox", src: "/xbox.png", width: 90, height: 32 },
];

// 4 identical sets so translateX(-50%) creates a seamless, gap-free infinite loop on any screen width
const marqueeItems = [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];

export function BrandsMarquee() {
  return (
    <section className="py-2.5 sm:py-3.5 relative overflow-hidden bg-transparent border-b border-white/[0.04]">
      {/* Sleek, proportional width wrapper */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 relative">
        {/* Left Smooth Fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-10 bg-gradient-to-r from-[#05070C] via-[#05070C]/90 to-transparent"
          aria-hidden="true"
        />

        {/* Right Smooth Fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-10 bg-gradient-to-l from-[#05070C] via-[#05070C]/90 to-transparent"
          aria-hidden="true"
        />

        {/* Marquee Track with refined feathered transparency mask */}
        <div
          className="flex overflow-hidden select-none py-1"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <div className="animate-marquee flex items-center shrink-0">
            {marqueeItems.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="flex items-center justify-center px-4 sm:px-7 shrink-0 select-none"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-5 sm:h-6 w-auto max-h-6 max-w-[100px] object-contain opacity-60 hover:opacity-95 transition-opacity duration-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
