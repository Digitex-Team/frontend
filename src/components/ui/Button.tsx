"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan" | "whatsapp";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconRight,
  className,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base font-bold rounded-xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-electric hover:bg-electric-hover text-white shadow-[0_0_20px_rgba(7,91,219,0.35)] hover:shadow-[0_0_28px_rgba(7,91,219,0.55)] border border-blue-400/20 active:scale-[0.98]",
    secondary:
      "bg-navy hover:bg-navy-light text-white border border-navy-border hover:border-cyan/40 shadow-sm active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-navy/60 text-silver hover:text-white border border-navy-border hover:border-cyan/50 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-white/5 text-silver hover:text-white",
    cyan:
      "bg-cyan text-midnight font-bold hover:bg-cyan/90 shadow-[0_0_20px_rgba(0,191,255,0.4)] active:scale-[0.98]",
    whatsapp:
      "bg-[#25D366] hover:bg-[#20ba59] text-white font-bold shadow-[0_0_20px_rgba(37,211,102,0.3)] active:scale-[0.98]",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
    </motion.button>
  );
}

