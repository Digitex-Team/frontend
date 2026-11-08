import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { getLiveProductBySlug } from "@/lib/api";

// Force dynamic rendering so every product (newly created or updated) renders live without build-time SSG locks
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getLiveProductBySlug(slug);
    if (product) {
      return {
        title: `${product.name} — Abonnement Algérie | ${siteConfig.name}`,
        description: `${product.shortDesc || product.name} Disponible en Algérie avec paiement sécurisé BaridiMob & CCP. Livraison 5 à 15 minutes.`,
      };
    }
  } catch (_e) {}

  return {
    title: `Détails Produit — ${siteConfig.name}`,
  };
}

// Inner async component wrapped in Suspense for Next.js Instant Navigation
async function ProductDetailContent({ params }: Props) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getLiveProductBySlug(slug);
  } catch (_e) {
    product = null;
  }

  // Pass both initialProduct (from SSR if successful) and slug (for client fallback if SSR could not reach backend)
  return <ProductDetailClient initialProduct={product} slug={slug} />;
}

// Loading Skeleton matching the exact glassmorphic structure
function ProductDetailSkeleton() {
  return (
    <div className="py-8 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-48 bg-white/5 rounded-full mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-5 h-[380px] rounded-3xl bg-white/[0.03] border border-white/10" />
        <div className="lg:col-span-7 space-y-6">
          <div className="h-10 w-3/4 bg-white/10 rounded-xl" />
          <div className="h-16 w-full bg-white/5 rounded-xl" />
          <div className="h-48 w-full rounded-3xl bg-white/[0.04] border border-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
