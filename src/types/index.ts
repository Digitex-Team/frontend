export type ProductCategory = 'all' | 'ai' | 'streaming' | 'design' | 'utilities';

export interface SubscriptionTier {
  id: string;
  duration: string; // e.g. "1 Mois", "3 Mois", "1 An"
  durationMonths: number;
  priceDZD: number;
  oldPriceDZD?: number;
  accountType: 'Compte Privé' | 'Profil Partagé' | 'Licence Officielle';
  isPopular?: boolean;
  savingsBadge?: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  brandColor?: string;
  accentGlow?: string;
  badge?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewsCount: number;
  deliveryTime: string; // e.g. "5 - 15 minutes"
  inStock: boolean;
  warranty: string; // e.g. "Garantie complète 30 jours"
  plans: SubscriptionTier[];
  features: string[];
  activationSteps: string[];
  faq: ProductFaq[];
}

export type PaymentMethod = 'baridimob' | 'ccp' | 'binance' | 'hand';

export interface OrderFormData {
  customerName: string;
  whatsapp: string;
  email: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface BrandPartner {
  id: string;
  name: string;
  category: string;
  popularProduct: string;
  badge?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  telegramUsername: string;
  email: string;
  phone: string;
  location: string;
  workingHours: string;
  baridimobRIP: string;
  ccpAccount: string;
  binancePayId: string;
}

