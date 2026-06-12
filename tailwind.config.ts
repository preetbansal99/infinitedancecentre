import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base
        bg:           "#0A0A0F",
        "bg-site":    "#0D0D12",
        surface:      "#16161E",
        "surface-el": "#1E1E28",
        border:       "rgba(255,255,255,0.08)",
        // Text
        "text-primary":   "#F5F5F7",
        "text-secondary": "#8E8E93",
        "text-muted":     "#636366",
        // Brand
        "accent-blue":    "#3B82F6",
        "accent-purple":  "#8B5CF6",
        "accent-light":   "#C084FC",
        "cta-magenta":    "#E11D48",
        "cta-glow":       "rgba(225,29,72,0.3)",
        // Status
        success:  "#22C55E",
        warning:  "#F59E0B",
        error:    "#EF4444",
        // Admin overdue
        "overdue-bg":     "rgba(239,68,68,0.10)",
        "overdue-border": "rgba(239,68,68,0.30)",
        // WhatsApp
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["'Clash Display'", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["48px", { lineHeight: "1.1", fontWeight: "800" }],
        "display-lg": ["40px", { lineHeight: "1.15", fontWeight: "700" }],
        "display-md": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        heading:      ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-sm": ["20px", { lineHeight: "1.35", fontWeight: "600" }],
        body:         ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm":    ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        caption:      ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        mono:         ["13px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        xs:  "4px",
        sm:  "8px",
        md:  "16px",
        lg:  "24px",
        xl:  "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      borderRadius: {
        none:  "0",
        sm:    "8px",
        md:    "12px",
        lg:    "16px",
        xl:    "24px",
        "2xl": "32px",
        full:  "9999px",
      },
      boxShadow: {
        glass:    "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        magenta:  "0 0 20px rgba(225,29,72,0.35), 0 4px 12px rgba(225,29,72,0.2)",
        "magenta-lg": "0 0 40px rgba(225,29,72,0.5), 0 8px 24px rgba(225,29,72,0.3)",
        "neon-blue":   "0 0 8px #3B82F6, 0 0 24px rgba(59,130,246,0.6), 0 0 48px rgba(59,130,246,0.3)",
        "neon-purple": "0 0 8px #8B5CF6, 0 0 24px rgba(139,92,246,0.6), 0 0 48px rgba(139,92,246,0.3)",
        "neon-combo":  "0 0 12px #3B82F6, 0 0 30px rgba(139,92,246,0.7), 0 0 60px rgba(192,132,252,0.4)",
        "overdue-glow": "0 0 16px rgba(239,68,68,0.3)",
        "impact":       "0 0 40px rgba(225,29,72,0.8), 0 0 80px rgba(139,92,246,0.4)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      zIndex: {
        below:   "-1",
        base:    "0",
        content: "10",
        overlay: "20",
        drawer:  "30",
        modal:   "40",
        fab:     "50",
        toast:   "60",
        pin:     "70",
        "progress-bar": "80",
        hero:    "0",
      },
      animation: {
        "neon-pulse":    "neonPulse 3s ease-in-out infinite",
        "overdue-pulse": "overduePulse 2s ease-in-out infinite",
        "shimmer":       "shimmer 1.5s linear infinite",
        "float":         "float 6s ease-in-out infinite",
        "bounce-soft":   "bounceSoft 1.5s ease-in-out infinite",
        "spin-slow":     "spin 8s linear infinite",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": { opacity: "0.80", filter: "brightness(1.0)" },
          "50%":      { opacity: "1.00", filter: "brightness(1.3)" },
        },

        overduePulse: {
          "0%, 100%": { opacity: "0.70" },
          "50%":      { opacity: "1.00" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
