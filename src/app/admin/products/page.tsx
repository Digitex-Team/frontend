"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Search,
  Sparkles,
  AlertCircle,
  Shield,
  Layers,
} from "lucide-react";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBrandColor, setFormBrandColor] = useState("#00BFFF");
  const [formImage, setFormImage] = useState("/chatgpt.png");
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formFeatures, setFormFeatures] = useState("");
  const [formTiers, setFormTiers] = useState<
    Array<{ durationName: string; priceDZD: number; accountType: string; isDefault: boolean; stockStatus: boolean }>
  >([
    { durationName: "1 Mois", priceDZD: 2500, accountType: "Compte Privé", isDefault: true, stockStatus: true },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProductsList = async () => {
    try {
      const data = await adminGetProducts();
      setProducts(data || []);
    } catch (e) {
      console.error("Failed to load admin products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const openCreateModal = () => {
    setEditProduct(null);
    setFormName("");
    setFormSlug("");
    setFormSubtitle("");
    setFormDescription("");
    setFormBrandColor("#00BFFF");
    setFormImage("/chatgpt.png");
    setFormIsPopular(false);
    setFormIsActive(true);
    setFormFeatures("Accès complet\nGarantie de remplacement");
    setFormTiers([
      { durationName: "1 Mois", priceDZD: 2500, accountType: "Compte Privé", isDefault: true, stockStatus: true },
    ]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormSubtitle(p.subtitle || "");
    setFormDescription(p.description || "");
    setFormBrandColor(p.brandColor || "#00BFFF");
    setFormImage(p.image || "/chatgpt.png");
    setFormIsPopular(Boolean(p.isPopular));
    setFormIsActive(Boolean(p.isActive));
    setFormFeatures((p.features || []).join("\n"));
    setFormTiers(
      (p.tiers || []).map((t: any) => ({
        durationName: t.durationName,
        priceDZD: Number(t.priceDZD),
        accountType: t.accountType || "Compte Privé",
        isDefault: Boolean(t.isDefault),
        stockStatus: Boolean(t.stockStatus),
      }))
    );
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const featuresArray = formFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editProduct) {
        // PATCH
        await adminUpdateProduct(editProduct.id, {
          name: formName,
          slug: formSlug,
          subtitle: formSubtitle,
          description: formDescription,
          brandColor: formBrandColor,
          image: formImage,
          isPopular: formIsPopular,
          isActive: formIsActive,
          features: featuresArray,
          tiers: formTiers,
        });
      } else {
        // CREATE
        await adminCreateProduct({
          name: formName,
          slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          subtitle: formSubtitle,
          description: formDescription,
          brandColor: formBrandColor,
          image: formImage,
          isPopular: formIsPopular,
          isActive: formIsActive,
          features: featuresArray,
          tiers: formTiers,
        });
      }
      setModalOpen(false);
      fetchProductsList();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erreur lors de la sauvegarde du produit";
      setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirmez-vous la suppression du produit '${name}' ?`)) return;
    try {
      await adminDeleteProduct(id);
      fetchProductsList();
    } catch (e) {
      console.error("Failed to delete product", e);
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-cyan" />
            <span>Gestion des Produits & Tarifs</span>
          </h1>
          <p className="text-xs sm:text-sm text-silver/60 mt-1">
            Gérez vos offres d&apos;abonnements, licences, couleurs de marque et formules de durées.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-xs font-bold text-white flex items-center gap-2 transition shadow-[0_0_20px_rgba(0,191,255,0.35)] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-elevated p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        <Search className="w-4 h-4 text-silver/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit par nom ou slug..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-silver/40"
        />
      </div>

      {/* Products Table */}
      <div className="glass-elevated rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-silver/50">Chargement des produits...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-silver/50">Aucun produit trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-silver/60 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Produit</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Formules & Prix</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: `${prod.brandColor || "#00BFFF"}20`,
                            border: `1px solid ${prod.brandColor || "#00BFFF"}50`,
                            color: prod.brandColor || "#00BFFF",
                          }}
                        >
                          {prod.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{prod.name}</p>
                          <p className="text-[11px] text-silver/50">{prod.subtitle || "Service Digitex"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan text-xs">
                      {prod.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            prod.isActive ? "bg-emerald-400" : "bg-silver/40"
                          }`}
                        />
                        <span className="text-silver/80">
                          {prod.isActive ? "Actif" : "Inactif"}
                        </span>
                        {prod.isPopular && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 ml-1">
                            Top
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {(prod.tiers || []).slice(0, 2).map((t: any) => (
                          <div key={t.id} className="text-[11px] text-silver/80 flex items-center gap-1">
                            <span className="font-semibold text-white">{t.durationName} :</span>
                            <span className="text-cyan font-bold">{formatPrice(t.priceDZD)} DZD</span>
                          </div>
                        ))}
                        {(prod.tiers || []).length > 2 && (
                          <span className="text-[10px] text-silver/40">
                            + {prod.tiers.length - 2} autre(s) formule(s)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan transition cursor-pointer"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-8 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan" />
                  <span>{editProduct ? "Modifier le Produit" : "Nouveau Produit"}</span>
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">Nom du Produit</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="ChatGPT Plus"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">Slug URL</label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="chatgpt-plus"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">Sous-titre</label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Par OpenAI (Dernière version)"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">Couleur de Marque (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formBrandColor}
                        onChange={(e) => setFormBrandColor(e.target.value)}
                        className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formBrandColor}
                        onChange={(e) => setFormBrandColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Accès complet sans carte internationale..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                  />
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Fonctionnalités (Une par ligne)
                  </label>
                  <textarea
                    rows={3}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Accès complet&#10;Garantie de remplacement 30j"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1726] border border-white/10 text-white outline-none focus:border-cyan"
                  />
                </div>

                {/* Formules / Tiers Section */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-silver/80 font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan" />
                      <span>Formules & Tarifs (DZD)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormTiers([
                          ...formTiers,
                          {
                            durationName: "3 Mois",
                            priceDZD: 6000,
                            accountType: "Compte Privé",
                            isDefault: false,
                            stockStatus: true,
                          },
                        ])
                      }
                      className="text-[11px] text-cyan hover:underline font-semibold"
                    >
                      + Ajouter une formule
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center gap-2"
                      >
                        <input
                          type="text"
                          required
                          value={tier.durationName}
                          onChange={(e) => {
                            const updated = [...formTiers];
                            updated[idx].durationName = e.target.value;
                            setFormTiers(updated);
                          }}
                          placeholder="Ex: 1 Mois"
                          className="px-2.5 py-1.5 rounded-lg bg-[#0E1726] border border-white/10 text-white w-28 text-xs"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            required
                            min={0}
                            value={tier.priceDZD}
                            onChange={(e) => {
                              const updated = [...formTiers];
                              updated[idx].priceDZD = parseFloat(e.target.value) || 0;
                              setFormTiers(updated);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0E1726] border border-white/10 text-white w-24 text-xs"
                          />
                          <span className="text-[10px] text-silver/60">DZD</span>
                        </div>
                        <input
                          type="text"
                          value={tier.accountType}
                          onChange={(e) => {
                            const updated = [...formTiers];
                            updated[idx].accountType = e.target.value;
                            setFormTiers(updated);
                          }}
                          placeholder="Compte Privé"
                          className="px-2.5 py-1.5 rounded-lg bg-[#0E1726] border border-white/10 text-white w-28 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formTiers.filter((_, i) => i !== idx);
                            setFormTiers(updated);
                          }}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <span className="text-silver/80">Produit Actif (Visible)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <span className="text-silver/80">Mettre en vedette (Populaire)</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-silver text-xs font-semibold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold transition shadow-[0_0_20px_rgba(0,191,255,0.35)] cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Sauvegarde en cours..." : editProduct ? "Mettre à jour" : "Créer le produit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

