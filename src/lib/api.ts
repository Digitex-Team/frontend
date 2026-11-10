import axios from "axios";
import { Product, SubscriptionTier } from "@/types";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  iconName?: string;
  active: boolean;
  createdAt?: string;
  _count?: { products: number };
}

export interface SmartSearchResult {
  directMatches: Product[];
  relatedMatches: Product[];
  categoryName: string | null;
}

// Normalize API Base URL whether configured with or without '/api/v1'
const RAW_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");
export const ROOT_SERVER_URL = RAW_URL.replace(/\/api\/v1$/, "");
export const API_BASE_URL = `${ROOT_SERVER_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Auto-attach JWT Bearer token if saved in localStorage (avoids cross-site cookie blocks)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("digitex_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper to adapt Backend Prisma Product to Frontend Product Interface
export function mapBackendProductToFrontend(raw: any): Product {
  const tiers: SubscriptionTier[] = (raw.tiers || []).map((t: any) => ({
    id: t.id,
    duration: t.durationName,
    durationMonths: t.durationName.includes("An") ? 12 : t.durationName.includes("3") ? 3 : 1,
    priceDZD: typeof t.priceDZD === "string" ? parseFloat(t.priceDZD) : Number(t.priceDZD),
    accountType: (t.accountType as any) || "Compte Privé",
    isPopular: Boolean(t.isDefault),
  }));

  const defaultTier = tiers.find((t) => t.isPopular) || tiers[0];

  return {
    id: raw.id || raw.slug,
    slug: raw.slug,
    name: raw.name,
    subtitle: raw.subtitle || undefined,
    category: raw.category?.slug || "all",
    categoryLabel: raw.category?.name || "Services Digitex",
    shortDesc: raw.description || undefined,
    fullDesc: raw.description || undefined,
    price: defaultTier ? defaultTier.priceDZD : 0,
    currency: "DZD",
    duration: defaultTier ? defaultTier.duration : "1 Mois",
    features: raw.features || [],
    image: raw.image || "/chatgpt.png",
    brandColor: raw.brandColor || "#00BFFF",
    isPopular: Boolean(raw.isPopular),
    plans: tiers,
    inStock: true,
    deliveryTime: raw.deliveryTime || "5 - 15 minutes",
    warranty: raw.warranty || "Garantie officielle",
    rating: raw.rating !== undefined ? Number(raw.rating) : 4.9,
    reviewsCount: raw.reviewsCount !== undefined ? Number(raw.reviewsCount) : (raw.reviews?.length || 0),
    reviews: raw.reviews || [],
  };
}

// ================= PUBLIC STORE APIS =================

export async function getLiveCategories(): Promise<DbCategory[]> {
  try {
    const res = await apiClient.get("/categories");
    if (Array.isArray(res.data)) {
      return res.data;
    }
  } catch (_err) {}
  return [];
}

export async function getLiveProducts(category?: string, search?: string, sortBy?: string): Promise<Product[]> {
  try {
    const params: Record<string, string> = {};
    if (category && category !== "all") params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (sortBy) params.sortBy = sortBy;

    const res = await apiClient.get("/products", { params });
    const list = Array.isArray(res.data) ? res.data : res.data?.products;
    if (Array.isArray(list)) {
      return list.map(mapBackendProductToFrontend);
    }
  } catch (_err) {}
  return [];
}

export async function smartSearchProducts(query: string): Promise<SmartSearchResult> {
  const term = (query || "").trim();
  if (!term) {
    return { directMatches: [], relatedMatches: [], categoryName: null };
  }
  try {
    const res = await apiClient.get("/products/smart-search", {
      params: { q: term },
    });
    const data = res.data;
    return {
      directMatches: Array.isArray(data?.directMatches)
        ? data.directMatches.map(mapBackendProductToFrontend)
        : [],
      relatedMatches: Array.isArray(data?.relatedMatches)
        ? data.relatedMatches.map(mapBackendProductToFrontend)
        : [],
      categoryName: data?.categoryName || null,
    };
  } catch (_err) {
    return { directMatches: [], relatedMatches: [], categoryName: null };
  }
}

export async function getPaginatedProducts(query?: {
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; meta: PaginationMeta }> {
  try {
    const params: Record<string, any> = {};
    if (query?.category && query.category !== "all") params.category = query.category;
    if (query?.search && query.search.trim()) params.search = query.search.trim();
    if (query?.sortBy) params.sortBy = query.sortBy;
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const res = await apiClient.get("/products", { params });
    if (res.data?.products && res.data?.meta) {
      return {
        products: res.data.products.map(mapBackendProductToFrontend),
        meta: res.data.meta,
      };
    }
    if (Array.isArray(res.data)) {
      return {
        products: res.data.map(mapBackendProductToFrontend),
        meta: {
          total: res.data.length,
          page: 1,
          limit: res.data.length || 12,
          totalPages: 1,
        },
      };
    }
  } catch (_err) {}
  return {
    products: [],
    meta: { total: 0, page: 1, limit: query?.limit || 12, totalPages: 0 },
  };
}

export async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;

  // On Server (Next.js SSR/Server Component), try native fetch with cache: "no-store"
  if (typeof window === "undefined") {
    try {
      const url = `${API_BASE_URL}/products/${encodeURIComponent(slug)}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          return mapBackendProductToFrontend(data);
        }
      }
    } catch (_fetchErr) {
      // Fallback to apiClient
    }
  }

  try {
    const res = await apiClient.get(`/products/${encodeURIComponent(slug)}`);
    if (res.data) {
      return mapBackendProductToFrontend(res.data);
    }
  } catch (err: any) {
    if (err?.response?.status !== 404) {
      console.warn(`[API] getLiveProductBySlug('${slug}') notice:`, err?.message || err);
    }
  }
  return null;
}

