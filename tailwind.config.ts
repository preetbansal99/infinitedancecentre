import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base — warm charcoal instead of cold blue-black
        bg:           "#12100E",
        "bg-site":    "#1A1512",
        surface:      "#211E1A",
        "surface-el": "#2A2620",
        border:       "rgba(255,255,255,0.13)",
        // Text
        "text-primary":   "#F5F0EB",
        "text-secondary": "#9C9590",
        "text-muted":     "#6B6560",
        // Brand — warm gold/amber primary, magenta secondary
        "accent-gold":    "#D4A853",
        "accent-amber":   "#F0B429",
        "accent-warm":    "#E8C88A",
        "cta-magenta":    "#E11D48",
        "cta-glow":       "rgba(225,29,72,0.3)",
        // Legacy aliases (to avoid breaking all existing references)
        "accent-blue":    "#D4A853",
        "accent-purple":  "#D4A853",
        "accent-light":   "#E8C88A",
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
        sans:    ["'Satoshi'", "system-ui", "sans-serif"],
        display: ["'Clash Display'", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        // Fluid type scale with clamp()
        "display-xl": ["clamp(2.25rem, 5vw, 3rem)",   { lineHeight: "1.1",  fontWeight: "800" }],
        "display-lg": ["clamp(1.875rem, 4vw, 2.5rem)", { lineHeight: "1.15", fontWeight: "700" }],
        "display-md": ["clamp(1.5rem, 3.5vw, 2rem)",   { lineHeight: "1.2",  fontWeight: "700" }],
        heading:      ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.3",  fontWeight: "600" }],
        "heading-sm": ["clamp(1.1rem, 2vw, 1.25rem)",   { lineHeight: "1.35", fontWeight: "600" }],
        body:         ["1rem",    { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm":    ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption:      ["0.75rem",  { lineHeight: "1.4", fontWeight: "400" }],
        mono:         ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
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
        "neon-blue":   "0 0 8px #D4A853, 0 0 24px rgba(212,168,83,0.6), 0 0 48px rgba(212,168,83,0.3)",
        "neon-purple": "0 0 8px #D4A853, 0 0 24px rgba(212,168,83,0.6), 0 0 48px rgba(212,168,83,0.3)",
        "neon-combo":  "0 0 12px #D4A853, 0 0 30px rgba(212,168,83,0.7), 0 0 60px rgba(232,200,138,0.4)",
        "overdue-glow": "0 0 16px rgba(239,68,68,0.3)",
        "impact":       "0 0 40px rgba(225,29,72,0.8), 0 0 80px rgba(212,168,83,0.4)",
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
