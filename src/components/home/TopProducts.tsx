"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCategory } from "@/types";
import { productsCatalog } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export function TopProducts() {
  const [activeTab, setActiveTab] = useState<ProductCategory>("all");

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: "all", label: "Tous les tops" },
    { id: "ai", label: "Intelligence Artificielle" },
    { id: "streaming", label: "Streaming 4K" },
    { id: "design", label: "Design & Vidéo" },
    { id: "utilities", label: "Licences & VPN" },
  ];

  const filteredProducts = productsCatalog.filter((item) => {
    if (activeTab === "all") return item.isBestseller || item.isFeatured;
    return item.category === activeTab;
  });

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Section Header with Scroll Motion */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sélection Officielle Digitex</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Les Abonnements Les Plus Demandés
          </h2>
          <p className="mt-2 text-xs sm:text-base text-silver/70 max-w-xl">
            Cliquez sur un service pour explorer ses formules, tarifs et commander directement via votre messagerie préférée.
          </p>
        </div>

        {/* View all link */}
        <Link
          href="/products"
          prefetch={true}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan hover:text-white transition group shrink-0"
        >
          <span>Voir tout le catalogue ({productsCatalog.length})</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Category Pills (Mobile horizontal scroll friendly) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#075BDB] to-[#00BFFF]/70 text-white shadow-[0_0_15px_rgba(0,191,255,0.35)] border border-cyan/40"
                  : "bg-white/5 border border-white/10 text-silver/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Products Grid with Staggered Scroll Animations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {filteredProducts.slice(0, 6).map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
