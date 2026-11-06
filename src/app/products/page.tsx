"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, PackageSearch, RotateCcw } from "lucide-react";
import { productsCatalog } from "@/data/products";
import { Product, ProductCategory } from "@/types";
import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { getLiveProducts } from "@/lib/api";

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") as ProductCategory | null;

  // Initialize with static catalog for instant layout, then sync with live Supabase backend
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

  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredProducts,
    totalCount,
    resetFilters,
  } = useProductFilter(catalogItems);

  // Sync category if URL param is passed
  useEffect(() => {
    if (urlCategory && ["all", "ai", "streaming", "design", "utilities"].includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory, setSelectedCategory]);

  return (
    <div className="relative py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Ambient glows */}
      <div
        className="glow-orb-blue w-[500px] h-[500px] -top-20 -left-20 opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[400px] h-[400px] top-1/3 -right-20 opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Page Header with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 sm:mb-10 text-center sm:text-left relative z-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1 text-xs font-bold text-cyan mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Catalogue Officiel Digitex</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Tous Nos Abonnements & Licences
        </h1>
        <p className="mt-2.5 text-xs sm:text-base text-silver/70 max-w-2xl">
          Sélectionnez un service pour voir ses formules et commander en toute simplicité via WhatsApp, Instagram, Discord ou Messenger.
        </p>
      </motion.div>

      {/* Filter Component */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <ProductFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={totalCount}
        />
      </motion.div>

      {/* Products Grid or Empty State */}
      <div className="mt-8 sm:mt-10 relative z-10">
        {filteredProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-[#1F2E45] bg-[#0E1726]/60 p-8 sm:p-12 text-center max-w-md mx-auto my-12"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-silver/40 mb-4">
              <PackageSearch className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Aucun abonnement trouvé</h3>
            <p className="mt-2 text-xs sm:text-sm text-silver/60">
              Aucun service ne correspond à vos critères de recherche &quot;{searchQuery}&quot;.
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                icon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-cyan font-bold text-sm">
          Chargement du catalogue...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
