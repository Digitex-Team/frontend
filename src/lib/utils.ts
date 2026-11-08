import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number or string with non-breaking spaces for thousands separator
 * Guaranteed 100% deterministic between Server (SSR) and Client hydration.
 * Safely handles numbers, Prisma Decimal strings ("2900", "2500"), and undefined.
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "0";
  const num = typeof price === "number" ? price : parseFloat(String(price).replace(/\s+/g, ""));
  if (isNaN(num)) return "0";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

/**
 * Converts any title or string into a clean, URL-safe slug
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
