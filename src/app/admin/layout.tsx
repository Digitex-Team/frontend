"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { adminGetProfile, adminLogout } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    adminGetProfile()
      .then((data) => {
        if (data && data.admin) {
          setAdminUser(data.admin);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      router.replace("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !adminUser) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-silver/60 uppercase tracking-widest font-semibold">
            Vérification de session Digitex Admin...
          </span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { href: "/admin/products", label: "Gestion Produits & Tiers", icon: Package },
    { href: "/admin/orders", label: "Commandes Clients", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#05070C] text-white flex flex-col md:flex-row relative">
      {/* Ambient background glows */}
      <div
        className="glow-orb-blue w-[600px] h-[600px] -top-40 -left-40 opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb-cyan w-[500px] h-[500px] top-[40%] -right-40 opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Mobile Top Header */}
      <header className="md:hidden glass-elevated border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-[#05070C]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#075BDB] to-[#00BFFF] flex items-center justify-center font-black text-xs text-white shadow-[0_0_12px_rgba(0,191,255,0.4)]">
            D
          </div>
          <span className="font-bold text-sm tracking-tight">Digitex Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-silver hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 border-r border-white/10 bg-[#0E1726]/80 backdrop-blur-2xl p-5 shrink-0 z-30 fixed md:sticky top-0 h-auto md:h-screen`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075BDB] to-[#00BFFF] flex items-center justify-center font-black text-sm text-white shadow-[0_0_20px_rgba(0,191,255,0.4)]">
            DX
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>Digitex</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-silver/50 font-medium">Administration Engine</p>
          </div>
        </div>

        {/* User Card */}
        {adminUser && (
          <div className="my-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#075BDB]/30 border border-[#00BFFF]/40 flex items-center justify-center text-xs font-bold text-[#00BFFF]">
              <Shield className="w-4 h-4 text-[#00BFFF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">@{adminUser.username}</p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Session Active
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 my-2">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href === "/admin/dashboard" && pathname === "/admin");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#075BDB] text-white shadow-[0_0_20px_rgba(7,91,219,0.4)] border border-[#00BFFF]/40"
                    : "text-silver/70 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#00BFFF]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-silver/70 hover:text-white hover:bg-white/5 border border-white/5 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-cyan" />
              <span>Voir la boutique</span>
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-silver">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}

