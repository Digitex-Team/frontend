"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  PhoneCall,
  Eye,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus, adminDeleteOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; orderNumber: string } | null>(null);
  const [deletingOrder, setDeletingOrder] = useState(false);

  const fetchOrders = async (targetPage = page) => {
    try {
      setLoading(true);
      const data = await adminGetOrders(statusFilter, search, targetPage, 10);
      const ordersList = data?.orders || [];
      const totalCount = data?.meta?.total || 0;
      if (ordersList.length === 0 && targetPage > 1 && totalCount > 0) {
        fetchOrders(Math.max(1, targetPage - 1));
        return;
      }
      setOrders(ordersList);
      setTotalPages(data?.meta?.totalPages || 1);
      setTotalCount(totalCount);
      setPage(data?.meta?.page || 1);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminUpdateOrderStatus(id, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeletingOrder(true);
    try {
      await adminDeleteOrder(orderToDelete.id);
      if (selectedOrder && selectedOrder.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
      setOrderToDelete(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la suppression de la commande");
    } finally {
      setDeletingOrder(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>En attente</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#075BDB]/20 text-[#00BFFF] border border-[#00BFFF]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmée</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terminée</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Annulée</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-cyan" />
            <span>Commandes Clients</span>
          </h1>
          <p className="text-xs sm:text-sm text-silver/60 mt-1">
            Traitez les commandes entrantes, vérifiez les règlements et contactez directement les clients via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-silver hover:text-white flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan ${refreshing ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-elevated p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Toutes" },
            { id: "PENDING", label: "En Attente" },
            { id: "CONFIRMED", label: "Confirmées" },
            { id: "COMPLETED", label: "Terminées" },
            { id: "CANCELLED", label: "Annulées" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${isActive
                    ? "bg-[#075BDB] text-white shadow-[0_0_15px_rgba(7,91,219,0.4)] border border-[#00BFFF]/40"
                    : "text-silver/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° commande, nom, téléphone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-xs text-white placeholder:text-silver/40 outline-none focus:border-cyan"
          />
          <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3 top-3" />
        </form>
      </div>

      {/* Orders Table */}
      <div className="glass-elevated rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-silver/50">Chargement des commandes...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-silver/50">Aucune commande trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-silver/60 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">N° Commande</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Articles</th>
                  <th className="py-3.5 px-4">Montant & Mode</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord) => {
                  const cleanPhone = ord.whatsappPhone.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/213${cleanPhone.replace(/^0/, "")}?text=${encodeURIComponent(
                    `Bonjour ${ord.clientName}, Digitex Store vous contacte à propos de votre commande ${ord.orderNumber}.`
                  )}`;

                  return (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan text-xs">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">{ord.clientName}</p>
                        <p className="text-[11px] text-silver/60">{ord.whatsappPhone}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {(ord.items || []).map((item: any, i: number) => (
                            <p key={i} className="text-white text-[11px] font-medium">
                              {item.productName} ({item.tierName}) x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">
                          {formatPrice(ord.totalAmountDZD)} DZD
                        </p>
                        <span className="text-[10px] text-silver/50 uppercase">
                          {ord.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                            title="Contacter sur WhatsApp"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan transition cursor-pointer"
                            title="Détails de la commande"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setOrderToDelete({ id: ord.id, orderNumber: ord.orderNumber })}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                            title="Supprimer définitivement la commande de la base de données"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-silver/60">
              Page <strong className="text-white font-bold">{page}</strong> sur{" "}
              <strong className="text-white font-bold">{totalPages}</strong> ({totalCount} commandes)
            </span>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => {
                  const p = Math.max(1, page - 1);
                  setPage(p);
                  fetchOrders(p);
                }}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-silver hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Précédent</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    fetchOrders(p);
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${p === page
                      ? "bg-[#075BDB] text-white border border-[#00BFFF]"
                      : "bg-white/5 text-silver hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => {
                  const p = Math.min(totalPages, page + 1);
                  setPage(p);
                  fetchOrders(p);
                }}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-silver hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
              >
                <span>Suivant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-8 rounded-3xl border border-white/10 max-w-xl w-full"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan font-bold tracking-wider">
                    Détails Commande
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedOrder.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Client Box */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{selectedOrder.clientName}</p>
                    <p className="text-silver/60">{selectedOrder.whatsappPhone}</p>
                    {selectedOrder.email && <p className="text-silver/40">{selectedOrder.email}</p>}
                  </div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                {/* Items */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[11px] font-bold uppercase text-silver/60 mb-2">
                    Articles Commandés
                  </p>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-white">{item.productName}</p>
                          <p className="text-[10px] text-silver/50">
                            {item.tierName} &bull; Quantité: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-cyan">
                          {formatPrice(item.priceDZD)} DZD
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">Total Commande</span>
                    <span className="text-sm font-black text-white">
                      {formatPrice(selectedOrder.totalAmountDZD)} DZD
                    </span>
                  </div>
                </div>

                {/* Payment & Notes */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-silver/60">
                    <span className="font-bold text-white">Mode de règlement :</span>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-silver/60 mt-1">
                      <span className="font-bold text-white">Remarques client :</span>{" "}
                      {selectedOrder.notes}
                    </p>
                  )}
                </div>

                {/* Status Switcher Actions */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase text-silver/60 mb-2">
                    Mettre à jour le statut
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedOrder.id, st)}
                        className={`py-2 px-2 rounded-xl text-[10px] font-bold uppercase transition cursor-pointer border ${selectedOrder.status === st
                            ? "bg-[#075BDB] text-white border-[#00BFFF]"
                            : "bg-white/5 text-silver/70 border-white/5 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hard Delete Order */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <p className="text-[11px] text-silver/50">
                    Suppression définitive de la base de données
                  </p>
                  <button
                    type="button"
                    onClick={() => setOrderToDelete({ id: selectedOrder.id, orderNumber: selectedOrder.orderNumber })}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer la commande</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern High-End Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDeleteOrder}
        title="Supprimer la Commande"
        itemName={orderToDelete ? `#${orderToDelete.orderNumber}` : undefined}
        itemType="commande"
        description="Attention : cette commande et tous les articles rattachés seront définitivement effacés de la base de données PostgreSQL. Cette opération est irréversible."
        loading={deletingOrder}
      />
    </div>
  );
}

