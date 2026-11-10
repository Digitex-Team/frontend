"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Layers,
  Tv,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { SortOption } from "@/hooks/useProductFilter";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";

interface ProductFiltersProps {
  categoriesList?: Array<{ id: string; slug: string; name: string; iconName?: string }>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

export function ProductFilters({
  categoriesList = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}: ProductFiltersProps) {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    }
    if (categoryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryMenuOpen]);

  const getIconForCategory = (slug: string, iconName?: string) => {
    switch (iconName || slug) {
      case "ai":
      case "Sparkles":
        return <Sparkles className="h-4 w-4" />;
      case "streaming":
      case "Tv":
      case "Film":
        return <Tv className="h-4 w-4" />;
      case "design":
      case "Palette":
        return <Palette className="h-4 w-4" />;
      case "utilities":
      case "ShieldCheck":
        return <ShieldCheck className="h-4 w-4" />;
      case "Zap":
        return <Zap className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  // Build category list dynamically from DB categories
  const categories = [
    { id: "all", label: "Tous les abonnements", icon: <SlidersHorizontal className="h-4 w-4" /> },
    ...categoriesList.map((c) => ({
      id: c.slug,
      label: c.name,
      icon: getIconForCategory(c.slug, c.iconName),
    })),
  ];

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];
  const isFiltered = selectedCategory !== "all";

  const sortOptions: SelectOption[] = [
    { value: "popular", label: "Les Plus Populaires", icon: <Flame className="h-3.5 w-3.5 text-orange-400" /> },
    { value: "price-asc", label: "Prix : Croissant", icon: <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> },
    { value: "price-desc", label: "Prix : Décroissant", icon: <ArrowDownRight className="h-3.5 w-3.5 text-cyan" /> },
    { value: "rating", label: "Meilleures Évaluations", icon: <Star className="h-3.5 w-3.5 text-amber-400" /> },
  ];

  const scrollPills = (direction: "left" | "right") => {
    if (pillsContainerRef.current) {
      const scrollAmount = 260;
      pillsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Search, Category Button & Sort Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-silver/50">
            <Search className="h-4 w-4 text-cyan" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par mot-clé (ChatGPT, Netflix, Canva, Windows...)"
            className="w-full rounded-full glass-elevated py-2.5 sm:py-3 pl-11 pr-9 text-xs sm:text-sm text-white placeholder-silver/40 focus:border-cyan/70 focus:outline-none focus:ring-1 focus:ring-cyan/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-silver/50 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Controls: Category Button + Sort + Count */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3">
          {/* Main Category Filter Button with Clear */}
          <div className="relative" ref={categoryMenuRef}>
            <div
              className={`inline-flex items-center rounded-full transition-all duration-200 ${
                isFiltered
                  ? "bg-gradient-to-r from-[#075BDB]/80 to-[#00BFFF]/30 border border-cyan/60 shadow-[0_0_20px_rgba(0,191,255,0.25)] text-white"
                  : "glass-elevated border border-white/10 text-silver/80 hover:text-white hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="inline-flex items-center gap-2 py-2 px-3 sm:py-2.5 sm:px-4 text-xs sm:text-sm font-bold cursor-pointer"
              >
                <span className={isFiltered ? "text-cyan" : "text-silver/60"}>
                  {activeCategoryObj.icon}
                </span>
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {isFiltered ? activeCategoryObj.label : "Catégories"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-silver/60 transition-transform duration-200 ${
                    categoryMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory("all");
                    setCategoryMenuOpen(false);
                  }}
                  title="Effacer le filtre et afficher toutes les catégories"
                  className="pr-3 pl-0.5 py-2 text-silver/60 hover:text-white hover:scale-110 transition cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-[10px]">
                    <X className="w-2.5 h-2.5" />
                  </span>
                </button>
              )}
            </div>

            {/* Dropdown Menu with all categories */}
            <AnimatePresence>
              {categoryMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 sm:left-auto right-auto sm:right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl glass-elevated border border-white/15 bg-[#0A101D]/95 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] p-2 z-50 space-y-1"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-silver/60">
                      Toutes les Catégories
                    </span>
                    {isFiltered && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory("all");
                          setCategoryMenuOpen(false);
                        }}
                        className="text-[10px] text-cyan hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Effacer</span>
                      </button>
                    )}
                  </div>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setCategoryMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-cyan/15 text-cyan border border-cyan/30"
                            : "text-silver/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isSelected ? "text-cyan" : "text-silver/50"}>
                            {cat.icon}
                          </span>
                          <span className="truncate">{cat.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort selector */}
          <CustomSelect
            options={sortOptions}
            value={sortBy}
            onChange={(val) => onSortChange(val as SortOption)}
            className="min-w-[160px] sm:min-w-[180px]"
            triggerClassName="py-2 px-3 text-xs"
            dropdownClassName="right-0 w-52"
          />

          {/* Product count */}
          <span className="text-xs text-silver/60 hidden sm:inline-block">
            <strong className="text-white font-bold">{totalCount}</strong> service(s)
          </span>
        </div>
      </div>

      {/* Category Pills Bar with Left/Right Scroll Controls for PC & Mobile */}
      <div className="relative flex items-center group">
        {/* Left scroll arrow button (PC convenience) */}
        <button
          type="button"
          onClick={() => scrollPills("left")}
          aria-label="Défiler vers la gauche"
          className="hidden sm:flex absolute -left-2 z-10 w-7 h-7 rounded-full bg-[#0A101D]/90 border border-white/20 items-center justify-center text-silver/80 hover:text-cyan hover:border-cyan shadow-md transition cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable container */}
        <div
          ref={pillsContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth w-full px-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#075BDB]/80 to-[#00BFFF]/40 border border-[#00BFFF]/60 text-white shadow-[0_0_15px_rgba(0,191,255,0.3)] backdrop-blur-md"
                    : "bg-white/5 border border-white/10 text-silver/80 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:text-white"
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

        {/* Right scroll arrow button (PC convenience) */}
        <button
          type="button"
          onClick={() => scrollPills("right")}
          aria-label="Défiler vers la droite"
          className="hidden sm:flex absolute -right-2 z-10 w-7 h-7 rounded-full bg-[#0A101D]/90 border border-white/20 items-center justify-center text-silver/80 hover:text-cyan hover:border-cyan shadow-md transition cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
