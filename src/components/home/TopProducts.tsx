"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product, ProductCategory } from "@/types";
import { productsCatalog } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { getLiveProducts } from "@/lib/api";

export function TopProducts() {
  const [activeTab, setActiveTab] = useState<ProductCategory>("all");
  const [catalogItems, setCatalogItems] = useState<Product[]>(productsCatalog);

  useEffect(() => {
    let isMounted = true;
    getLiveProducts().then((liveData) => {
      if (isMounted && liveData && liveData.length > 0) {
        setCatalogItems(liveData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: "all", label: "Tous les tops" },
    { id: "ai", label: "Intelligence Artificielle" },
    { id: "streaming", label: "Streaming 4K" },
    { id: "design", label: "Design & Vidéo" },
    { id: "utilities", label: "Licences & VPN" },
  ];

  const filteredProducts = catalogItems.filter((item) => {
    if (activeTab === "all") return item.isPopular || item.isBestseller || item.isFeatured;
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
          <span>Voir tout le catalogue ({catalogItems.length})</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#075BDB] text-white shadow-[0_0_20px_rgba(7,91,219,0.5)] border border-[#00BFFF]/50"
                  : "bg-white/5 text-silver/70 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProducts.slice(0, 6).map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
