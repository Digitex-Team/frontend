import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsCatalog } from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";

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
  const product = productsCatalog.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Produit non trouvé — Digitex",
    };
  }

  return {
    title: `${product.name} — Abonnement Algérie | ${siteConfig.name}`,
    description: `${product.shortDesc} Disponible en Algérie avec paiement sécurisé BaridiMob & CCP. Livraison 5 à 15 minutes.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = productsCatalog.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
