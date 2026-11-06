"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product, SubscriptionTier, ProductCategory } from "@/types";
import { productsCatalog } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

interface TopProductsProps {
  onOrderClick: (product: Product, plan?: SubscriptionTier) => void;
}

export function TopProducts({ onOrderClick }: TopProductsProps) {
  const [activeTab, setActiveTab] = useState<ProductCategory>("all");

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: "all", label: "Tous" },
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
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Les Abonnements Les Plus Demandés
          </h2>
          <p className="mt-2 text-sm text-silver/70 max-w-xl">
            Sélectionnés pour leur fiabilité éprouvée, livraison instantanée et garantie 100% sans interruption.
          </p>
        </div>

        {/* View all link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan hover:text-white transition group"
        >
          <span>Voir tout le catalogue ({productsCatalog.length})</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOrderClick={onOrderClick}
          />
        ))}
      </div>
    </section>
  );
}

