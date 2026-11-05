"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "electric" | "none";
  interactive?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "cyan",
  interactive = true,
  ...props
}: GlowCardProps) {
  const glowStyles = {
    cyan: "hover:border-cyan/40 hover:shadow-[0_0_30px_-5px_rgba(0,191,255,0.25)]",
    electric: "hover:border-electric/50 hover:shadow-[0_0_30px_-5px_rgba(7,91,219,0.3)]",
    none: "",
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-2xl bg-[#101B2C] border border-[#1F2E45] p-6 transition-all duration-300",
        interactive && glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

