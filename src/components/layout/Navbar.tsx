"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Abonnements", href: "/products" },
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Contact", href: "/#contact" },
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
            className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-full hover:text-white ${isActive ? "text-cyan bg-white/5" : "text-silver hover:bg-white/5"
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
  const instagramUrl = siteConfig.instagramUrl || "https://www.instagram.com/digitex.web/";

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-base border-b border-white/10 transition-all">
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
              {/* Instagram Direct CTA */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(253,29,29,0.3)] transition active:scale-95"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="hidden xs:inline">Instagram Direct</span>
                <span className="xs:hidden">Instagram</span>
              </a>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden rounded-xl glass-button-secondary p-2.5 text-silver hover:text-white transition"
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
