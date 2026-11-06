"use client";

import { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/types";

export type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

export function useProductFilter(initialProducts: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesDesc =
            (product.shortDesc || product.fullDesc || product.subtitle || product.tagline || "")
              .toLowerCase()
              .includes(query);
          const matchesCategory =
            (product.categoryLabel || product.category || "").toLowerCase().includes(query);
          const matchesFeatures =
            product.features && product.features.some((f) => f.toLowerCase().includes(query));

          if (!matchesName && !matchesDesc && !matchesCategory && !matchesFeatures) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const getLowestPrice = (prod: Product) => {
          if (prod.plans && prod.plans.length > 0) {
            return Math.min(...prod.plans.map((p) => p.priceDZD));
          }
          return prod.price || 0;
        };

        if (sortBy === "price-asc") {
          return getLowestPrice(a) - getLowestPrice(b);
        }
        if (sortBy === "price-desc") {
          return getLowestPrice(b) - getLowestPrice(a);
        }
        if (sortBy === "rating") {
          return (b.rating ?? 5) - (a.rating ?? 5);
        }
        // "popular"
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0);
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("popular");
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredProducts,
    totalCount: filteredProducts.length,
    resetFilters,
  };
}

