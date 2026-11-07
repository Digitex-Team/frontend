"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { getLiveProducts, getLiveCategories, DbCategory } from "@/lib/api";

export function TopProducts() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [catalogItems, setCatalogItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getLiveProducts(), getLiveCategories()]).then(([products, cats]) => {
      if (isMounted) {
        setCatalogItems(products || []);
        setCategories(cats || []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { id: "all", label: "Tous les tops" },
    ...categories.map((c) => ({
      id: c.slug,
      label: c.name,
    })),
  ];

  const filteredProducts = catalogItems.filter((item) => {
    if (activeTab === "all") return item.isPopular || true;
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

      {/* Product Cards Grid or Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-44 rounded-3xl bg-[#101B2C]/40 border border-white/5 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded-md" />
                  <div className="h-3 w-1/2 bg-white/5 rounded-md" />
                </div>
              </div>
              <div className="h-8 w-full bg-white/5 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.slice(0, 6).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-silver/50">
          Aucun produit disponible dans cette catégorie pour le moment.
        </div>
      )}
    </section>
  );
}
