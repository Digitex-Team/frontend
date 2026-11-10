"use client";

import React from "react";
import Image from "next/image";

const partnerLogos = [
  { name: "ChatGPT", src: "/chatgpt.png", width: 160, height: 50 },
  { name: "Claude", src: "/claude.png", width: 140, height: 50 },
  { name: "Google Gemini", src: "/gemini.png", width: 150, height: 50 },
  { name: "Canva", src: "/canva.png", width: 150, height: 50 },
  { name: "Netflix", src: "/netflix.png", width: 130, height: 50 },
  { name: "Spotify", src: "/spotify.png", width: 130, height: 50 },
  { name: "Snapchat", src: "/snap.png", width: 120, height: 50 },
  { name: "Windows 11", src: "/windows.png", width: 140, height: 50 },
  { name: "Apple TV", src: "/apple-tv.png", width: 140, height: 50 },
  { name: "PlayStation", src: "/playstation.png", width: 150, height: 50 },
  { name: "Xbox", src: "/xbox.png", width: 130, height: 50 },
];

// Duplicate sets so translateX(-50%) creates a seamless, gap-free infinite loop on any screen width
const marqueeItems = [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];

export function BrandsMarquee() {
  return (
    <section className="py-3.5 sm:py-4.5 relative overflow-hidden bg-transparent border-b border-white/[0.05]">
      {/* Sleek, proportional width wrapper */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 relative">
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
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="animate-marquee flex items-center shrink-0">
            {marqueeItems.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="flex items-center justify-center px-5 sm:px-7 shrink-0 select-none"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-6 sm:h-7 md:h-8 w-auto max-h-8 max-w-[100px] sm:max-w-[125px] object-contain opacity-70 hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.06)] hover:scale-105"
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
