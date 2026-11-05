"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, PackageSearch, RotateCcw } from "lucide-react";
import { productsCatalog } from "@/data/products";
import { ProductCategory } from "@/types";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useOrderState } from "@/hooks/useOrderState";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { OrderModal } from "@/components/products/OrderModal";
import { Button } from "@/components/ui/Button";

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") as ProductCategory | null;

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
  } = useProductFilter(productsCatalog);

  const {
    isOpen,
    product,
    selectedPlan,
    setSelectedPlan,
    formData,
    updateField,
    openOrder,
    closeOrder,
    getWhatsAppMessageUrl,
  } = useOrderState();

  // Sync category if URL param is passed
  useEffect(() => {
    if (urlCategory && ["all", "ai", "streaming", "design", "utilities"].includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory, setSelectedCategory]);

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1 text-xs font-bold text-cyan mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Catalogue Officiel Digitex</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Tous Nos Abonnements & Licences
        </h1>
        <p className="mt-3 text-sm sm:text-base text-silver/70 max-w-2xl">
          Filtrez par catégorie, recherchez votre outil préféré et profitez d&apos;une activation garantie en moins de 15 minutes.
        </p>
      </div>

      {/* Filter Component */}
      <ProductFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={totalCount}
      />

      {/* Products Grid or Empty State */}
      <div className="mt-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOrderClick={openOrder}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#1F2E45] bg-[#0E1726]/60 p-12 text-center max-w-md mx-auto my-12">
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
          </div>
        )}
      </div>

      {/* Checkout / Order Modal */}
      <OrderModal
        isOpen={isOpen}
        onClose={closeOrder}
        product={product}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        formData={formData}
        onUpdateField={updateField}
        getWhatsAppUrl={getWhatsAppMessageUrl}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-cyan font-bold">
          Chargement du catalogue...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}

