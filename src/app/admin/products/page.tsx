"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetCategories,
  DbCategory,
} from "@/lib/api";
import { formatPrice, slugify } from "@/lib/utils";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBrandColor, setFormBrandColor] = useState("#00BFFF");
  const [formImage, setFormImage] = useState("/chatgpt.png");
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formFeatures, setFormFeatures] = useState("");
  const [formTiers, setFormTiers] = useState<
    Array<{ id?: string; durationName: string; priceDZD: number; accountType: string; isDefault: boolean; stockStatus: boolean }>
  >([
    { durationName: "1 Mois", priceDZD: 2500, accountType: "Compte Privé", isDefault: true, stockStatus: true },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const cats = await adminGetCategories();
      setCategories(cats || []);
    } catch (e) {
      console.error("Failed to load categories for product selector", e);
    }
  };

  const fetchProductsList = useCallback(
    async (targetPage = page, targetSearch = search, targetCat = selectedCategory) => {
      try {
        setLoading(true);
        const data = await adminGetProducts({
          page: targetPage,
          limit: 8,
          search: targetSearch.trim() || undefined,
          category: targetCat !== "all" ? targetCat : undefined,
        });

        if (data && data.products) {
          setProducts(data.products);
          setTotalPages(data.meta.totalPages || 1);
          setTotalCount(data.meta.total || 0);
          setPage(data.meta.page || 1);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
          setTotalCount(data.length);
        }
      } catch (e) {
        console.error("Failed to load admin products", e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, selectedCategory]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsList(page, search, selectedCategory);
  }, [page, selectedCategory, fetchProductsList]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProductsList(1, search, selectedCategory);
  };

  const handleSearchClear = () => {
    setSearch("");
    setPage(1);
    fetchProductsList(1, "", selectedCategory);
  };

  const openCreateModal = () => {
    setEditProduct(null);
    setFormName("");
    setFormSlug("");
    setFormCategoryId(categories[0]?.id || "");
    setFormSubtitle("");
    setFormDescription("");
    setFormBrandColor("#00BFFF");
    setFormImage("");
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
    setFormSlug(p.slug || slugify(p.name));
    setFormCategoryId(p.categoryId || p.category?.id || "");
    setFormSubtitle(p.subtitle || "");
    setFormDescription(p.description || "");
    setFormBrandColor(p.brandColor || "#00BFFF");
    setFormImage(p.image || "");
    setFormIsPopular(Boolean(p.isPopular));
    setFormIsActive(Boolean(p.isActive));
    setFormFeatures((p.features || []).join("\n"));
    setFormTiers(
      (p.tiers || []).map((t: any) => ({
        id: t.id,
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

  const handleNameChange = (val: string) => {
    setFormName(val);
    setFormSlug(slugify(val));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (PNG, JPG, WebP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/webp", 0.9);
          setFormImage(compressed);
        } else {
          setFormImage(result);
        }
      };
      img.onerror = () => {
        setFormImage(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
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
        await adminUpdateProduct(editProduct.id, {
          name: formName,
          slug: formSlug,
          categoryId: formCategoryId || null,
          subtitle: formSubtitle || null,
          description: formDescription || null,
          brandColor: formBrandColor || "#00BFFF",
          image: formImage || "/chatgpt.png",
          isPopular: formIsPopular,
          isActive: formIsActive,
          features: featuresArray,
          tiers: formTiers.map((t) => ({
            id: t.id,
            durationName: t.durationName,
            priceDZD: Number(t.priceDZD),
            accountType: t.accountType,
            isDefault: t.isDefault,
            stockStatus: t.stockStatus,
          })),
        });
      } else {
        await adminCreateProduct({
          name: formName,
          slug: formSlug,
          categoryId: formCategoryId || undefined,
          subtitle: formSubtitle || undefined,
          description: formDescription || undefined,
          brandColor: formBrandColor || "#00BFFF",
          image: formImage || "/chatgpt.png",
          isPopular: formIsPopular,
          isActive: formIsActive,
          features: featuresArray,
          tiers: formTiers.map((t) => ({
            durationName: t.durationName,
            priceDZD: Number(t.priceDZD),
            accountType: t.accountType,
            isDefault: t.isDefault,
            stockStatus: t.stockStatus,
          })),
        });
      }

      setModalOpen(false);
      fetchProductsList(page, search, selectedCategory);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Erreur lors de la sauvegarde";
      setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement le produit "${name}" de la base de données ? Cette action est irréversible.`)) return;
    try {
      await adminDeleteProduct(id);
      fetchProductsList(page, search, selectedCategory);
    } catch (err: any) {
      alert(err.response?.data?.message || "Impossible de supprimer ce produit");
    }
  };

  const addTier = () => {
    setFormTiers([
      ...formTiers,
      { durationName: "3 Mois", priceDZD: 5000, accountType: "Compte Privé", isDefault: false, stockStatus: true },
    ]);
  };

  const removeTier = (index: number) => {
    if (formTiers.length <= 1) {
      alert("Un produit doit avoir au moins une formule tarifaire.");
      return;
    }
    setFormTiers(formTiers.filter((_, i) => i !== index));
  };

  const updateTierField = (index: number, field: string, value: any) => {
    const updated = [...formTiers];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "isDefault" && value === true) {
      updated.forEach((t, i) => {
        if (i !== index) t.isDefault = false;
      });
    }
    setFormTiers(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#00BFFF]" />
            <span>Gestion des Produits & Tarifs</span>
          </h2>
          <p className="text-xs text-silver/60 mt-1">
            Gérez les produits en direct de la base de données, leurs catégories et durées d&apos;abonnement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchProductsList(page, search, selectedCategory);
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
            <span>Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-silver/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, slug ou description (dans la BDD)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0E1726]/80 border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          <div className="w-56">
            <CustomSelect
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val);
                setPage(1);
              }}
              options={[
                { value: "all", label: "Toutes les catégories" },
                ...categories.map((c) => ({ value: c.slug, label: c.name })),
              ]}
              variant="form"
              icon={<Filter className="w-3.5 h-3.5 text-[#00BFFF]" />}
            />
          </div>

          <span className="text-[11px] text-silver/50 hidden sm:inline whitespace-nowrap">
            Total : <strong className="text-white font-bold">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-elevated rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-silver/60">Chargement des produits depuis la base de données...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-silver/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">Aucun produit trouvé</p>
            <p className="text-xs text-silver/50 mt-1">
              Modifiez votre recherche ou créez un nouveau produit
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-silver/60 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Produit</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Formules & Prix</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0"
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

                    <td className="py-3.5 px-4">
                      {prod.category ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]">
                          <Layers className="w-3 h-3" />
                          <span>{prod.category.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-silver/40 italic">Non classé</span>
                      )}
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

                    <td className="py-3.5 px-4 sm:px-6 text-right">
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-silver/60">
              Page <strong className="text-white font-bold">{page}</strong> sur{" "}
              <strong className="text-white font-bold">{totalPages}</strong> ({totalCount} produits)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-silver hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Précédent</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    p === page
                      ? "bg-[#075BDB] text-white border border-[#00BFFF]"
                      : "bg-white/5 text-silver hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-elevated p-6 sm:p-8 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
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
                    <label className="block text-silver/80 font-semibold mb-1">Nom du Produit *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="ex: ChatGPT Plus"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-silver/80 font-semibold">Slug URL unique</label>
                      <span className="text-[10px] font-semibold text-cyan/80 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-full">
                        Auto-généré
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      readOnly
                      placeholder="Auto-généré d'après le nom..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090F1B] border border-white/10 text-cyan font-mono text-xs outline-none cursor-default opacity-90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">
                      Catégorie rattachée (Base de Données)
                    </label>
                    <CustomSelect
                      value={formCategoryId}
                      onChange={setFormCategoryId}
                      placeholder="-- Aucune catégorie (Non classé) --"
                      variant="form"
                      options={[
                        { value: "", label: "-- Aucune catégorie (Non classé) --" },
                        ...categories.map((c) => ({
                          value: c.id,
                          label: `${c.name} (${c.slug})`,
                        })),
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-silver/80 font-semibold mb-1">Sous-titre / Editeur</label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="ex: GPT-4o, o1, Canvas, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Upload Image Section (saved directly in DB) */}
                <div>
                  <label className="block text-silver/80 font-semibold mb-1.5">
                    Image / Logo du Produit (Enregistrée dans la base de données)
                  </label>
                  
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview Squircle */}
                    <div className="w-16 h-16 rounded-2xl bg-[#090F1B] border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                      {formImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={formImage}
                          alt="Preview"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-silver/30" />
                      )}
                    </div>

                    {/* Upload Actions */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{formImage ? "Remplacer l'image" : "Téléverser une image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>

                        {formImage && (
                          <button
                            type="button"
                            onClick={() => setFormImage("")}
                            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition cursor-pointer"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-silver/50">
                        Format PNG, WebP, JPG ou SVG. L&apos;image est optimisée et sauvegardée directement dans la base de données PostgreSQL.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Détails complets de l'offre..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-silver/80 font-semibold mb-1">
                    Avantages & Inclus (1 par ligne)
                  </label>
                  <textarea
                    rows={3}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Accès complet&#10;Derniers modèles&#10;Garantie 30 jours"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1726] border border-white/10 focus:border-[#00BFFF] text-white text-xs outline-none resize-none"
                  />
                </div>

                {/* Formules et Tarifs */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-silver/80 font-bold uppercase text-[10px] tracking-wider">
                      Formules tarifaires (Tiers)
                    </label>
                    <button
                      type="button"
                      onClick={addTier}
                      className="text-cyan hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une formule</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center gap-2 text-xs"
                      >
                        <input
                          type="text"
                          required
                          value={tier.durationName}
                          onChange={(e) => updateTierField(idx, "durationName", e.target.value)}
                          placeholder="Durée (ex: 1 Mois)"
                          className="flex-1 min-w-[110px] px-2.5 py-1.5 rounded-lg bg-[#0E1726] border border-white/10 text-white text-xs outline-none"
                        />
                        <div className="flex items-center gap-1 w-28">
                          <input
                            type="number"
                            required
                            min={0}
                            value={tier.priceDZD}
                            onChange={(e) => updateTierField(idx, "priceDZD", Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E1726] border border-white/10 text-cyan font-bold text-xs outline-none"
                          />
                          <span className="text-[10px] text-silver/60">DZD</span>
                        </div>
                        <div className="w-40">
                          <CustomSelect
                            value={tier.accountType}
                            onChange={(val) => updateTierField(idx, "accountType", val)}
                            variant="form"
                            options={[
                              { value: "Compte Privé", label: "Compte Privé" },
                              { value: "Profil Partagé", label: "Profil Partagé" },
                              { value: "Clé d'activation", label: "Clé d'activation" },
                            ]}
                          />
                        </div>
                        <CustomCheckbox
                          checked={tier.isDefault}
                          onChange={(checked) => updateTierField(idx, "isDefault", checked)}
                          label="Défaut"
                        />
                        <button
                          type="button"
                          onClick={() => removeTier(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-3">
                  <CustomCheckbox
                    checked={formIsPopular}
                    onChange={setFormIsPopular}
                    label="Mettre en avant (Populaire)"
                    description="Affiche le badge Top et place en tête de liste"
                  />

                  <CustomCheckbox
                    checked={formIsActive}
                    onChange={setFormIsActive}
                    label="Actif dans le catalogue"
                    description="Visible pour tous les clients"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-silver hover:text-white transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] text-white font-bold transition shadow-[0_0_20px_rgba(0,191,255,0.35)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>{editProduct ? "Sauvegarder" : "Créer le Produit"}</span>
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
