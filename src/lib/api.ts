import axios from "axios";
import { Product, SubscriptionTier } from "@/types";
import { productsCatalog } from "@/data/products";

// Normalize API Base URL whether configured with or without '/api/v1'
const RAW_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
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
    deliveryTime: "5 - 15 minutes",
  };
}

// ================= PUBLIC STORE APIS =================

export async function getLiveProducts(category?: string, search?: string, sortBy?: string): Promise<Product[]> {
  try {
    const params: Record<string, string> = {};
    if (category && category !== "all") params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (sortBy) params.sortBy = sortBy;

    const res = await apiClient.get("/products", { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(mapBackendProductToFrontend);
    }
  } catch (_err) {
    // Graceful fallback to static catalog during SSR/offline/build
  }

  // Graceful fallback to static catalog
  let list = [...productsCatalog];
  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }
  if (search && search.trim()) {
    const s = search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
  }
  return list;
}

export async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await apiClient.get(`/products/${slug}`);
    if (res.data) {
      return mapBackendProductToFrontend(res.data);
    }
  } catch (_err) {
    // Graceful fallback to static catalog during SSR/offline/build
  }

  return productsCatalog.find((p) => p.slug === slug) || null;
}

export async function submitOrder(orderData: {
  clientName: string;
  whatsappPhone: string;
  email?: string;
  paymentMethod: string;
  totalAmountDZD: number;
  notes?: string;
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

export async function adminGetProducts() {
  const res = await apiClient.get("/admin/products");
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

export async function adminGetOrders(status?: string, search?: string, page = 1) {
  const params: Record<string, any> = { page };
  if (status && status !== "ALL") params.status = status;
  if (search) params.search = search;

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
