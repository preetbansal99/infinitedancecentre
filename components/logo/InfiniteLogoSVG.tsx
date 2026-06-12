"use client";
import { cn } from "@/lib/cn";

type LogoSize = "sm" | "md" | "lg" | "hero" | "header";

const SIZE_MAP: Record<LogoSize, { width: number; height: number; wordmarkSize: number }> = {
  header: { width: 120, height:  52, wordmarkSize: 9  },
  sm:     { width: 160, height:  72, wordmarkSize: 11 },
  md:     { width: 240, height: 108, wordmarkSize: 14 },
  lg:     { width: 340, height: 152, wordmarkSize: 18 },
  hero:   { width: 480, height: 216, wordmarkSize: 24 },
};

interface InfiniteLogoSVGProps {
  size?: LogoSize;
  className?: string;
  showWordmark?: boolean;
  width?: number;
}

export function InfiniteLogoSVG({
  size = "md",
  className = "",
  showWordmark = true,
  width,
}: InfiniteLogoSVGProps) {
  const dims = SIZE_MAP[size];
  const w = width ?? dims.width;
  const h = showWordmark ? dims.height + dims.wordmarkSize * 5 : dims.height;

  return (
    <svg
      viewBox={`0 0 480 ${showWordmark ? 280 : 200}`}
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      role="img"
      aria-label="Infinite Dance Centre — logo"
    >
      <defs>
        <linearGradient id="leftLobeGrad" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%"   stopColor="#60A5FA" stopOpacity="1" />
          <stop offset="40%"  stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="rightLobeGrad" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%"   stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="60%"  stopColor="#A855F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="dancerLogoGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#DBEAFE" />
          <stop offset="50%"  stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="12" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dancerGlowLogo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* LEFT LOBE — blue */}
      <path
        d="M 240 115 C 232 94, 212 72, 186 66 C 160 60, 128 66, 110 86 C 92 106, 92 136, 110 150 C 128 164, 162 166, 188 158 C 214 150, 232 136, 240 115 Z"
        fill="url(#leftLobeGrad)"
        filter="url(#neonGlow)"
        opacity="0.95"
      />
      <path
        d="M 240 115 C 235 104, 222 90, 206 86 C 186 82, 162 88, 148 104 C 134 118, 136 138, 150 148 C 164 158, 188 158, 206 148 C 224 138, 236 128, 240 115 Z"
        fill="#0D0D18"
        opacity="0.7"
      />

      {/* RIGHT LOBE — purple-magenta */}
      <path
        d="M 240 115 C 248 94, 268 72, 294 66 C 320 60, 352 66, 370 86 C 388 106, 388 136, 370 150 C 352 164, 318 166, 292 158 C 266 150, 248 136, 240 115 Z"
        fill="url(#rightLobeGrad)"
        filter="url(#neonGlow)"
        opacity="0.95"
      />
      <path
        d="M 240 115 C 245 104, 258 90, 274 86 C 294 82, 318 88, 332 104 C 346 118, 344 138, 330 148 C 316 158, 292 158, 274 148 C 256 138, 244 128, 240 115 Z"
        fill="#0D0D18"
        opacity="0.7"
      />

      {/* DANCER SILHOUETTE */}
      <g fill="url(#dancerLogoGrad)" filter="url(#dancerGlowLogo)">
        <ellipse cx="262" cy="48" rx="12" ry="13" />
        <path d="M 268 40 Q 290 30 295 42 Q 284 37 274 40 Z" opacity="0.9" />
        <rect x="258" y="60" width="8" height="10" rx="4" />
        <path d="M 244 68 Q 256 64 270 68 Q 274 82 268 94 Q 260 96 250 94 Q 240 82 244 68 Z" />
        <path d="M 270 72 Q 300 54 330 34 Q 326 36 318 44 Q 298 62 268 82 Z" strokeWidth="0" />
        <ellipse cx="334" cy="31" rx="5" ry="4" />
        <path d="M 246 74 Q 226 70 208 76 Q 212 74 218 75 Q 232 75 246 80 Z" />
        <path d="M 246 94 Q 256 92 268 94 Q 270 102 266 108 Q 258 110 250 108 Q 242 102 246 94 Z" />
        <path d="M 264 108 Q 276 120 278 136 Q 272 138 268 134 Q 262 120 258 110 Z" />
        <path d="M 278 136 Q 282 152 278 164 Q 274 166 270 162 Q 268 150 266 136 Z" />
        <path d="M 278 164 Q 286 174 282 178 Q 276 176 272 168 Z" />
        <path d="M 250 108 Q 232 116 214 126 Q 198 134 184 148 Q 190 152 196 146 Q 214 134 234 122 Q 248 114 256 110 Z" />
        <path d="M 184 148 Q 172 158 168 164 Q 176 162 184 152 Z" />
      </g>

      {/* WORDMARK */}
      {showWordmark && (
        <>
          <text
            x="240"
            y="208"
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight="800"
            fontSize="52"
            letterSpacing="10"
            fill="#F5F5F7"
            filter="url(#shadow)"
          >
            INFINITE
          </text>
          <text
            x="240"
            y="240"
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight="500"
            fontSize="20"
            letterSpacing="8"
            fill="#A78BFA"
          >
            — DANCE CENTRE —
          </text>
        </>
      )}
    </svg>
  );
}
