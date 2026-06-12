import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type LogoSize = "sm" | "md" | "lg" | "hero" | "header";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  withContainer?: boolean;
  href?: string;
  /** Pass custom width if you need to override the predefined sizes */
  width?: number;
  /** Pass custom height if you need to override the predefined sizes */
  height?: number;
  /** Which logo to show */
  variant?: "icon" | "full";
}

const SIZE_MAP: Record<LogoSize, { width: number; height: number }> = {
  header: { width: 120, height: 60 },  // 3:2 icon
  sm: { width: 180, height: 120 }, // 3:2 icon
  md: { width: 240, height: 160 }, // 3:2 icon
  lg: { width: 350, height: 350 }, // 1:1 full logo
  hero: { width: 400, height: 550 }, // 1:1 full logo
};

export function Logo({
  size = "md",
  className,
  withContainer = false,
  href,
  width: customWidth,
  height: customHeight,
  variant,
}: LogoProps) {
  const defaultDims = SIZE_MAP[size];
  const width = customWidth ?? defaultDims.width;
  const height = customHeight ?? defaultDims.height;

  // Default to full logo for larger sizes, icon for smaller sizes
  const resolvedVariant = variant ?? (size === "hero" || size === "lg" ? "full" : "icon");
  const imgSrc = resolvedVariant === "full" ? "/logo-full-v3.png" : "/logo-icon-v3.png";

  const content = (
    <div
      className={cn(
        "relative flex items-center justify-center transition-all duration-500",
        // Claymorphic container styling (optional)
        withContainer && [
          "p-5 rounded-3xl bg-[#14141A]", // Dark enough to protect contrast for neon
          "shadow-[inset_0_2px_4px_rgba(255,255,255,0.06),inset_0_-4px_8px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.5)]",
          "border border-white/[0.03]"
        ],
        !href && "pointer-events-none select-none",
        className
      )}
      style={{ width, height }}
    >
      {/* 
        High-Fidelity Raster Logo 
        Using Next.js Image for optimal webp delivery.
      */}
      <Image
        src={imgSrc}
        alt="Infinite Dance Centre Logo"
        width={width}
        height={height}
        className={cn(
          "relative z-10 object-contain w-full h-full",
          !href && "pointer-events-none select-none"
        )}
        draggable={false}
        priority={size === "hero" || size === "header"}
        quality={100}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded-3xl">
        <div className="group-hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
          {content}
        </div>
      </Link>
    );
  }

  return content;
}
