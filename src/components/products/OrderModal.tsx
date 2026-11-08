"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  PhoneCall,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Product, SubscriptionTier } from "@/types";
import { submitOrder } from "@/lib/api";
import { siteConfig } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedTier: SubscriptionTier;
  productId?: string;
  tierId?: string;
}

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedTier,
  productId,
  tierId,
}: OrderModalProps) {
  const [clientName, setClientName] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("baridimob");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Algerian Phone Number (^0[567][0-9]{8}$)
    const cleanPhone = whatsappPhone.trim().replace(/\s+/g, "");
    const dzRegex = /^0[567][0-9]{8}$/;
    if (!dzRegex.test(cleanPhone)) {
      setError(
        "Veuillez saisir un numéro WhatsApp algérien valide (ex: 0550123456, 0660123456, 0770123456)"
      );
      return;
    }

    setLoading(true);

    try {
      const order = await submitOrder({
        clientName: clientName.trim(),
        whatsappPhone: cleanPhone,
        email: email.trim() || undefined,
        paymentMethod,
        totalAmountDZD: selectedTier.priceDZD,
        notes: notes.trim() || undefined,
        items: [
          {
            productId: productId || product.id,
            tierId: tierId || selectedTier.id,
            productName: product.name,
            tierName: selectedTier.duration,
            priceDZD: selectedTier.priceDZD,
            quantity: 1,
          },
        ],
      });

      setSuccessOrder(order);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Erreur lors de l'enregistrement de la commande. Veuillez réessayer ou contacter le support WhatsApp.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  const cleanSupportPhone = (
    siteConfig.whatsappSalesNumber || siteConfig.whatsappNumber
  ).replace(/[^0-9]/g, "");

  const confirmationWaUrl = successOrder
    ? `https://wa.me/${cleanSupportPhone}?text=${encodeURIComponent(
        `Bonjour Digitex ! Je viens d'effectuer la commande n° *${successOrder.orderNumber}* pour *${product.name}* (${selectedTier.duration}) au montant de *${formatPrice(selectedTier.priceDZD)} DZD*. Voici mon nom : ${clientName}.`
      )}`
    : "#";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-elevated p-5 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full relative max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {successOrder ? (
            /* ================= SUCCESS STATE ================= */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Commande Enregistrée avec Succès !
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {successOrder.orderNumber}
                </h3>
                <p className="text-xs text-silver/70 mt-1 max-w-sm mx-auto">
                  Votre commande pour <span className="text-white font-bold">{product.name}</span> ({selectedTier.duration}) est prête à être activée.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left text-xs space-y-2">
                <div className="flex justify-between text-silver/70">
                  <span>Client :</span>
                  <span className="text-white font-semibold">{clientName}</span>
                </div>
                <div className="flex justify-between text-silver/70">
                  <span>WhatsApp :</span>
                  <span className="text-white font-semibold">{whatsappPhone}</span>
                </div>
                <div className="flex justify-between text-silver/70">
                  <span>Montant Total :</span>
                  <span className="text-cyan font-bold text-sm">
                    {formatPrice(selectedTier.priceDZD)} DZD
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={confirmationWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Confirmer via WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-silver/70 hover:text-white hover:bg-white/5 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* ================= ORDER FORM ================= */
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan/10 text-cyan border border-cyan/30">
                  Commander
                </span>
                <span className="text-xs text-silver/60">Livraison 5 - 15 min</span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">
                {product.name} &bull;{" "}
                <span className="text-cyan">{selectedTier.duration}</span>
              </h2>

              <div className="flex items-baseline gap-1 mt-1 mb-4 text-silver/80 text-xs">
                <span>Total :</span>
                <span className="text-lg font-black text-white">
                  {formatPrice(selectedTier.priceDZD)} DZD
                </span>
                <span className="text-[11px] text-silver/50">({selectedTier.accountType})</span>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Nom & Prénom <span className="text-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Amine Brahimi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  />
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Numéro WhatsApp (Algérie) <span className="text-cyan">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-silver/40">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="0550123456 / 0660123456"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                    />
                  </div>
                  <span className="text-[10px] text-silver/50 mt-1 block">
                    Format: 05xx, 06xx ou 07xx (10 chiffres).
                  </span>
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Adresse Email (Optionnelle)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  />
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Mode de Règlement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "baridimob", label: "BaridiMob" },
                      { id: "ccp", label: "CCP / Poste" },
                      { id: "binance", label: "Binance USDT" },
                    ].map((pm) => (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] transition border cursor-pointer ${
                          paymentMethod === pm.id
                            ? "bg-[#075BDB] text-white border-cyan shadow-[0_0_12px_rgba(0,191,255,0.3)]"
                            : "bg-white/5 text-silver/70 border-white/10 hover:text-white"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Instructions ou Remarques
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Activer sur mon email personnel..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] transition shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer la commande ({formatPrice(selectedTier.priceDZD)} DZD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

