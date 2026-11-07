"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Package,
  RefreshCw,
  Eye,
  Shield,
  Palette,
  Tv,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  DbCategory,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

const PRESET_ICONS = [
  "Sparkles",
  "Palette",
  "Tv",
  "ShieldCheck",
  "Zap",
  "Package",
  "Shield",
  "Layers",
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<DbCategory | null>(null);

  // High-End Hard Delete Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIconName, setFormIconName] = useState("Sparkles");
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategoriesList = async () => {
    try {
      const data = await adminGetCategories();
      setCategories(data || []);
    } catch (e) {
      console.error("Failed to load admin categories", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const openCreateModal = () => {
    setEditCategory(null);
    setFormName("");
    setFormSlug("");
    setFormIconName("Sparkles");
    setFormActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: DbCategory) => {
    setEditCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIconName(cat.iconName || "Sparkles");
    setFormActive(cat.active);
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    setFormSlug(slugify(name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (!formName.trim()) {
        throw new Error("Le nom de la catégorie est obligatoire");
      }

      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        iconName: formIconName,
        active: formActive,
      };

      if (editCategory) {
        await adminUpdateCategory(editCategory.id, payload);
      } else {
        await adminCreateCategory(payload);
      }

      setModalOpen(false);
      fetchCategoriesList();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Une erreur est survenue";
      setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeletingId(categoryToDelete.id);
    try {
      await adminDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      fetchCategoriesList();
    } catch (err: any) {
      alert(err.response?.data?.message || "Impossible de supprimer cette catégorie");
    } finally {
      setDeletingId(null);
    }
  };

  const totalConnectedProducts = categories.reduce(
    (acc, cat) => acc + (cat._count?.products || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#00BFFF]" />
            <span>Gestion des Catégories</span>
          </h2>
          <p className="text-xs text-silver/60 mt-1">
            Contrôlez les catégories de services et leurs associations aux produits du catalogue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchCategoriesList();
            }}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver hover:text-white border border-white/10 transition cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-cyan" : ""}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold transition shadow-[0_0_20px_rgba(0,191,255,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Catégorie</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#075BDB]/20 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-silver/60 uppercase font-bold tracking-wider">Total Catégories</p>
            <p className="text-lg font-black text-white">{categories.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-silver/60 uppercase font-bold tracking-wider">Catégories Actives</p>
            <p className="text-lg font-black text-white">
              {categories.filter((c) => c.active).length}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-silver/60 uppercase font-bold tracking-wider">Produits Liés</p>
            <p className="text-lg font-black text-white">{totalConnectedProducts}</p>
          </div>
        </div>
      </div>

      {/* Categories Table / List */}
      <div className="glass-elevated rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-silver/60">Chargement des catégories depuis la base de données...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <Layers className="w-12 h-12 text-silver/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">Aucune catégorie enregistrée</p>
            <p className="text-xs text-silver/50 mt-1">
              Créez votre première catégorie pour organiser les produits du catalogue
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl bg-[#075BDB] hover:bg-[#075BDB]/80 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une catégorie</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-silver/60 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Catégorie</th>
                  <th className="py-3.5 px-4">Identifiant Slug</th>
                  <th className="py-3.5 px-4 text-center">Produits Rattachés</th>
                  <th className="py-3.5 px-4 text-center">Statut</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#05070C] border border-white/10 flex items-center justify-center text-[#00BFFF] shadow-[0_0_10px_rgba(0,191,255,0.2)]">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{cat.name}</p>
                          <p className="text-[10px] text-silver/50">Icône : {cat.iconName || "Sparkles"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-[#00BFFF]">
                      {cat.slug}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white">
                        <Package className="w-3.5 h-3.5 text-cyan" />
                        <span>{cat._count?.products || 0}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      {cat.active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <X className="w-3 h-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-silver hover:text-white transition cursor-pointer"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                          disabled={deletingId === cat.id}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer disabled:opacity-50"
                          title="Supprimer définitivement la catégorie"
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

      {/* Create / Edit Category Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075BDB] to-[#00BFFF] flex items-center justify-center text-white">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {editCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                    </h3>
                    <p className="text-[11px] text-silver/60">
                      Configuration dans la base de données
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-silver/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase font-bold text-silver/70 text-[10px] tracking-wider mb-1.5">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="ex: Streaming & Musique"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block uppercase font-bold text-silver/70 text-[10px] tracking-wider">
                      Slug URL
                    </label>
                    <span className="text-[10px] font-semibold text-cyan/80 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-full">
                      Auto-généré
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    readOnly
                    placeholder="Auto-généré à partir du nom..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090F1B] border border-white/10 text-[#00BFFF] font-mono text-xs outline-none cursor-default opacity-90"
                  />
                  <p className="text-[10px] text-silver/40 mt-1">
                    Généré automatiquement : <span className="font-mono text-cyan">/products?category={formSlug || "slug"}</span>
                  </p>
                </div>

                <div>
                  <label className="block uppercase font-bold text-silver/70 text-[10px] tracking-wider mb-1.5">
                    Icône Lucide
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        type="button"
                        key={icon}
                        onClick={() => setFormIconName(icon)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                          formIconName === icon
                            ? "bg-[#075BDB] border-[#00BFFF] text-white"
                            : "bg-white/5 border-white/10 text-silver/60 hover:text-white"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formIconName}
                    onChange={(e) => setFormIconName(e.target.value)}
                    placeholder="Nom d'icône"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none"
                  />
                </div>

                <div className="pt-2">
                  <CustomCheckbox
                    checked={formActive}
                    onChange={setFormActive}
                    label="Catégorie active et visible dans la boutique"
                    description="Si désactivée, cette catégorie et ses filtres ne s'afficheront pas aux clients"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold transition shadow-[0_0_15px_rgba(0,191,255,0.35)] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>{editCategory ? "Enregistrer" : "Créer la catégorie"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern High-End Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
        title="Supprimer la Catégorie"
        itemName={categoryToDelete?.name}
        itemType="catégorie"
        description="Attention : cette catégorie sera définitivement supprimée de la base de données PostgreSQL. Les produits associés verront leur catégorie dissociée. Cette opération est irréversible."
        loading={!!deletingId}
      />
    </div>
  );
}

