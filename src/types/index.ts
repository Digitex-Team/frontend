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

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string; // e.g. "Par Google", "GPT-4o, o1, etc."
  tagline?: string;
  category: ProductCategory | string;
  categoryLabel?: string;
  shortDesc?: string;
  fullDesc?: string;
  price?: number; // e.g. 2400
  currency?: string; // "DZD"
  duration?: string; // e.g. "1 Mois", "1 An", "200 Go"
  features: string[]; // e.g. ["Accès complet", "Derniers modèles"] - Avantages & Inclus
  image?: string; // path to logo
  brandColor?: string; // e.g. "#10a37f" (ChatGPT green), "#D97706" (Claude orange), "#00BFFF" (iCloud)
  isPopular?: boolean;
  hasTierSelector?: boolean;
  accentGlow?: string;
  badge?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewsCount?: number;
  deliveryTime?: string; // e.g. "5 - 15 minutes"
  inStock?: boolean;
  isOutOfStock?: boolean;
  requiresContact?: boolean;
  warranty?: string; // e.g. "Garantie officielle"
  plans?: SubscriptionTier[];
  activationSteps?: string[];
  faq?: ProductFaq[];
  reviews?: Review[];
}

export type PaymentMethod = 'baridimob' | 'ccp' | 'binance' | 'redotpay' | 'flexy';

export type ContactChannel = 'WHATSAPP' | 'INSTAGRAM';

export interface OrderFormData {
  contactChannel: ContactChannel;
  contactValue: string;
  paymentMethod: PaymentMethod | string;
  paymentProof?: string;
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
  whatsappSalesNumber?: string;
  whatsappSalesDisplay?: string;
  whatsappSupportNumber?: string;
  whatsappSupportDisplay?: string;
  telegramUsername: string;
  discordUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  email: string;
  phone: string;
  location: string;
  workingHours: string;
  isWhatsappEnabled?: boolean;
  baridimobRIP: string;
  ccpAccount: string;
  binancePayId: string;
  redotPayId: string;
  flexyNumber: string;
}

