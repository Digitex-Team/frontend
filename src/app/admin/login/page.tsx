"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("digitex_admin_token")) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(username, password);
      if (res && (res.success || res.token)) {
        router.push("/admin/dashboard");
      } else {
        setError("Identifiants administrateur invalides");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Impossible de se connecter. Vérifiez vos identifiants ou le statut du serveur.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="glow-orb-blue w-[500px] h-[500px] -top-24 -left-24 opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[400px] h-[400px] -bottom-20 -right-20 opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-elevated p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Logo Badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#075BDB] to-[#00BFFF] flex items-center justify-center font-black text-xl text-white shadow-[0_0_25px_rgba(0,191,255,0.4)] mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Digitex Admin Engine
            </h1>
            <p className="text-xs text-silver/60 mt-1">
              Accès réservé aux administrateurs de la plateforme
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver/80 mb-2">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-silver/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Identifiant administrateur"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#00BFFF] focus:ring-1 focus:ring-[#00BFFF] text-white text-sm outline-none transition placeholder:text-silver/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver/80 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-silver/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#00BFFF] focus:ring-1 focus:ring-[#00BFFF] text-white text-sm outline-none transition placeholder:text-silver/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#075BDB] to-[#00BFFF] hover:from-[#064ec0] hover:to-[#00a6dd] transition-all shadow-[0_0_25px_rgba(0,191,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-[11px] text-silver/40">
              Digitex Secure Auth &bull; Supabase PostgreSQL
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

