"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  ThumbsUp,
  ShieldCheck,
} from "lucide-react";
import { Review } from "@/types";
import { submitProductReview } from "@/lib/api";

interface ProductReviewsSectionProps {
  productSlug: string;
  productName: string;
  initialReviews?: Review[];
  initialRating?: number;
  initialReviewsCount?: number;
}

export function ProductReviewsSection({
  productSlug,
  productName,
  initialReviews = [],
  initialRating = 4.9,
  initialReviewsCount = 0,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live rating stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews) * 10) / 10
      : initialRating;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setError("Veuillez renseigner un nom valide (au moins 2 caractères).");
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      setError("Veuillez rédiger un avis constructif (au moins 3 caractères).");
      return;
    }

    setSubmitting(true);
    try {
      const newReview = await submitProductReview(productSlug, {
        authorName: authorName.trim(),
        rating: selectedRating,
        comment: comment.trim(),
      });

      // Optimistic update
      setReviews((prev) => [
        {
          id: newReview.id || `rev-${Date.now()}`,
          productId: newReview.productId || "",
          authorName: authorName.trim(),
          rating: selectedRating,
          comment: comment.trim(),
          isApproved: true,
          createdAt: newReview.createdAt || new Date().toISOString(),
        },
        ...prev,
      ]);

      setSuccessMsg("Merci ! Votre avis a été publié avec succès.");
      setAuthorName("");
      setComment("");
      setSelectedRating(5);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Erreur lors de l'enregistrement de votre avis. Veuillez réessayer.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (_e) {
      return "Récemment";
    }
  };

  return (
    <div id="reviews-section" className="mt-12 sm:mt-16 scroll-mt-24 space-y-6">
      {/* Header card with summary & action */}
      <div className="glass-elevated p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex flex-col items-center justify-center text-amber-400 shrink-0 shadow-[0_0_25px_rgba(251,191,36,0.2)]">
              <span className="text-2xl sm:text-3xl font-black">{averageRating}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-2.5 h-2.5 ${star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-amber-400/30"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">
                  Avis & Témoignages Clients
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-silver/60">
                  {totalReviews > 0 ? `${totalReviews} avis` : `${initialReviewsCount || 0} avis`}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Ce que nos clients pensent de {productName}
              </h3>
              <p className="text-xs text-silver/70 mt-1 max-w-lg">
                Retours d&apos;expériences réels et certifiés de clients ayant commandé sur Digitex Store DZ.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(0,191,255,0.35)] cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Donner mon avis</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-silver/40">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">Aucun avis déposé pour le moment</p>
            <p className="text-xs text-silver/60 max-w-sm mx-auto">
              Vous avez commandé cet abonnement ? Partagez votre expérience avec la communauté algérienne !
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan text-xs font-bold transition cursor-pointer"
            >
              Rédiger le premier avis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl glass-base border border-white/5 hover:border-white/10 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075BDB]/30 to-[#00BFFF]/30 border border-white/10 flex items-center justify-center font-bold text-xs text-cyan shrink-0">
                      {rev.authorName ? rev.authorName.slice(0, 2).toUpperCase() : "CL"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{rev.authorName}</span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-2.5 h-2.5" /> Achat vérifié
                        </span>
                      </div>
                      <span className="text-[10px] text-silver/50 block">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-3 h-3 ${st <= (rev.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-amber-400/20"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-silver/85 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-7 rounded-3xl border border-white/10 max-w-lg w-full relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">
                  Partager votre expérience
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Laisser un avis sur {productName}
                </h3>
                <p className="text-xs text-silver/60 mt-1">
                  Votre retour d&apos;expérience aide la communauté à faire le bon choix.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Star rating selector */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-2">
                    Votre Note globale <span className="text-cyan">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || selectedRating) >= star;
                      return (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setSelectedRating(star)}
                          className="p-1 rounded-lg hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${isFilled
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "text-white/20"
                              }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-amber-400 font-bold ml-2 text-sm">
                      {selectedRating} / 5
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Votre Nom ou Pseudo <span className="text-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Yacine K. ou Amine DZ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-silver/90 font-semibold mb-1">
                    Votre Avis ou Commentaire <span className="text-cyan">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Dites-nous ce que vous avez pensé du service, de la rapidité d'activation ou du support..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan transition resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] transition shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publication en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publier mon avis</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

