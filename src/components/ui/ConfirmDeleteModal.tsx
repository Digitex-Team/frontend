"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X, Loader2, Database } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  itemType?: "produit" | "commande" | "catégorie" | "élément";
  description?: string;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Suppression Définitive",
  itemName,
  itemType = "élément",
  description,
  loading = false,
}: ConfirmDeleteModalProps) {
  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#090E1A]/95 border border-rose-500/30 p-6 shadow-[0_20px_60px_rgba(5,7,12,0.9),0_0_35px_rgba(244,63,94,0.25)] z-10"
          >
            {/* Ambient Red Glow in Background */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white transition disabled:opacity-40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon + Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)]">
                  <Trash2 className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#090E1A] border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Database className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Tag / Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-2">
                <AlertTriangle className="w-3 h-3" />
                <span>Hard Delete Direct &bull; Base De Données</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-white tracking-tight">
                {title}
              </h3>

              {/* Item Name Highlight */}
              {itemName && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-rose-950/20 border border-rose-500/20 max-w-full">
                  <p className="text-xs text-rose-200/90 font-mono font-semibold truncate">
                    {itemType ? `${itemType.toUpperCase()} : ` : ""}
                    <span className="text-white font-bold">"{itemName}"</span>
                  </p>
                </div>
              )}

              {/* Description / Explanation */}
              <p className="text-xs text-silver/70 mt-3 leading-relaxed">
                {description || (
                  <>
                    Êtes-vous absolument sûr de vouloir supprimer définitivement cet enregistrement de la base de données ?{" "}
                    <strong className="text-rose-300 font-semibold">
                      Cette action est irréversible
                    </strong>{" "}
                    et supprimera physiquement toutes les données associées.
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-silver hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer définitivement</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

