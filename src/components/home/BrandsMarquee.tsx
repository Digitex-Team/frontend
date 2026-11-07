"use client";

import React from "react";
import Image from "next/image";

const partnerLogos = [
  { name: "ChatGPT", src: "/chatgpt.png", width: 140, height: 40 },
  { name: "Canva", src: "/canva.png", width: 130, height: 40 },
  { name: "Google Gemini", src: "/gemini.png", width: 110, height: 40 },
  { name: "PlayStation", src: "/playstation.png", width: 130, height: 40 },
  { name: "Xbox", src: "/xbox.png", width: 110, height: 40 },
];

// Replicate sets to ensure continuous smooth infinite marquee without gaps
const singleSet = [...partnerLogos, ...partnerLogos, ...partnerLogos];
const marqueeItems = [...singleSet, ...singleSet];

export function BrandsMarquee() {
  return (
    <section className="py-5 sm:py-6 relative overflow-hidden bg-transparent">
      {/* Reduced width wrapper */}
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Left Blur & Fade Edge */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-20 backdrop-blur-[3px]"
          style={{
            background: "linear-gradient(to right, #05070C 0%, rgba(5, 7, 12, 0.85) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Right Blur & Fade Edge */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-20 backdrop-blur-[3px]"
          style={{
            background: "linear-gradient(to left, #05070C 0%, rgba(5, 7, 12, 0.85) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Marquee Track with CSS mask feathered transparency */}
        <div
          className="flex overflow-hidden select-none py-1"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
          }}
        >
          <div className="animate-marquee flex items-center shrink-0">
            {marqueeItems.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="flex items-center justify-center px-6 sm:px-8 shrink-0 select-none"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-7 sm:h-8 w-auto max-h-8 max-w-[120px] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.06)]"
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
