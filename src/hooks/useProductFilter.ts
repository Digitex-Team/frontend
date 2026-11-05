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
          const matchesDesc = product.shortDesc.toLowerCase().includes(query) || product.fullDesc.toLowerCase().includes(query);
          const matchesCategory = product.categoryLabel.toLowerCase().includes(query);
          const matchesFeatures = product.features.some((f) => f.toLowerCase().includes(query));

          if (!matchesName && !matchesDesc && !matchesCategory && !matchesFeatures) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const getLowestPrice = (prod: Product) => {
          return Math.min(...prod.plans.map((p) => p.priceDZD));
        };

        if (sortBy === "price-asc") {
          return getLowestPrice(a) - getLowestPrice(b);
        }
        if (sortBy === "price-desc") {
          return getLowestPrice(b) - getLowestPrice(a);
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        // "popular"
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return b.reviewsCount - a.reviewsCount;
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

