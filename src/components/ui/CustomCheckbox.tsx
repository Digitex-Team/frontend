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
        "inline-flex items-start gap-3 cursor-pointer select-none group transition-all duration-200",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <div className="relative pt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={cn(
            "w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#00BFFF] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#05070C]",
            checked
              ? "bg-gradient-to-br from-[#075BDB] via-[#0099FF] to-[#00BFFF] border-[#00BFFF] shadow-[0_0_14px_rgba(0,191,255,0.55)] scale-100"
              : "bg-[#0A101D] border-white/20 group-hover:border-[#00BFFF]/50 group-hover:bg-[#0E1726] shadow-sm"
          )}
        >
          <Check
            className={cn(
              "w-3.5 h-3.5 stroke-[3] text-white transition-all duration-200",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
          />
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col leading-tight">
          {label && (
            <span
              className={cn(
                "text-xs font-semibold tracking-tight transition-colors duration-150",
                checked
                  ? "text-white font-bold"
                  : "text-silver/85 group-hover:text-white"
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-silver/50 mt-0.5 leading-snug">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
