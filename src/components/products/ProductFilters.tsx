"use client";

import React from "react";
import {
  Search,
  X,
  Sparkles,
  Film,
  Palette,
  Cpu,
  SlidersHorizontal,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Star,
} from "lucide-react";
import { ProductCategory } from "@/types";
import { SortOption } from "@/hooks/useProductFilter";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";

interface ProductFiltersProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

export function ProductFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}: ProductFiltersProps) {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "Tous les abonnements", icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: "ai", label: "Intelligence Artificielle", icon: <Sparkles className="h-4 w-4" /> },
    { id: "streaming", label: "Streaming & Cinéma", icon: <Film className="h-4 w-4" /> },
    { id: "design", label: "Design & Vidéo", icon: <Palette className="h-4 w-4" /> },
    { id: "utilities", label: "Utilitaires & VPN", icon: <Cpu className="h-4 w-4" /> },
  ];

  const sortOptions: SelectOption[] = [
    { value: "popular", label: "Les Plus Populaires", icon: <Flame className="h-3.5 w-3.5 text-orange-400" /> },
    { value: "price-asc", label: "Prix : Croissant", icon: <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> },
    { value: "price-desc", label: "Prix : Décroissant", icon: <ArrowDownRight className="h-3.5 w-3.5 text-cyan" /> },
    { value: "rating", label: "Meilleures Évaluations", icon: <Star className="h-3.5 w-3.5 text-amber-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-silver/50">
            <Search className="h-4 w-4 text-cyan" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher ChatGPT, Netflix, Canva, Windows..."
            className="w-full rounded-xl bg-[#101B2C] border border-[#1F2E45] py-2.5 pl-10 pr-9 text-sm text-white placeholder-silver/40 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-silver/50 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort selector & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5">
          <span className="text-xs text-silver/60">
            <strong className="text-white font-bold">{totalCount}</strong> produit(s)
          </span>

          <CustomSelect
            options={sortOptions}
            value={sortBy}
            onChange={(val) => onSortChange(val as SortOption)}
            className="min-w-[180px]"
            triggerClassName="py-2 px-3 text-xs"
            dropdownClassName="right-0 w-52"
          />
        </div>
      </div>

      {/* Category Pills Slider / Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-electric text-white shadow-[0_0_15px_rgba(7,91,219,0.4)] border border-blue-400/40"
                  : "bg-[#101B2C] text-silver/80 border border-[#1F2E45] hover:text-white hover:border-cyan/30"
              }`}
            >
              <span className={isSelected ? "text-cyan" : "text-silver/60"}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

