"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Calendar,
  DollarSign,
  Package,
  Layers,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Trophy,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  adminGetSalesStats,
  adminGetSalesHistory,
  adminQuickCounter,
  adminCreateManualSale,
  adminDeleteSale,
  adminGetProducts,
} from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

type PeriodType = "day" | "week" | "month" | "all";

export default function AdminSalesAccountingPage() {
  const [period, setPeriod] = useState<PeriodType>("day");
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Counter search filter
  const [productSearch, setProductSearch] = useState("");

  // History search & pagination
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);

  // Quick Counter animation state
  const [pulsingProductId, setPulsingProductId] = useState<string | null>(null);
  const [selectedTierByProduct, setSelectedTierByProduct] = useState<Record<string, string>>({});

  // Manual Sale Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingSale, setDeletingSale] = useState(false);

  // Manual Sale Form State
  const [formProductId, setFormProductId] = useState("");
  const [formProductName, setFormProductName] = useState("");
  const [formTierName, setFormTierName] = useState("1 Mois");
  const [formSellingPrice, setFormSellingPrice] = useState<number>(2500);
  const [formCostPrice, setFormCostPrice] = useState<number>(1000);
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formChannel, setFormChannel] = useState("INSTAGRAM");
  const [formNotes, setFormNotes] = useState("");
  const [savingSale, setSavingSale] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async (selectedPeriod: PeriodType = period, page = historyPage) => {
    try {
      setLoading(true);
      const statsData = await adminGetSalesStats(selectedPeriod);
      setStats(statsData);
      if (statsData?.productCounters) {
        setProductsList(statsData.productCounters);
      }

      const historyData = await adminGetSalesHistory({
        period: selectedPeriod,
        search: historySearch.trim() || undefined,
        page,
        limit: 15,
      });

      setHistory(historyData?.sales || []);
      setHistoryTotalPages(historyData?.meta?.totalPages || 1);
      setHistoryTotalCount(historyData?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load sales accounting data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, historySearch, historyPage]);

  useEffect(() => {
    loadData(period, 1);
  }, [period]);

  const handlePeriodChange = (p: PeriodType) => {
    setPeriod(p);
    setHistoryPage(1);
  };

  const handleSearchHistory = (e: React.FormEvent) => {
    e.preventDefault();
    setHistoryPage(1);
    loadData(period, 1);
  };

  // ================= ONE-CLICK QUICK COUNTER (+ / -) =================
  const handleCounterClick = async (productId: string, tierId?: string, action: "increment" | "decrement" = "increment") => {
    try {
      setPulsingProductId(productId);
      setTimeout(() => setPulsingProductId(null), 600);

      await adminQuickCounter(productId, tierId, action);
      // Reload stats and history seamlessly
      loadData(period, historyPage);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du compteur");
    }
  };

  // ================= OPEN PRE-FILLED CUSTOM SALE MODAL =================
  const openCustomSaleForProduct = (p: any) => {
    const tier = p.tierName ? { durationName: p.tierName, priceDZD: p.sellingPriceDZD } : null;
    setFormProductId(p.id);
    setFormProductName(p.name);
    setFormTierName(p.tierName || "1 Mois");
    setFormSellingPrice(p.sellingPriceDZD || 2500);
    setFormCostPrice(p.costPriceDZD || 0);
    setFormQuantity(1);
    setFormChannel("INSTAGRAM");
    setFormNotes("");
    setFormError(null);
    setManualModalOpen(true);
  };

  const handleProductSelect = (prodId: string) => {
    setFormProductId(prodId);
    const prod = productsList.find((p) => p.id === prodId);
    if (prod) {
      setFormProductName(prod.name);
      const defaultTier = prod.tiers?.find((t: any) => t.isDefault) || prod.tiers?.[0];
      if (defaultTier) {
        setFormTierName(defaultTier.durationName);
        setFormSellingPrice(Number(defaultTier.priceDZD));
        setFormCostPrice(Number(defaultTier.costPriceDZD ?? prod.costPriceDZD ?? 0));
      } else {
        setFormCostPrice(Number(prod.costPriceDZD || 0));
      }
    }
  };

  const handleSaveManualSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSale(true);
    setFormError(null);

    if (!formProductName.trim()) {
      setFormError("Veuillez indiquer le nom du produit");
      setSavingSale(false);
      return;
    }

    try {
      await adminCreateManualSale({
        productId: formProductId || undefined,
        productName: formProductName.trim(),
        tierName: formTierName.trim() || "1 Mois",
        sellingPriceDZD: Number(formSellingPrice),
        costPriceDZD: Number(formCostPrice),
        quantity: Number(formQuantity) || 1,
        channel: formChannel,
        notes: formNotes.trim() || undefined,
      });

      setManualModalOpen(false);
      loadData(period, 1);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement de la vente");
    } finally {
      setSavingSale(false);
    }
  };

  const confirmDeleteSale = async () => {
    if (!saleToDelete) return;
    setDeletingSale(true);
    try {
      await adminDeleteSale(saleToDelete.id);
      setSaleToDelete(null);
      loadData(period, historyPage);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la suppression de la vente");
    } finally {
      setDeletingSale(false);
    }
  };

  const summary = stats?.summary || {
    totalRevenueDZD: 0,
    totalCostDZD: 0,
    netProfitDZD: 0,
    totalUnitsSold: 0,
    profitMarginPercent: 0,
  };

  const breakdown = stats?.breakdown || {
    day: { totalRevenueDZD: 0, totalCostDZD: 0, netProfitDZD: 0, totalUnitsSold: 0 },
    week: { totalRevenueDZD: 0, totalCostDZD: 0, netProfitDZD: 0, totalUnitsSold: 0 },
    month: { totalRevenueDZD: 0, totalCostDZD: 0, netProfitDZD: 0, totalUnitsSold: 0 },
  };

  const topProducts = stats?.topSellingProducts || [];
  const rawProductCounters = stats?.productCounters || [];

  const filteredProductCounters = rawProductCounters.filter((p: any) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-7 h-7 text-cyan" />
              <span>Ventes & Comptabilité</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              En Direct
            </span>
          </div>
          <p className="text-xs sm:text-sm text-silver/60 mt-1 max-w-2xl">
            Calcul automatique du chiffre d&apos;affaires, des coûts d&apos;achat et du bénéfice net réel avec compteur de vente 1-clic.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setRefreshing(true);
              loadData(period, historyPage);
            }}
            disabled={refreshing}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-silver hover:text-white flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan ${refreshing ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={() => {
              setFormProductId("");
              setFormProductName("");
              setFormTierName("1 Mois");
              setFormSellingPrice(2500);
              setFormCostPrice(1000);
              setFormQuantity(1);
              setFormChannel("INSTAGRAM");
              setFormNotes("");
              setFormError(null);
              setManualModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une vente</span>
          </button>
        </div>
      </div>

      {/* ================= PERIOD SELECTOR TABS ================= */}
      <div className="glass-elevated p-2 rounded-2xl border border-white/10 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: "day", label: "Aujourd'hui (Jour)", icon: Calendar },
          { id: "week", label: "Cette Semaine", icon: TrendingUp },
          { id: "month", label: "Ce Mois", icon: Trophy },
          { id: "all", label: "Tout l'Historique", icon: Sparkles },
        ].map((tab) => {
          const isActive = period === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handlePeriodChange(tab.id as PeriodType)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-[#075BDB] text-white shadow-[0_0_15px_rgba(7,91,219,0.4)] border border-[#00BFFF]/40"
                  : "text-silver/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 4 PRIMARY KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Chiffre d'Affaires Ventes */}
        <div className="glass-elevated p-5 rounded-3xl border border-cyan/30 relative overflow-hidden shadow-[0_0_25px_rgba(0,191,255,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan">
              Chiffre d&apos;Affaires (Vendu)
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan/10 border border-cyan/25 flex items-center justify-center text-cyan">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatPrice(summary.totalRevenueDZD)} <span className="text-xs font-bold text-cyan">DZD</span>
          </div>
          <p className="text-[11px] text-silver/60 mt-1">
            Total des encaissements sur la période
          </p>
        </div>

        {/* 2. Coût d'Achat (Dépenses) */}
        <div className="glass-elevated p-5 rounded-3xl border border-rose-500/30 relative overflow-hidden shadow-[0_0_25px_rgba(244,63,94,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              Coût d&apos;Achat (Dépensé)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
              <Minus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatPrice(summary.totalCostDZD)} <span className="text-xs font-bold text-rose-400">DZD</span>
          </div>
          <p className="text-[11px] text-silver/60 mt-1">
            Ce que vous avez payé pour les comptes / clés
          </p>
        </div>

        {/* 3. Bénéfice Net Réel */}
        <div className="glass-elevated p-5 rounded-3xl border border-emerald-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-gradient-to-br from-emerald-500/[0.05] to-transparent">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Bénéfice Net Réel
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            +{formatPrice(summary.netProfitDZD)} <span className="text-xs font-bold text-white">DZD</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-silver/60">Profit en poche</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {summary.profitMarginPercent}% de marge
            </span>
          </div>
        </div>

        {/* 4. Total Unités Vendues */}
        <div className="glass-elevated p-5 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Abonnements Vendus
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {summary.totalUnitsSold} <span className="text-xs font-bold text-silver/60">unités</span>
          </div>
          <p className="text-[11px] text-silver/60 mt-1">
            Volume total des ventes clôturées
          </p>
        </div>
      </div>

      {/* ================= RESUMY MINI-DASHBOARD (DAY vs WEEK vs MONTH) ================= */}
      <div className="glass-elevated p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Résumé des Performances (Jour &bull; Semaine &bull; Mois)</span>
            </h3>
            <p className="text-xs text-silver/60 mt-0.5">
              Vue comparative instantanée pour piloter votre rentabilité.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Day Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Aujourd&apos;hui</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan font-bold">
                {breakdown.day.totalUnitsSold} vendus
              </span>
            </div>
            <div className="pt-1 flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Revenu :</span>
              <span className="font-bold text-white">{formatPrice(breakdown.day.totalRevenueDZD)} DZD</span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Coût Achat :</span>
              <span className="text-rose-400 font-semibold">{formatPrice(breakdown.day.totalCostDZD)} DZD</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-baseline justify-between text-xs">
              <span className="font-bold text-emerald-400">Bénéfice Net :</span>
              <span className="font-black text-emerald-400 text-sm">+{formatPrice(breakdown.day.netProfitDZD)} DZD</span>
            </div>
          </div>

          {/* Week Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Cette Semaine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                {breakdown.week.totalUnitsSold} vendus
              </span>
            </div>
            <div className="pt-1 flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Revenu :</span>
              <span className="font-bold text-white">{formatPrice(breakdown.week.totalRevenueDZD)} DZD</span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Coût Achat :</span>
              <span className="text-rose-400 font-semibold">{formatPrice(breakdown.week.totalCostDZD)} DZD</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-baseline justify-between text-xs">
              <span className="font-bold text-emerald-400">Bénéfice Net :</span>
              <span className="font-black text-emerald-400 text-sm">+{formatPrice(breakdown.week.netProfitDZD)} DZD</span>
            </div>
          </div>

          {/* Month Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Ce Mois-ci</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                {breakdown.month.totalUnitsSold} vendus
              </span>
            </div>
            <div className="pt-1 flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Revenu :</span>
              <span className="font-bold text-white">{formatPrice(breakdown.month.totalRevenueDZD)} DZD</span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-silver/60">Coût Achat :</span>
              <span className="text-rose-400 font-semibold">{formatPrice(breakdown.month.totalCostDZD)} DZD</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-baseline justify-between text-xs">
              <span className="font-bold text-emerald-400">Bénéfice Net :</span>
              <span className="font-black text-emerald-400 text-sm">+{formatPrice(breakdown.month.netProfitDZD)} DZD</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COMPTEUR RAPIDE PAR PRODUIT (THE 1-CLICK CPT SYSTEM) ================= */}
      <div className="glass-elevated p-6 rounded-3xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan" />
                <span>Compteur Rapide de Ventes (CPT 1-Clic)</span>
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan/15 text-cyan border border-cyan/30">
                1 Clic = +1 Vente
              </span>
            </div>
            <p className="text-xs text-silver/60 mt-0.5">
              Cliquez sur le bouton <strong>+</strong> dès que vous effectuez une vente sur Instagram ou en direct pour l&apos;ajouter instantanément au calcul du chiffre d&apos;affaires.
            </p>
          </div>

          {/* Search product filter */}
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Filtrer un produit..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-xs text-white placeholder:text-silver/40 outline-none focus:border-cyan"
            />
            <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3 top-3" />
          </div>
        </div>

        {/* Grid of Product Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProductCounters.map((prod: any) => {
            const isPulsing = pulsingProductId === prod.id;
            const currentTierId = selectedTierByProduct[prod.id] || prod.tierId;
            const activeTier = prod.tiers?.find((t: any) => t.id === currentTierId) || prod.tiers?.[0] || {
              id: prod.tierId,
              durationName: prod.tierName,
              priceDZD: prod.sellingPriceDZD,
              costPriceDZD: prod.costPriceDZD,
            };

            const sellingPrice = Number(activeTier.priceDZD ?? prod.sellingPriceDZD ?? 0);
            const costPrice = Number(activeTier.costPriceDZD ?? prod.costPriceDZD ?? 0);
            const unitProfit = sellingPrice - costPrice;

            return (
              <motion.div
                key={prod.id}
                animate={isPulsing ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-2xl glass-base border transition-all duration-200 flex flex-col justify-between ${isPulsing
                    ? "border-cyan bg-cyan/10 shadow-[0_0_25px_rgba(0,191,255,0.4)]"
                    : "border-white/10 hover:border-white/20"
                  }`}
              >
                {/* Product Header */}
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#090F1B] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {prod.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-silver/40" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-xs truncate">{prod.name}</p>
                      {prod.tiers && prod.tiers.length > 1 ? (
                        <select
                          value={activeTier.id}
                          onChange={(e) => {
                            setSelectedTierByProduct({
                              ...selectedTierByProduct,
                              [prod.id]: e.target.value,
                            });
                          }}
                          className="mt-0.5 bg-[#090F1B] border border-cyan/40 text-cyan text-[10px] font-semibold rounded-md px-1.5 py-0.5 outline-none max-w-full truncate cursor-pointer"
                        >
                          {prod.tiers.map((t: any) => (
                            <option key={t.id} value={t.id}>
                              {t.durationName} &bull; {formatPrice(t.priceDZD)} DZD
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[10px] text-cyan font-semibold block truncate">
                          {activeTier.durationName || prod.tierName} &bull; {formatPrice(sellingPrice)} DZD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financials pill */}
                  <div className="mt-3 p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-silver/50 block text-[9px] uppercase">Achat</span>
                      <span className="text-rose-300 font-semibold">{formatPrice(costPrice)} DZD</span>
                    </div>
                    <div className="text-right">
                      <span className="text-silver/50 block text-[9px] uppercase">Bénéfice/u</span>
                      <span className="text-emerald-400 font-bold">+{formatPrice(unitProfit)} DZD</span>
                    </div>
                  </div>

                  {/* Badges Count */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                      🔥 {prod.soldToday} ajd.
                    </span>
                    <span className="text-silver/50 text-[10px]">
                      {prod.soldThisMonth} ce mois
                    </span>
                  </div>
                </div>

                {/* Counter Actions Bar */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  {/* Big +1 Vente button */}
                  <button
                    type="button"
                    onClick={() => handleCounterClick(prod.id, activeTier.id, "increment")}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold shadow-[0_0_15px_rgba(0,191,255,0.3)] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+1 Vente</span>
                  </button>

                  {/* -1 button if needed */}
                  <button
                    type="button"
                    disabled={prod.soldToday <= 0}
                    onClick={() => handleCounterClick(prod.id, activeTier.id, "decrement")}
                    title="Annuler 1 vente aujourd'hui"
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/15 hover:text-rose-400 border border-white/10 text-silver/60 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Custom sale button */}
                  <button
                    type="button"
                    onClick={() => openCustomSaleForProduct({
                      ...prod,
                      tierId: activeTier.id,
                      tierName: activeTier.durationName || prod.tierName,
                      sellingPriceDZD: sellingPrice,
                      costPriceDZD: costPrice,
                    })}
                    title="Personnaliser prix / coût d'achat"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-silver/70 hover:text-white transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= TOP SELLING PRODUCTS LEADERBOARD ================= */}
      <div className="glass-elevated p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Classement des Produits les Plus Vendus ({period.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-silver/60 mt-0.5">
              Classement par volume de vente et part de marché sur la période sélectionnée.
            </p>
          </div>
        </div>

        {topProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-silver/40">
            Aucune vente enregistrée pour cette période. Utilisez le compteur rapide ci-dessus pour ajouter des ventes.
          </div>
        ) : (
          <div className="space-y-2.5">
            {topProducts.map((p: any, idx: number) => {
              const medalColor =
                idx === 0
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                  : idx === 1
                    ? "bg-slate-300/20 text-slate-200 border-slate-300/40"
                    : idx === 2
                      ? "bg-amber-700/20 text-amber-500 border-amber-700/40"
                      : "bg-white/5 text-silver/60 border-white/10";

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg border font-mono font-black text-xs flex items-center justify-center shrink-0 ${medalColor}`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white text-xs">{p.productName}</p>
                      <span className="text-[10px] text-silver/50">
                        {p.unitsSold} ventes &bull; {p.percentageOfTotal}% du volume total
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <span className="text-[10px] text-silver/50 uppercase block">Revenu</span>
                      <span className="font-bold text-white">{formatPrice(p.revenueDZD)} DZD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-silver/50 uppercase block">Bénéfice</span>
                      <span className="font-black text-emerald-400">+{formatPrice(p.profitDZD)} DZD</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= TRANSACTION HISTORY LEDGER ================= */}
      <div className="glass-elevated rounded-3xl border border-white/10 overflow-hidden space-y-0">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan" />
              <span>Historique Détaillé des Ventes ({historyTotalCount} entrées)</span>
            </h3>
            <p className="text-xs text-silver/60 mt-0.5">
              Journal de chaque encaissement avec calcul du coût d&apos;achat et marge brute.
            </p>
          </div>

          <form onSubmit={handleSearchHistory} className="w-full sm:w-64 relative">
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Rechercher produit, canal..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-xs text-white placeholder:text-silver/40 outline-none focus:border-cyan"
            />
            <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3 top-3" />
          </form>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-xs text-silver/50">
            Aucune transaction trouvée dans l&apos;historique.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-silver/60 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Produit & Formule</th>
                  <th className="py-3 px-4">Prix Vendu</th>
                  <th className="py-3 px-4">Coût Achat</th>
                  <th className="py-3 px-4">Bénéfice Net</th>
                  <th className="py-3 px-4">Canal</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((sale) => {
                  const date = new Date(sale.createdAt);
                  const formattedTime = date.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const formattedDate = date.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <tr key={sale.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 text-silver/60 text-[11px] whitespace-nowrap">
                        <span className="font-bold text-white block">{formattedTime}</span>
                        <span>{formattedDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-white text-xs">{sale.productName}</p>
                        <span className="text-[10px] text-silver/50">
                          {sale.tierName} &bull; Qté: {sale.quantity}
                        </span>
                        {sale.notes && (
                          <p className="text-[10px] text-silver/40 italic mt-0.5">{sale.notes}</p>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-white">
                        {formatPrice(Number(sale.sellingPriceDZD) * (sale.quantity || 1))} DZD
                      </td>

                      <td className="py-3 px-4 font-medium text-rose-300">
                        {formatPrice(Number(sale.costPriceDZD) * (sale.quantity || 1))} DZD
                      </td>

                      <td className="py-3 px-4 font-black text-emerald-400">
                        +{formatPrice(Number(sale.netProfitDZD))} DZD
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-silver/80 uppercase">
                          {sale.channel}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSaleToDelete({ id: sale.id, name: `${sale.productName} (${sale.tierName})` })}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Supprimer cette vente de l'historique"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* History Pagination Bar */}
        {historyTotalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-xs">
            <span className="text-silver/60">
              Page <strong className="text-white">{historyPage}</strong> sur{" "}
              <strong className="text-white">{historyTotalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={historyPage <= 1}
                onClick={() => {
                  const p = Math.max(1, historyPage - 1);
                  setHistoryPage(p);
                  loadData(period, p);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-silver hover:text-white disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                disabled={historyPage >= historyTotalPages}
                onClick={() => {
                  const p = Math.min(historyTotalPages, historyPage + 1);
                  setHistoryPage(p);
                  loadData(period, p);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-silver hover:text-white disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
              >
                <span>Suivant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL NOUVELLE VENTE MANUELLE ================= */}
      <AnimatePresence>
        {manualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-7 rounded-3xl border border-white/10 max-w-lg w-full relative my-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan font-bold tracking-wider">
                    Comptabilité Manuelle
                  </span>
                  <h3 className="text-lg font-black text-white">Enregistrer une Vente</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveManualSale} className="space-y-3.5 text-xs">
                {/* Select from catalog or custom */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Choisir un produit du catalogue (Optionnel)
                  </label>
                  <select
                    value={formProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  >
                    <option value="">-- Saisie libre ou sélectionner un produit --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Nom du Produit / Service <span className="text-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formProductName}
                    onChange={(e) => setFormProductName(e.target.value)}
                    placeholder="Ex: ChatGPT Plus, Netflix 4K, Canva..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-silver/90 font-semibold mb-1">
                      Formule / Durée
                    </label>
                    {/* Quick sync buttons for product tiers */}
                    {(() => {
                      const selProd = productsList.find((p) => p.id === formProductId);
                      if (selProd?.tiers && selProd.tiers.length > 0) {
                        return (
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {selProd.tiers.map((t: any) => {
                              const isSelected = formTierName === t.durationName;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setFormTierName(t.durationName);
                                    setFormSellingPrice(Number(t.priceDZD));
                                    setFormCostPrice(Number(t.costPriceDZD || 0));
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition border cursor-pointer ${
                                    isSelected
                                      ? "bg-cyan/20 border-cyan text-cyan shadow-sm"
                                      : "bg-white/5 border-white/10 text-silver/70 hover:text-white hover:bg-white/10"
                                  }`}
                                >
                                  {t.durationName}
                                </button>
                              );
                            })}
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <input
                      type="text"
                      value={formTierName}
                      onChange={(e) => setFormTierName(e.target.value)}
                      placeholder="Ex: 1 Mois"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                    />
                  </div>

                  <div>
                    <label className="block text-silver/90 font-semibold mb-1">
                      Quantité
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                    />
                  </div>
                </div>

                {/* Prices & Profit Calculation */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <label className="block text-cyan font-bold mb-1">
                      Prix de Vente (DZD) <span className="text-cyan">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formSellingPrice}
                      onChange={(e) => setFormSellingPrice(parseFloat(e.target.value) || 0)}
                      placeholder="2500"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-cyan/40 text-white font-bold outline-none focus:border-cyan transition"
                    />
                    <span className="text-[10px] text-silver/50 mt-1 block">Prix facturé au client</span>
                  </div>

                  <div>
                    <label className="block text-rose-400 font-bold mb-1">
                      Coût d&apos;Achat (DZD)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formCostPrice}
                      onChange={(e) => setFormCostPrice(parseFloat(e.target.value) || 0)}
                      placeholder="1000"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-rose-500/40 text-white font-bold outline-none focus:border-rose-400 transition"
                    />
                    <span className="text-[10px] text-silver/50 mt-1 block">Ce que vous avez payé</span>
                  </div>
                </div>

                {/* Net Profit Preview */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">Bénéfice Net Calculé :</span>
                  <span className="text-emerald-400 font-black text-sm">
                    +{formatPrice((formSellingPrice - formCostPrice) * formQuantity)} DZD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-silver/90 font-semibold mb-1">
                      Canal de Vente
                    </label>
                    <select
                      value={formChannel}
                      onChange={(e) => setFormChannel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                    >
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="DISCORD">Discord</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="DIRECT_LOCAL">Boutique / En main</option>
                      <option value="SITE_WEB">Site Web</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-silver/90 font-semibold mb-1">
                      Remarques / Client (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Ex: Client @aminou"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSale}
                  className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] transition shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingSale ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enregistrer la Vente</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!saleToDelete}
        onClose={() => setSaleToDelete(null)}
        onConfirm={confirmDeleteSale}
        title="Supprimer la Vente"
        itemName={saleToDelete?.name}
        itemType="vente"
        description="Cette vente sera définitivement retirée de l'historique et des calculs comptables de chiffre d'affaires."
        loading={deletingSale}
      />
    </div>
  );
}

