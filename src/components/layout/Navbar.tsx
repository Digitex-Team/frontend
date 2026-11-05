"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Menu } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Abonnements", href: "/products" },
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
];

function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
      {navLinks.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg hover:text-white ${isActive ? "text-cyan" : "text-silver hover:bg-white/5"
              }`}
          >
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan shadow-[0_0_8px_#00BFFF]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWhatsAppUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Bonjour Digitex, j'aimerais avoir des informations sur un abonnement."
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#05070C]/90 border-b border-[#101B2C] transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-11 w-11 shrink-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Digitex Logo"
                    width={48}
                    height={48}
                    className="h-11 w-11 object-contain drop-shadow-[0_0_15px_rgba(0,191,255,0.45)] group-hover:drop-shadow-[0_0_22px_rgba(0,191,255,0.7)] group-hover:scale-105 transition-all duration-300"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan transition-colors">
                      Digitex
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wider font-semibold text-silver/60 uppercase">
                    Store Dz
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation links with Suspense boundary */}
            <Suspense
              fallback={
                <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-4 py-2 text-sm font-semibold text-silver hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              }
            >
              <DesktopNavLinks />
            </Suspense>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Express CTA */}
              <a
                href={cleanWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-electric hover:bg-electric-hover text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-[0_0_18px_rgba(7,91,219,0.45)] hover:shadow-[0_0_25px_rgba(7,91,219,0.7)] transition active:scale-95"
              >
                <MessageCircle className="h-4 w-4 fill-current text-white" />
                <span className="hidden xs:inline">WhatsApp Express</span>
                <span className="xs:hidden">WhatsApp</span>
              </a>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden rounded-xl border border-navy-border bg-navy p-2.5 text-silver hover:text-white hover:border-cyan/40 transition"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
