import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  radius?: "sm" | "md" | "lg" | "xl";
  strength?: "default" | "strong";
  highlight?: boolean;
  danger?: boolean;
}

export function GlassCard({
  className,
  radius = "lg",
  strength = "default",
  highlight = false,
  danger = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        strength === "default" ? "glass" : "glass-strong",
        {
          "rounded-sm": radius === "sm",
          "rounded-md": radius === "md",
          "rounded-lg": radius === "lg",
          "rounded-xl": radius === "xl",
        },
        highlight && "border-cta-magenta/40 shadow-magenta",
        danger && "bg-overdue-bg border-overdue-border shadow-overdue-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
