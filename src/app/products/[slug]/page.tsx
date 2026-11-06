import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsCatalog } from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { getLiveProductBySlug } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productsCatalog.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getLiveProductBySlug(slug);

  if (!product) {
    return {
      title: "Produit non trouvé — Digitex",
    };
  }

  return {
    title: `${product.name} — Abonnement Algérie | ${siteConfig.name}`,
    description: `${product.shortDesc || product.name} Disponible en Algérie avec paiement sécurisé BaridiMob & CCP. Livraison 5 à 15 minutes.`,
  };
}

// Inner async component wrapped in Suspense for Next.js Instant Navigation
async function ProductDetailContent({ params }: Props) {
  const { slug } = await params;
  const product = await getLiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
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
