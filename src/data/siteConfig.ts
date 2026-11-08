import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Digitex",
  tagline: "Abonnements Digitaux & Licences Logicielles Premium",
  description: "Plateforme n°1 en Algérie pour vos abonnements ChatGPT Plus, Claude, Midjourney, Netflix, Spotify, Canva Pro et licences logicielles. Livraison instantanée 5-15 min, paiement 100% sécurisé BaridiMob & CCP.",
  whatsappNumber: "+213555123456",
  whatsappDisplay: "+213 (0) 555 12 34 56",
  whatsappSalesNumber: "+213555123456",
  whatsappSalesDisplay: "+213 (0) 555 12 34 56",
  whatsappSupportNumber: "+213770987654",
  whatsappSupportDisplay: "+213 (0) 770 98 76 54",
  telegramUsername: "digitex_web",
  discordUrl: "https://discord.gg/Z3ZnhfrXR5",
  instagramUrl: "https://www.instagram.com/digitex.web/",
  facebookUrl: "https://www.facebook.com/digitex.web/",
  isWhatsappEnabled: false,
  email: "contact@digitex.store",
  phone: "+213 (0) 555 12 34 56",
  location: "Alger, Algérie • Livraison Digitale Immédiate",
  workingHours: "7j/7 • 09:00 - 00:00 (Support 24/7 pour urgences)",
  baridimobRIP: "00799999004278633637",
  ccpAccount: "0042786336 Clé 37",
  binancePayId: "743353266",
  redotPayId: "1601619871",
  flexyNumber: "0555 12 34 56",
};

export interface PaymentInfoDetail {
  id: string;
  name: string;
  badge?: string;
  iconName: string;
  accountLabel: string;
  accountValue: string;
  holderName?: string;
  instructions: string;
  color: string;
}

export const paymentMethodsList: PaymentInfoDetail[] = [
  {
    id: "baridimob",
    name: "BaridiMob",
    badge: "Recommandé • Instantané",
    iconName: "Smartphone",
    accountLabel: "RIP BaridiMob (20 chiffres)",
    accountValue: "00799999004278633637",
    holderName: "Digitex Store DZ",
    instructions: "Effectuez le virement vers ce RIP via l'application BaridiMob, puis téléversez la capture d'écran du reçu ci-dessous.",
    color: "#059669",
  },
  {
    id: "ccp",
    name: "CCP / Poste",
    badge: "Classique",
    iconName: "Building2",
    accountLabel: "Numéro de Compte CCP & Clé",
    accountValue: "0042786336 Clé 37",
    holderName: "Digitex Store DZ",
    instructions: "Versement au bureau de poste ou mandat (Compte: 0042786336, Clé: 37). Téléversez une photo claire du reçu de versement ci-dessous.",
    color: "#eab308",
  },
  {
    id: "binance",
    name: "Binance Pay",
    badge: "Crypto USDT",
    iconName: "Coins",
    accountLabel: "Binance Pay ID (USDT)",
    accountValue: "743353266",
    holderName: "Digitex Pay (USDT)",
    instructions: "Envoyez le montant équivalent en USDT (taux du jour) via Binance Pay vers ce Pay ID, puis téléversez la capture de confirmation.",
    color: "#f59e0b",
  },
  {
    id: "redotpay",
    name: "RedotPay",
    badge: "Sans frais",
    iconName: "CreditCard",
    accountLabel: "RedotPay UID",
    accountValue: "1601619871",
    holderName: "Digitex RedotPay",
    instructions: "Transfert interne RedotPay instantané sans frais vers cet UID. Téléversez la capture de la transaction.",
    color: "#ef4444",
  },
  {
    id: "flexy",
    name: "Flexy",
    badge: "+20% frais",
    iconName: "PhoneCall",
    accountLabel: "Numéro Flexy (Mobilis / Djezzy / Ooredoo)",
    accountValue: "0555 12 34 56",
    holderName: "Digitex Flexy DZ",
    instructions: "Envoyez le flexy vers ce numéro avec +20% de frais opérateur. Téléversez la capture du SMS de confirmation.",
    color: "#06b6d4",
  },
];

