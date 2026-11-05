import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Digitex",
  tagline: "Abonnements Digitaux & Licences Logicielles Premium",
  description: "Plateforme n°1 en Algérie pour vos abonnements ChatGPT Plus, Claude, Midjourney, Netflix, Spotify, Canva Pro et licences logicielles. Livraison instantanée 5-15 min, paiement 100% sécurisé BaridiMob & CCP.",
  whatsappNumber: "+213555123456",
  whatsappDisplay: "+213 (0) 555 12 34 56",
  telegramUsername: "digitex_dz",
  email: "contact@digitex.store",
  phone: "+213 (0) 555 12 34 56",
  location: "Alger, Algérie • Livraison Digitale Immédiate",
  workingHours: "7j/7 • 09:00 - 00:00 (Support 24/7 pour urgences)",
  baridimobRIP: "007 99999 0012345678 90",
  ccpAccount: "12345678 Clé 90",
  binancePayId: "987654321",
};

export const paymentMethodsList = [
  {
    id: "baridimob",
    name: "BaridiMob",
    description: "Virement instantané 24/7 sans frais",
    popular: true,
    badge: "Le plus rapide",
    iconName: "Smartphone",
  },
  {
    id: "ccp",
    name: "CCP / Poste Algérienne",
    description: "Versement au bureau de poste ou mandat",
    popular: false,
    badge: "Classique",
    iconName: "Building2",
  },
  {
    id: "binance",
    name: "Binance Pay / Crypto (USDT)",
    description: "Paiement international crypto sans frais",
    popular: false,
    badge: "USDT / Crypto",
    iconName: "Coins",
  },
  {
    id: "hand",
    name: "Paiement en Main Propre",
    description: "Disponible à Alger centre sur rendez-vous",
    popular: false,
    badge: "Alger",
    iconName: "Handshake",
  },
];

