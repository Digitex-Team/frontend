"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  CreditCard,
  Building2,
  Coins,
} from "lucide-react";
import { Product, SubscriptionTier, ContactChannel } from "@/types";
import { submitOrder } from "@/lib/api";
import { siteConfig, paymentMethodsList, PaymentInfoDetail } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedTier: SubscriptionTier;
  productId?: string;
  tierId?: string;
}

// Convert image file to compressed Base64 string for lightweight DB storage
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        } else {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedTier,
  productId,
  tierId,
}: OrderModalProps) {
  const [contactChannel, setContactChannel] = useState<ContactChannel>("INSTAGRAM");
  const [contactValue, setContactValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("baridimob");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [paymentProofName, setPaymentProofName] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPaymentInfo =
    paymentMethodsList.find((p) => p.id === paymentMethod) || paymentMethodsList[0];

  const handleCopyAccount = () => {
    if (!currentPaymentInfo) return;
    navigator.clipboard.writeText(currentPaymentInfo.accountValue.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10 Mo.");
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);
      const base64 = await fileToBase64(file);
      setPaymentProof(base64);
      setPaymentProofName(file.name);
    } catch (_err) {
      setError("Erreur lors de la lecture de l'image. Veuillez réessayer.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProof = () => {
    setPaymentProof(null);
    setPaymentProofName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Contact
    const rawVal = contactValue.trim();
    if (!rawVal) {
      setError(
        contactChannel === "WHATSAPP"
          ? "Veuillez renseigner votre numéro WhatsApp"
          : "Veuillez renseigner votre pseudo Instagram"
      );
      return;
    }

    let finalContact = rawVal;

    if (contactChannel === "WHATSAPP") {
      const cleanPhone = rawVal.replace(/\s+/g, "");
      // Algerian Phone Regex: 05xx, 06xx, 07xx (10 digits) or +213 / 213 prefix
      const dzRegex = /^(?:0|\+?213)[567][0-9]{8}$/;
      if (!dzRegex.test(cleanPhone)) {
        setError(
          "Numéro WhatsApp algérien invalide. Veuillez saisir un numéro à 10 chiffres (ex: 0550123456, 0660123456, 0770123456)."
        );
        return;
      }
      finalContact = cleanPhone.startsWith("+213")
        ? "0" + cleanPhone.slice(4)
        : cleanPhone.startsWith("213")
        ? "0" + cleanPhone.slice(3)
        : cleanPhone;
    } else {
      // Instagram Username Validation: @user or user, letters, numbers, dots, underscores
      const igRegex = /^@?[a-zA-Z0-9._]{2,30}$/;
      if (!igRegex.test(rawVal)) {
        setError("Pseudo Instagram invalide (ex: @votre_pseudo).");
        return;
      }
      finalContact = rawVal.startsWith("@") ? rawVal : `@${rawVal}`;
    }

    setLoading(true);

    try {
      const order = await submitOrder({
        contactChannel,
        contactValue: finalContact,
        paymentMethod,
        paymentProof: paymentProof || undefined,
        totalAmountDZD: selectedTier.priceDZD,
        notes: notes.trim() || undefined,
        clientName: finalContact,
        whatsappPhone: contactChannel === "WHATSAPP" ? finalContact : undefined,
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
        "Erreur lors de l'enregistrement de la commande. Veuillez réessayer.";
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
        `Bonjour Digitex ! Je viens d'effectuer la commande n° *${successOrder.orderNumber}* pour *${product.name}* (${selectedTier.duration}) au montant de *${formatPrice(selectedTier.priceDZD)} DZD* via ${currentPaymentInfo.name}. Mon contact : ${contactValue}.`
      )}`
    : "#";

  const instagramDmUrl = siteConfig.instagramUrl || "https://www.instagram.com/digitex.web/";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-elevated p-5 sm:p-7 rounded-3xl border border-white/10 max-w-lg w-full relative my-auto max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {successOrder ? (
            /* ================= SUCCESS STATE ================= */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Commande Reçue avec Succès !
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {successOrder.orderNumber}
                </h3>
                <p className="text-xs text-silver/70 mt-1 max-w-sm mx-auto">
                  Votre commande pour <span className="text-white font-bold">{product.name}</span> ({selectedTier.duration}) est enregistrée. Nous vous contacterons sous 5 à 15 minutes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center text-silver/70">
                  <span>Canal de contact :</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    {contactChannel === "WHATSAPP" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        WhatsApp ({contactValue})
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-pink-400" />
                        Instagram ({contactValue})
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-silver/70">
                  <span>Règlement :</span>
                  <span className="text-white font-semibold">{currentPaymentInfo.name}</span>
                </div>
                {paymentProof && (
                  <div className="flex justify-between text-silver/70">
                    <span>Reçu de paiement :</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reçu joint
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-silver/70 pt-1 border-t border-white/5">
                  <span>Montant Total :</span>
                  <span className="text-cyan font-bold text-sm">
                    {formatPrice(selectedTier.priceDZD)} DZD
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {contactChannel === "WHATSAPP" ? (
                  <a
                    href={confirmationWaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Envoyer la confirmation sur WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href={instagramDmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Nous contacter sur Instagram</span>
                  </a>
                )}

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
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan/10 text-cyan border border-cyan/30">
                  Commander
                </span>
                <span className="text-xs text-silver/60">
                  {product.deliveryTime || "Livraison 5 - 15 minutes"}
                </span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">
                {product.name} &bull;{" "}
                <span className="text-cyan">{selectedTier.duration}</span>
              </h2>

              <div className="flex items-baseline gap-1 mt-1 mb-4 text-silver/80 text-xs">
                <span>Total à régler :</span>
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

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 1. CHOOSE CONTACT DESTINATION */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1.5">
                    Où souhaitez-vous être contacté ? <span className="text-cyan">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setContactChannel("INSTAGRAM");
                        setError(null);
                      }}
                      className="py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold transition border cursor-pointer bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.25)]"
                    >
                      <svg className="w-4 h-4 fill-pink-400" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram (Actif)</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      title="WhatsApp est temporairement hors service"
                      className="py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium transition border cursor-not-allowed bg-white/[0.02] text-silver/40 border-white/5 opacity-50"
                    >
                      <Smartphone className="w-4 h-4 text-silver/30" />
                      <span>WhatsApp (Inactif)</span>
                    </button>
                  </div>
                </div>

                {/* 2. DYNAMIC CONTACT INPUT (PHONE OR INSTAGRAM USERNAME) */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    {contactChannel === "WHATSAPP" ? (
                      <>
                        Numéro WhatsApp (Algérie) <span className="text-cyan">*</span>
                      </>
                    ) : (
                      <>
                        Nom d&apos;utilisateur Instagram <span className="text-cyan">*</span>
                      </>
                    )}
                  </label>

                  {contactChannel === "WHATSAPP" ? (
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-silver/40">
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={contactValue}
                          onChange={(e) => setContactValue(e.target.value)}
                          placeholder="0550123456 / 0660123456 / 0770123456"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition text-xs"
                        />
                      </div>
                      <span className="text-[10px] text-silver/50 mt-1 block">
                        Format : 05xx, 06xx ou 07xx (10 chiffres).
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-400 font-bold text-sm">
                          @
                        </div>
                        <input
                          type="text"
                          required
                          value={contactValue.replace(/^@/, "")}
                          onChange={(e) => setContactValue(`@${e.target.value.replace(/^@/, "")}`)}
                          placeholder="votre_pseudo"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-pink-500/60 transition text-xs"
                        />
                      </div>
                      <span className="text-[10px] text-silver/50 mt-1 block">
                        Ex : @amine_dz • Nous vous enverrons les accès en Message Direct.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. MODE DE REGLEMENT (5 PAYMENT METHODS) */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1.5">
                    Mode de Règlement <span className="text-cyan">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {paymentMethodsList.map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          type="button"
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`py-2 px-2.5 rounded-xl text-center font-bold text-[11px] transition border cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-[#075BDB] text-white border-cyan shadow-[0_0_12px_rgba(0,191,255,0.35)]"
                              : "bg-white/[0.04] text-silver/75 border-white/10 hover:text-white hover:bg-white/[0.08]"
                          }`}
                        >
                          {pm.id === "baridimob" && <Smartphone className="w-3.5 h-3.5 text-emerald-300" />}
                          {pm.id === "ccp" && <Building2 className="w-3.5 h-3.5 text-yellow-300" />}
                          {pm.id === "binance" && <Coins className="w-3.5 h-3.5 text-amber-300" />}
                          {pm.id === "redotpay" && <CreditCard className="w-3.5 h-3.5 text-rose-300" />}
                          {pm.id === "flexy" && <PhoneCall className="w-3.5 h-3.5 text-cyan" />}
                          <span className="truncate">{pm.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* PAYMENT DETAILS CARD WITH COPY BUTTON */}
                  {currentPaymentInfo && (
                    <motion.div
                      key={currentPaymentInfo.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 p-3.5 rounded-2xl bg-cyan/5 border border-cyan/20 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-silver/70">
                          {currentPaymentInfo.accountLabel}
                        </span>
                        {currentPaymentInfo.holderName && (
                          <span className="text-[10px] text-cyan/90 font-medium">
                            {currentPaymentInfo.holderName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                        <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-wider select-all break-all">
                          {currentPaymentInfo.accountValue}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="ml-2 px-2.5 py-1 rounded-lg bg-cyan/20 hover:bg-cyan/30 text-cyan text-[11px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-silver/60 leading-relaxed">
                        {currentPaymentInfo.instructions}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* 4. UPLOAD PROOF OF TRANSFER */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Preuve de virement / Reçu (Capture d&apos;écran)
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {paymentProof ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/30 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={paymentProof}
                          alt="Preuve"
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-emerald-400 font-semibold truncate text-[11px]">
                            {paymentProofName || "Capture de paiement jointe"}
                          </p>
                          <span className="text-[10px] text-silver/50">Prêt à être envoyé</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="p-1.5 rounded-lg text-silver/50 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                        title="Supprimer la preuve"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-white/20 hover:border-cyan/50 bg-white/[0.02] hover:bg-cyan/[0.03] transition flex items-center justify-center gap-2 text-silver/70 hover:text-white cursor-pointer"
                    >
                      {uploadingImage ? (
                        <div className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 text-cyan" />
                      )}
                      <span className="text-xs">
                        {uploadingImage
                          ? "Chargement de l'image..."
                          : "Téléverser la capture d'écran / reçu de virement"}
                      </span>
                    </button>
                  )}
                  <span className="text-[10px] text-silver/50 mt-1 block">
                    Optionnel mais recommandé pour une activation immédiate.
                  </span>
                </div>

                {/* 5. NOTES */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Instructions ou Remarques (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Activer sur mon email personnel ou instructions spécifiques..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition resize-none text-xs"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] transition shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Confirmer la commande ({formatPrice(selectedTier.priceDZD)} DZD)
                      </span>
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
