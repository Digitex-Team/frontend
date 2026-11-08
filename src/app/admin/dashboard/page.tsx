"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  Trophy,
  Package,
  Layers,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { adminGetAnalytics, adminUpdateOrderStatus } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await adminGetAnalytics();
      setData(res);
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickStatusUpdate = async (orderId: string, status: string) => {
    try {
      await adminUpdateOrderStatus(orderId, status);
      loadData();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-silver/60">Chargement du tableau de bord...</p>
      </div>
    );
  }

  const overview = data?.overview || {
    totalRevenueDZD: 0,
    totalOrdersCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
  };

  const timeMetrics = data?.timeMetrics || {
    today: { revenueDZD: 0, ordersCount: 0 },
    week: { revenueDZD: 0, ordersCount: 0 },
    month: { revenueDZD: 0, ordersCount: 0 },
  };

  const productBreakdown = data?.productBreakdown || [];
  const pendingQueue = data?.recentPendingQueue || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Tableau de Bord</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-silver/60 mt-1">
            Métriques de vente, suivi du catalogue et commandes à traiter en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-silver hover:text-white flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan ${refreshing ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>

          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-xs font-bold text-white flex items-center gap-1.5 transition shadow-[0_0_20px_rgba(0,191,255,0.3)]"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          1. 4 MANDATORY KPI CARDS:
          - Ventes du Jour
          - Ventes de la Semaine
          - Ventes du Mois
          - CA Total (Revenu Global)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventes du Jour */}
        <div className="glass-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-silver/60">
              Ventes du Jour
            </span>
            <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(timeMetrics.today.revenueDZD)}
            </span>
            <span className="text-xs font-bold text-[#00BFFF]">DZD</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            {timeMetrics.today.ordersCount} commande(s) aujourd&apos;hui
          </span>
        </div>

        {/* Ventes de la Semaine */}
        <div className="glass-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-silver/60">
              Ventes de la Semaine
            </span>
            <div className="p-2 rounded-xl bg-[#075BDB]/20 border border-[#075BDB]/40 text-[#00BFFF]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(timeMetrics.week.revenueDZD)}
            </span>
            <span className="text-xs font-bold text-[#00BFFF]">DZD</span>
          </div>
          <span className="text-[11px] text-cyan font-medium mt-1 inline-block">
            {timeMetrics.week.ordersCount} commande(s) cette semaine
          </span>
        </div>

        {/* Ventes du Mois */}
        <div className="glass-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-silver/60">
              Ventes du Mois
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(timeMetrics.month.revenueDZD)}
            </span>
            <span className="text-xs font-bold text-[#00BFFF]">DZD</span>
          </div>
          <span className="text-[11px] text-purple-400 font-medium mt-1 inline-block">
            {timeMetrics.month.ordersCount} commande(s) ce mois
          </span>
        </div>

        {/* CA Total */}
        <div className="glass-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#101B2C]/80 to-[#075BDB]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Chiffre d&apos;Affaires Total
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400 tracking-tight">
              {formatPrice(overview.totalRevenueDZD)}
            </span>
            <span className="text-xs font-bold text-white">DZD</span>
          </div>
          <span className="text-[11px] text-silver/70 font-medium mt-1 inline-block">
            {overview.totalOrdersCount} commandes totales
          </span>
        </div>
      </div>

      {/* =========================================================================
          2. SALES PERFORMANCE TABLE:
          - Rank (#)
          - Logo
          - Nom du Produit
          - Unités Vendues (Count)
          - Revenu Généré (DZD)
          ========================================================================= */}
      <div className="glass-elevated p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Performances des Ventes par Produit
            </h2>
          </div>
          <span className="text-xs text-silver/50">Classement en temps réel</span>
        </div>

        {productBreakdown.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
            <Layers className="w-8 h-8 text-silver/30 mx-auto mb-2" />
            <p className="text-xs font-semibold text-silver/60">
              Aucune vente de produit enregistrée pour le moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-silver/60 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rang</th>
                  <th className="py-3 px-4">Produit</th>
                  <th className="py-3 px-4 text-center">Commandes</th>
                  <th className="py-3 px-4 text-center">Unités Vendues</th>
                  <th className="py-3 px-4 text-right">Revenu Généré (DZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productBreakdown.map((p: any, idx: number) => {
                  const rankColors = [
                    "text-amber-400 bg-amber-500/10 border-amber-500/30",
                    "text-silver bg-white/10 border-white/20",
                    "text-amber-600 bg-amber-700/10 border-amber-700/30",
                  ];
                  const rankBadge = rankColors[idx] || "text-silver/50 bg-white/5 border-white/5";

                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black border ${rankBadge}`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center font-bold text-xs">
                            {p.productName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-white text-sm">
                            {p.productName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-semibold text-silver/80">
                        {p.ordersCount}
                      </td>

                      <td className="py-3 px-4 text-center font-black text-white">
                        {p.totalUnits}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-black text-cyan text-sm">
                          {formatPrice(p.revenueDZD)}
                        </span>
                        <span className="text-[10px] text-silver/50 ml-1">DZD</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. PENDING ORDERS DISPATCH QUEUE (Quick Actions)
          ========================================================================= */}
      <div className="glass-elevated p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              File d&apos;Attente des Commandes à Traiter
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-cyan hover:underline flex items-center gap-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">Aucune commande en attente !</p>
            <p className="text-[11px] text-silver/50 mt-0.5">Toutes les demandes ont été traitées.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingQueue.map((order: any) => {
              const isInstagram =
                order.contactChannel === "INSTAGRAM" ||
                (!order.whatsappPhone && order.contactValue?.startsWith("@"));
              const handle = (order.contactValue || order.clientName || "").replace(/^@/, "");
              const phone = order.contactValue || order.whatsappPhone || "";
              const cleanPhone = phone.replace(/[^0-9]/g, "");
              const waNumber = cleanPhone.startsWith("0") ? `213${cleanPhone.slice(1)}` : cleanPhone;
              const contactUrl = isInstagram
                ? `https://instagram.com/${handle}`
                : `https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Bonjour ! Digitex vous contacte pour votre commande ${order.orderNumber}.`
                  )}`;
              const contactDisplay = isInstagram ? `@${handle}` : phone || "Client";

              const getPaymentLabel = (pm: string) => {
                switch ((pm || "").toLowerCase().trim()) {
                  case "baridimob":
                    return "BaridiMob";
                  case "ccp":
                    return "CCP / Poste";
                  case "binance":
                    return "Binance Pay";
                  case "redotpay":
                    return "RedotPay";
                  case "flexy":
                    return "Flexy";
                  default:
                    return pm || "Inconnu";
                }
              };

              return (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-black text-cyan">
                        {order.orderNumber}
                      </span>
                      <p className="text-xs font-bold text-white mt-1">
                        {contactDisplay}
                      </p>
                      <p className="text-[11px] text-silver/60 mt-0.5 flex items-center gap-1.5">
                        <span className="font-bold text-white">
                          {formatPrice(order.totalAmountDZD)} DZD
                        </span>
                        <span>&bull;</span>
                        <span className="text-cyan font-semibold">{getPaymentLabel(order.paymentMethod)}</span>
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      En attente
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <a
                      href={contactUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        isInstagram
                          ? "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border-pink-500/30"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isInstagram ? (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Instagram</span>
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </>
                      )}
                    </a>
                    <button
                      onClick={() => handleQuickStatusUpdate(order.id, "CONFIRMED")}
                      className="py-1.5 px-4 rounded-xl bg-[#075BDB] hover:bg-[#064ec0] text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

