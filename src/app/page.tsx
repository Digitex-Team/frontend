"use client";

import React from "react";
import { HeroInteractiveNetwork } from "@/components/home/HeroInteractiveNetwork";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { TopProducts } from "@/components/home/TopProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ContactBanner } from "@/components/home/ContactBanner";
import { OrderModal } from "@/components/products/OrderModal";
import { useOrderState } from "@/hooks/useOrderState";

export default function HomePage() {
  const {
    isOpen,
    product,
    selectedPlan,
    setSelectedPlan,
    formData,
    updateField,
    openOrder,
    closeOrder,
    getWhatsAppMessageUrl,
  } = useOrderState();

  return (
    <div className="relative">
      <HeroInteractiveNetwork />
      <BrandsMarquee />
      <TopProducts onOrderClick={openOrder} />
      <HowItWorks />
      <ContactBanner />

      {/* Global Checkout / Order Modal */}
      <OrderModal
        isOpen={isOpen}
        onClose={closeOrder}
        product={product}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        formData={formData}
        onUpdateField={updateField}
        getWhatsAppUrl={getWhatsAppMessageUrl}
      />
    </div>
  );
}
