import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "electric" | "silver" | "success" | "warning" | "outline";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "cyan",
  size = "md",
  className,
  icon,
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1 font-medium",
    md: "px-3 py-1 text-xs gap-1.5 font-semibold",
  };

  const variantClasses = {
    cyan: "bg-cyan/10 text-cyan border border-cyan/30 shadow-[0_0_12px_rgba(0,191,255,0.15)]",
    electric: "bg-electric/15 text-blue-300 border border-electric/40 shadow-[0_0_12px_rgba(7,91,219,0.2)]",
    silver: "bg-navy-light/60 text-silver border border-navy-border",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
    warning: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    outline: "bg-transparent text-silver border border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

