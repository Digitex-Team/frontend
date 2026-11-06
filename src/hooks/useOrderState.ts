"use client";

import { useState, useCallback } from "react";
import { Product, SubscriptionTier, OrderFormData, PaymentMethod } from "@/types";
import { siteConfig } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

export function useOrderState() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    whatsapp: "",
    email: "",
    paymentMethod: "baridimob",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  const openOrder = useCallback((targetProduct: Product, initialPlan?: SubscriptionTier) => {
    setProduct(targetProduct);
    const planToSet =
      initialPlan ||
      (targetProduct.plans && targetProduct.plans.length > 0
        ? targetProduct.plans.find((p) => p.isPopular) || targetProduct.plans[0]
        : {
            id: `${targetProduct.id}-default`,
            duration: targetProduct.duration || "1 Mois",
            durationMonths: 1,
            priceDZD: targetProduct.price || 0,
            accountType: "Compte Privé" as const,
          });
    setSelectedPlan(planToSet);
    setOrderComplete(false);
    setIsSubmitting(false);
    setIsOpen(true);
  }, []);

  const closeOrder = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updateField = useCallback(<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getWhatsAppMessageUrl = useCallback(() => {
    if (!product || !selectedPlan) return "";

    const methodLabels: Record<PaymentMethod, string> = {
      baridimob: "BaridiMob (Virement Immédiat)",
      ccp: "CCP / Mandat Poste",
      binance: "Binance Pay / USDT",
      hand: "En Main Propre (Alger)",
    };

    const text = `👋 Bonjour Digitex,\n\nJe souhaite commander un abonnement :\n\n` +
      `📦 *Produit :* ${product.name}\n` +
      `⏳ *Durée / Formule :* ${selectedPlan.duration} (${selectedPlan.accountType})\n` +
      `💰 *Prix :* ${formatPrice(selectedPlan.priceDZD)} DZD\n\n` +
      `👤 *Nom :* ${formData.customerName || "Non spécifié"}\n` +
      `📱 *WhatsApp :* ${formData.whatsapp || "Non spécifié"}\n` +
      `📧 *Email de réception :* ${formData.email || "Non spécifié"}\n` +
      `💳 *Mode de paiement :* ${methodLabels[formData.paymentMethod]}\n` +
      (formData.notes ? `📝 *Notes :* ${formData.notes}\n` : "") +
      `\nMerci de me transmettre les coordonnées pour effectuer le paiement !`;

    const cleanNumber = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }, [product, selectedPlan, formData]);

  return {
    isOpen,
    product,
    selectedPlan,
    setSelectedPlan,
    formData,
    updateField,
    isSubmitting,
    setIsSubmitting,
    orderComplete,
    setOrderComplete,
    openOrder,
    closeOrder,
    getWhatsAppMessageUrl,
  };
}

