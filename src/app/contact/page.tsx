"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Demande d'information",
    message: "",
  });

  const subjectOptions: SelectOption[] = [
    { value: "Demande d'information", label: "Demande d'information générale" },
    { value: "Question sur un abonnement IA", label: "Question sur un abonnement IA (ChatGPT / Claude)" },
    { value: "Suivi de commande", label: "Suivi ou activation d'une commande" },
    { value: "Partenariat ou commande en gros", label: "Commande en gros / Agence / Entreprise" },
    { value: "Autre", label: "Autre demande" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Bonjour Digitex,\n\nNom: ${formData.name || "Client"}\nTéléphone: ${formData.phone || "Non spécifié"}\nSujet: ${formData.subject}\nMessage: ${formData.message || "Demande d'assistance"}`
  )}`;

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <Badge variant="cyan" size="md" icon={<Sparkles className="h-3.5 w-3.5" />}>
          Support Client 7j/7
        </Badge>
        <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contactez l&apos;Équipe Digitex
        </h1>
        <p className="mt-3 text-sm sm:text-base text-silver/70">
          Une question sur un compte, une commande en cours ou un devis spécial agence ? Nous sommes à votre écoute avec une réponse sous 5 à 15 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct channels & Payment references (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick WhatsApp Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0E1726] to-[#101B2C] border border-[#25D366]/30 p-6 shadow-[0_0_25px_rgba(37,211,102,0.15)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="h-6 w-6 fill-current" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block">
                  Canal Prioritaire
                </span>
                <h3 className="text-lg font-bold text-white">WhatsApp Express</h3>
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-silver/70">
              Le moyen le plus rapide pour obtenir une réponse ou valider votre commande BaridiMob en direct.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Bonjour Digitex, je souhaite échanger avec un conseiller."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 font-bold text-xs shadow-md transition"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              <span>Ouvrir WhatsApp ({siteConfig.whatsappDisplay})</span>
            </a>
          </div>

          {/* Contact Details List */}
          <div className="rounded-2xl bg-[#0E1726] border border-[#1F2E45] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              Coordonnées Officielles
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Send className="h-4 w-4 text-cyan shrink-0 mt-1" />
                <div>
                  <span className="text-silver/50 block text-xs">Telegram</span>
                  <a
                    href={`https://t.me/${siteConfig.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white hover:text-cyan transition"
                  >
                    @{siteConfig.telegramUsername}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-cyan shrink-0 mt-1" />
                <div>
                  <span className="text-silver/50 block text-xs">Email</span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-bold text-white hover:text-cyan transition"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-cyan shrink-0 mt-1" />
                <div>
                  <span className="text-silver/50 block text-xs">Téléphone</span>
                  <span className="font-bold text-white">{siteConfig.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-cyan shrink-0 mt-1" />
                <div>
                  <span className="text-silver/50 block text-xs">Disponibilité</span>
                  <span className="text-silver/80">{siteConfig.workingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-cyan shrink-0 mt-1" />
                <div>
                  <span className="text-silver/50 block text-xs">Localisation</span>
                  <span className="text-silver/80">{siteConfig.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BaridiMob RIP Card */}
          <div className="rounded-2xl bg-[#0E1726] border border-[#1F2E45] p-6">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-cyan">
              <Smartphone className="h-4 w-4" />
              <span>Paiement BaridiMob Officiel</span>
            </div>
            <p className="text-xs text-silver/60 mb-3">
              Effectuez vos règlements vers notre compte certifié :
            </p>
            <div className="rounded-xl bg-black/40 border border-white/10 p-3 font-mono text-xs sm:text-sm font-bold text-cyan select-all">
              {siteConfig.baridimobRIP}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Vérifié par la Poste d&apos;Algérie</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Consultation Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#0E1726] border border-[#1F2E45] p-8 sm:p-10 shadow-xl">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Envoyez-nous un message
            </h2>
            <p className="text-xs sm:text-sm text-silver/70 mb-8">
              Remplissez ce formulaire et notre conseiller vous recontactera immédiatement par WhatsApp ou Email.
            </p>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-silver/80 mb-1.5">
                      Votre Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Karim Hadj"
                      className="w-full rounded-xl bg-navy border border-navy-border px-4 py-2.5 text-sm text-white placeholder-silver/40 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-silver/80 mb-1.5">
                      Numéro WhatsApp / Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: 0661 23 45 67"
                      className="w-full rounded-xl bg-navy border border-navy-border px-4 py-2.5 text-sm text-white placeholder-silver/40 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver/80 mb-1.5">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: karim.hadj@gmail.com"
                    className="w-full rounded-xl bg-navy border border-navy-border px-4 py-2.5 text-sm text-white placeholder-silver/40 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver/80 mb-1.5">
                    Sujet de votre demande
                  </label>
                  <CustomSelect
                    options={subjectOptions}
                    value={formData.subject}
                    onChange={(val) => setFormData({ ...formData, subject: val })}
                    className="w-full"
                    triggerClassName="w-full py-2.5 px-4 text-sm"
                    dropdownClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver/80 mb-1.5">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez votre message ici..."
                    className="w-full rounded-xl bg-navy border border-navy-border p-4 text-sm text-white placeholder-silver/40 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    Envoyer le message
                  </Button>

                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-5 font-bold text-xs shadow-md transition"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    <span>Envoyer directement par WhatsApp</span>
                  </a>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Message envoyé avec succès !
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-silver/70 max-w-sm mx-auto">
                  Merci {formData.name || "cher client"}, notre équipe d&apos;assistance vous répondra très rapidement sur WhatsApp ({formData.phone}).
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        subject: "Demande d'information",
                        message: "",
                      });
                    }}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

