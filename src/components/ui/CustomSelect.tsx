"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "ghost" | "hero" | "form";
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  icon?: React.ReactNode;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  variant = "default",
  className,
  triggerClassName,
  dropdownClassName,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const variantTriggerStyles = {
    default:
      "glass-base border-white/10 hover:border-[#00BFFF]/50 text-white rounded-xl px-3.5 py-2.5 shadow-sm hover:shadow-[0_0_15px_rgba(0,191,255,0.15)]",
    ghost:
      "bg-transparent border-transparent hover:bg-white/5 text-silver hover:text-white rounded-lg px-3 py-2",
    hero:
      "glass-base md:bg-transparent border border-white/10 md:border-none rounded-xl md:rounded-none px-3.5 py-2 text-silver hover:text-white hover:bg-white/5 md:hover:bg-transparent",
    form:
      "w-full bg-[#0A101D] border-white/15 hover:border-[#00BFFF]/50 text-white rounded-xl px-3.5 py-2.5 text-xs shadow-inner",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left select-none", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer border outline-none",
          "focus-visible:border-[#00BFFF] focus-visible:ring-1 focus-visible:ring-[#00BFFF] focus-visible:shadow-[0_0_15px_rgba(0,191,255,0.25)]",
          variantTriggerStyles[variant],
          isOpen && "border-[#00BFFF] shadow-[0_0_18px_rgba(0,191,255,0.25)] bg-[#0C1527]",
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#00BFFF] shrink-0">{icon}</span>}
          {selectedOption?.icon && (
            <span className="text-[#00BFFF] shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-silver/60 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-[#00BFFF]"
          )}
        />
      </button>

      {/* Modern Glassmorphic Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[60] mt-1.5 min-w-[200px] w-full max-h-64 overflow-y-auto rounded-2xl bg-[#090E1A]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-[0_15px_50px_rgba(5,7,12,0.9),0_0_25px_rgba(0,191,255,0.15)] focus:outline-none",
              dropdownClassName
            )}
            role="listbox"
          >
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 text-left cursor-pointer",
                      isSelected
                        ? "bg-gradient-to-r from-[#075BDB]/40 to-[#00BFFF]/20 text-white font-bold border border-[#00BFFF]/40 shadow-[0_0_12px_rgba(0,191,255,0.2)]"
                        : "text-silver/80 hover:bg-white/5 hover:text-white"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0",
                            isSelected ? "text-[#00BFFF]" : "text-silver/50"
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {option.badge && (
                        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-silver/60">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[#00BFFF] shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
