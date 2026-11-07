"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CustomCheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-start gap-2.5 cursor-pointer select-none group transition-opacity",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={cn(
            "w-5 h-5 rounded-lg border transition-all duration-200 flex items-center justify-center shrink-0",
            checked
              ? "bg-gradient-to-br from-[#075BDB] to-[#00BFFF] border-[#00BFFF] shadow-[0_0_12px_rgba(0,191,255,0.45)] text-white"
              : "bg-[#0E1726] border-white/20 group-hover:border-white/40 text-transparent"
          )}
        >
          <Check
            className={cn(
              "w-3.5 h-3.5 stroke-[2.5] transition-transform duration-150",
              checked ? "scale-100 text-white" : "scale-0"
            )}
          />
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-white/90 group-hover:text-white transition">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-silver/50 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}

