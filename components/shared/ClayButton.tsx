"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "whatsapp" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES = {
  primary:   "bg-cta-magenta text-white shadow-magenta hover:shadow-magenta-lg border-transparent",
  ghost:     "bg-transparent text-text-primary border border-white/20 hover:border-white/50",
  outline:   "bg-surface-el text-text-primary border border-white/10 hover:border-white/20",
  whatsapp:  "bg-whatsapp text-white border-transparent",
  danger:    "bg-error/90 text-white border-transparent",
};

const SIZE_STYLES = {
  sm:  "px-4 py-2 text-caption rounded-md min-h-[36px]",
  md:  "px-5 py-3 text-body-sm rounded-lg min-h-[44px]",
  lg:  "px-8 py-4 text-body rounded-lg min-h-[52px]",
};

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "clay relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors duration-150 select-none touch-target",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {children}
      </motion.button>
    );
  }
);
ClayButton.displayName = "ClayButton";
