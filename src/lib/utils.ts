import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with non-breaking spaces for thousands separator
 * Guaranteed 100% deterministic between Server (SSR) and Client hydration.
 */
export function formatPrice(price: number): string {
  if (typeof price !== "number" || isNaN(price)) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