export async function submitOrder(orderData: {
  contactChannel: 'WHATSAPP' | 'INSTAGRAM';
  contactValue: string;
  paymentMethod: string;
  paymentProof?: string;
  totalAmountDZD?: number;
  notes?: string;
  clientName?: string;
  whatsappPhone?: string;
  email?: string;
  items: Array<{
    productId?: string;
    tierId?: string;
    productName: string;
    tierName: string;
    priceDZD: number;
    quantity?: number;
  }>;
}) {
  const res = await apiClient.post("/orders", orderData);
  return res.data;
}

export async function submitProductReview(
  slug: string,
  reviewData: {
    authorName: string;
    rating: number;
    comment: string;
  }
) {
  const res = await apiClient.post(`/products/${encodeURIComponent(slug)}/reviews`, reviewData);
  return res.data;
}

export async function checkServerHealth() {
  const res = await axios.get(`${ROOT_SERVER_URL}/health`);
  return res.data;
}

// ================= ADMIN APIS =================

export async function adminLogin(username: string, password: string) {
  const res = await apiClient.post("/admin/auth/login", { username, password });
  if (res.data?.token && typeof window !== "undefined") {
    localStorage.setItem("digitex_admin_token", res.data.token);
  }
  return res.data;
}

export async function adminLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("digitex_admin_token");
  }
  const res = await apiClient.post("/admin/auth/logout");
  return res.data;
}

export async function adminGetProfile() {
  const res = await apiClient.get("/admin/auth/me");
  return res.data;
}

// Categories Management
export async function adminGetCategories(): Promise<DbCategory[]> {
  const res = await apiClient.get("/admin/categories");
  return res.data || [];
}

export async function adminCreateCategory(data: {
  name: string;
  slug?: string;
  iconName?: string;
  active?: boolean;
}) {
  const res = await apiClient.post("/admin/categories", data);
  return res.data;
}

export async function adminUpdateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    iconName?: string;
    active?: boolean;
  }
) {
  const res = await apiClient.patch(`/admin/categories/${id}`, data);
  return res.data;
}

export async function adminDeleteCategory(id: string) {
  const res = await apiClient.delete(`/admin/categories/${id}`);
  return res.data;
}

// Products Management
export async function adminGetProducts(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const res = await apiClient.get("/admin/products", { params });
  return res.data;
}

export async function adminCreateProduct(data: any) {
  const res = await apiClient.post("/admin/products", data);
  return res.data;
}

export async function adminUpdateProduct(id: string, data: any) {
  const res = await apiClient.patch(`/admin/products/${id}`, data);
  return res.data;
}

export async function adminDeleteProduct(id: string) {
  const res = await apiClient.delete(`/admin/products/${id}`);
  return res.data;
}

export async function adminDeleteProductTier(tierId: string) {
  const res = await apiClient.delete(`/admin/products/tiers/${tierId}`);
  return res.data;
}

// Orders Management
export async function adminGetOrders(
  status?: string,
  search?: string,
  page = 1,
  limit = 10
) {
  const params: Record<string, any> = { page, limit };
  if (status && status !== "ALL") params.status = status;
  if (search && search.trim()) params.search = search.trim();

  const res = await apiClient.get("/admin/orders", { params });
  return res.data;
}

export async function adminGetAnalytics() {
  const res = await apiClient.get("/admin/analytics");
  return res.data;
}

export async function adminGetOrderStats() {
  const res = await apiClient.get("/admin/analytics");
  return res.data;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  const res = await apiClient.patch(`/admin/orders/${id}/status`, { status });
  return res.data;
}

export async function adminDeleteOrder(id: string) {
  const res = await apiClient.delete(`/admin/orders/${id}`);
  return res.data;
}

// ================= SALES & ACCOUNTING APIS =================

export async function adminGetSalesStats(period: "day" | "week" | "month" | "all" = "day") {
  const res = await apiClient.get("/admin/sales/stats", { params: { period } });
  return res.data;
}

export async function adminGetSalesHistory(params?: {
  period?: "day" | "week" | "month" | "all";
  search?: string;
  page?: number;
  limit?: number;
}) {
  const res = await apiClient.get("/admin/sales/history", { params });
  return res.data;
}

export async function adminQuickCounter(
  productId: string,
  tierId?: string,
  action: "increment" | "decrement" = "increment"
) {
  const res = await apiClient.post("/admin/sales/quick-counter", {
    productId,
    tierId,
    action,
  });
  return res.data;
}

export async function adminCreateManualSale(data: {
  productName: string;
  productId?: string;
  tierName?: string;
  tierId?: string;
  sellingPriceDZD: number;
  costPriceDZD?: number;
  quantity?: number;
  channel?: string;
  notes?: string;
  customDate?: string;
}) {
  const res = await apiClient.post("/admin/sales", data);
  return res.data;
}

export async function adminDeleteSale(id: string) {
  const res = await apiClient.delete(`/admin/sales/${id}`);
  return res.data;
}
