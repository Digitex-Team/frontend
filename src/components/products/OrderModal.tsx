"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Building2,
  Coins,
  Handshake,
  UploadCloud,
  FileCheck,
  Zap,
} from "lucide-react";
import { Product, SubscriptionTier, PaymentMethod, OrderFormData } from "@/types";
import { siteConfig, paymentMethodsList } from "@/data/siteConfig";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  selectedPlan: SubscriptionTier | null;
  onSelectPlan: (plan: SubscriptionTier) => void;
  formData: OrderFormData;
  onUpdateField: <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => void;
  getWhatsAppUrl: () => string;
}

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedPlan,
  onSelectPlan,
  formData,
  onUpdateField,
  getWhatsAppUrl,
}: OrderModalProps) {
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [mockFileUploaded, setMockFileUploaded] = useState<boolean>(false);

  if (!product || !selectedPlan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.whatsapp) {
      alert("Veuillez renseigner votre nom et votre numéro WhatsApp.");
      return;
    }
    setHasSubmitted(true);
  };

  const resetAndClose = () => {
    setHasSubmitted(false);
    setMockFileUploaded(false);
    onClose();
  };

  const renderPaymentIcon = (id: string) => {
    switch (id) {
      case "baridimob":
        return <Smartphone className="h-5 w-5 text-cyan" />;
      case "ccp":
        return <Building2 className="h-5 w-5 text-yellow-400" />;
      case "binance":
        return <Coins className="h-5 w-5 text-amber-400" />;
      default:
        return <Handshake className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="relative w-full max-w-2xl rounded-3xl glass-elevated shadow-2xl p-6 sm:p-8 z-10 my-auto text-left max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute right-4 top-4 rounded-xl p-2 text-silver/60 hover:text-white hover:bg-white/5 transition"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {!hasSubmitted ? (
              /* Step 1: Order Form */
              <div>
                {/* Header */}
                <div className="border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="cyan" size="sm">
                      Commande Express ⚡
                    </Badge>
                    <span className="text-xs text-silver/60">
                      Livraison {product.deliveryTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-silver/70">
                    Complétez vos coordonnées pour recevoir votre compte ou clé d&apos;activation.
                  </p>
                </div>

                {/* Plan Selection Carousel */}
                <div className="mt-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-silver/80 block mb-2">
                    1. Choisissez votre formule / durée
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {product.plans.map((plan) => {
                      const isSelected = selectedPlan.id === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => onSelectPlan(plan)}
                          className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-electric/20 border-cyan shadow-[0_0_15px_rgba(0,191,255,0.25)] backdrop-blur-md"
                              : "bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-white">
                              {plan.duration}
                            </span>
                            {plan.isPopular && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan/20 text-cyan font-bold">
                                Top
                              </span>
                            )}
                          </div>
                          <span className="mt-2 text-base font-black text-white">
                            {formatPrice(plan.priceDZD)}{" "}
                            <span className="text-xs font-semibold text-cyan">DZD</span>
                          </span>
                          <span className="text-[11px] text-silver/60 mt-0.5">
                            {plan.accountType}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Customer Information Inputs */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-silver/80 block mb-2">
                      2. Vos Coordonnées
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-silver/70 mb-1">
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.customerName}
                          onChange={(e) => onUpdateField("customerName", e.target.value)}
                          placeholder="Ex: Mohamed Benali"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00BFFF]/70 focus:outline-none focus:ring-1 focus:ring-[#00BFFF]/50 focus:bg-white/[0.08] backdrop-blur-md transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-silver/70 mb-1">
                          Numéro WhatsApp / Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsapp}
                          onChange={(e) => onUpdateField("whatsapp", e.target.value)}
                          placeholder="Ex: 0555 12 34 56"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00BFFF]/70 focus:outline-none focus:ring-1 focus:ring-[#00BFFF]/50 focus:bg-white/[0.08] backdrop-blur-md transition"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-silver/70 mb-1">
                        Adresse Email (pour envoi des identifiants)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onUpdateField("email", e.target.value)}
                        placeholder="Ex: mohamed.benali@gmail.com"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00BFFF]/70 focus:outline-none focus:ring-1 focus:ring-[#00BFFF]/50 focus:bg-white/[0.08] backdrop-blur-md transition"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-silver/80 block mb-2">
                      3. Mode de paiement
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {paymentMethodsList.map((pm) => {
                        const isSelected = formData.paymentMethod === pm.id;
                        return (
                          <div
                            key={pm.id}
                            onClick={() => onUpdateField("paymentMethod", pm.id as PaymentMethod)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-electric/15 border-cyan shadow-[0_0_12px_rgba(0,191,255,0.2)] backdrop-blur-md"
                                : "bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20"
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">{renderPaymentIcon(pm.id)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">
                                  {pm.name}
                                </span>
                                {pm.badge && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-silver font-medium">
                                    {pm.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-silver/60 mt-0.5">
                                {pm.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional proof upload mock */}
                  <div className="border border-dashed border-white/15 rounded-xl p-3.5 text-center bg-black/20">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-silver/80">
                      {mockFileUploaded ? (
                        <>
                          <FileCheck className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">
                            Reçu BaridiMob joint avec succès
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4 text-cyan" />
                          <span>
                            Reçu de paiement : Joindre la capture (optionnel) ou l&apos;envoyer sur WhatsApp
                          </span>
                        </>
                      )}
                    </div>
                    {!mockFileUploaded && (
                      <button
                        type="button"
                        onClick={() => setMockFileUploaded(true)}
                        className="mt-2 text-[11px] font-semibold text-cyan hover:underline inline-block"
                      >
                        Cliquez pour simuler le téléversement du reçu
                      </button>
                    )}
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-silver/60 block">Montant Total :</span>
                      <span className="text-2xl font-black text-white tracking-tight">
                        {formatPrice(selectedPlan.priceDZD)}{" "}
                        <span className="text-sm font-bold text-cyan">DZD</span>
                      </span>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      iconRight={<Zap className="h-4 w-4" />}
                    >
                      Valider la commande
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Step 2: Confirmation & 1-Click WhatsApp Instant Sync */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <Badge variant="success" size="md">
                  Commande Pré-enregistrée
                </Badge>

                <h3 className="mt-4 text-2xl font-black text-white">
                  Presque terminé, {formData.customerName || "Cher Client"} !
                </h3>

                <p className="mt-2 text-sm text-silver/80 max-w-md mx-auto">
                  Votre demande pour <strong className="text-white">{product.name} ({selectedPlan.duration})</strong> d&apos;un montant de <strong className="text-cyan">{formatPrice(selectedPlan.priceDZD)} DZD</strong> a été préparée.
                </p>

                {/* Payment Coordinates Card */}
                <div className="mt-6 rounded-xl bg-navy border border-navy-border p-4 text-left max-w-md mx-auto text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-white border-b border-white/10 pb-2">
                    <span>Coordonnées de paiement ({formData.paymentMethod.toUpperCase()}) :</span>
                    <ShieldCheck className="h-4 w-4 text-cyan" />
                  </div>
                  {formData.paymentMethod === "baridimob" && (
                    <div className="space-y-1">
                      <div className="text-silver/60">Numéro RIP BaridiMob :</div>
                      <div className="font-mono text-cyan font-bold select-all text-sm bg-black/40 p-2 rounded-lg">
                        {siteConfig.baridimobRIP}
                      </div>
                      <div className="text-silver/50 text-[11px]">
                        Titulaire : Digitex Store Services
                      </div>
                    </div>
                  )}
                  {formData.paymentMethod === "ccp" && (
                    <div className="space-y-1">
                      <div className="text-silver/60">Compte CCP :</div>
                      <div className="font-mono text-cyan font-bold select-all text-sm bg-black/40 p-2 rounded-lg">
                        {siteConfig.ccpAccount}
                      </div>
                    </div>
                  )}
                  {formData.paymentMethod === "binance" && (
                    <div className="space-y-1">
                      <div className="text-silver/60">Binance Pay ID (USDT) :</div>
                      <div className="font-mono text-cyan font-bold select-all text-sm bg-black/40 p-2 rounded-lg">
                        {siteConfig.binancePayId}
                      </div>
                    </div>
                  )}
                  {formData.paymentMethod === "hand" && (
                    <div className="text-silver/70">
                      Rendez-vous fixé à Alger après confirmation par WhatsApp.
                    </div>
                  )}
                </div>

                {/* 1-Click WhatsApp Button */}
                <div className="mt-6 flex flex-col gap-3 max-w-md mx-auto">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 font-bold text-base shadow-[0_0_25px_rgba(37,211,102,0.4)] transition active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Envoyer la commande sur WhatsApp</span>
                  </a>

                  <Button variant="outline" size="sm" onClick={resetAndClose}>
                    Fermer la fenêtre
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
