"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  PackageSearch,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Product } from "@/types";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { getPaginatedProducts, getLiveCategories, DbCategory, PaginationMeta } from "@/lib/api";
import { SortOption } from "@/hooks/useProductFilter";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [page, setPage] = useState<number>(initialPage);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Load categories from DB once
  useEffect(() => {
    getLiveCategories().then((cats) => {
      setCategories(cats || []);
    });
  }, []);

  // Debounce search query by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync category and search query if URL parameters change (e.g. from Hero or Direct Links)
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) {
      setSelectedCategory(urlCat || "all");
    }
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [searchParams]);

  // Main DB Fetcher
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPaginatedProducts({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        page,
        limit: 9,
      });

      setProducts(res.products || []);
      setMeta(res.meta);
    } catch (e) {
      console.error("Failed to load catalog products", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, sortBy, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("popular");
    setPage(1);
  };

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
          Données synchronisées en temps réel depuis notre plateforme sécurisée. Sélectionnez un service pour commander instantanément.
        </p>
      </motion.div>

      {/* Filter Component */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <ProductFilters
          categoriesList={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(s) => {
            setSortBy(s);
            setPage(1);
          }}
          totalCount={meta.total}
        />
      </motion.div>

      {/* Products Grid or Loading / Empty State */}
      <div className="mt-8 sm:mt-10 relative z-10">
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
        ) : products.length > 0 ? (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                <span className="text-xs text-silver/60">
                  Affichage de <strong className="text-white font-bold">{products.length}</strong> sur{" "}
                  <strong className="text-white font-bold">{meta.total}</strong> abonnements (Page {meta.page} sur {meta.totalPages})
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-silver hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Précédent</span>
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                        p === page
                          ? "bg-gradient-to-r from-[#075BDB] to-[#00BFFF] text-white shadow-[0_0_15px_rgba(0,191,255,0.4)] border border-[#00BFFF]/60"
                          : "bg-white/5 text-silver hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(meta.totalPages, page + 1))}
                    disabled={page >= meta.totalPages}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-silver hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
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
              Aucun service ne correspond à votre recherche &quot;{searchQuery}&quot; dans cette catégorie.
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
