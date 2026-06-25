import type { Config } from "tailwindcss";

/**
 * SEO Manager OS — enterprise design system.
 * Neutral-forward, typography-led, restrained. One confident accent, semantic
 * status colors, dense spacing. Built to sit next to Linear / Stripe / Vercel.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Single accent — a confident, slightly cool blue. Not a glow.
        accent: {
          50: "#eef4ff",
          100: "#dae6ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#588cff",
          500: "#2f66f5",
          600: "#1d4ed8",
          700: "#1b40b0",
          800: "#1c388c",
          900: "#1c326f",
        },
        primary: "#2f66f5",
        // App canvas + chrome. Sidebar is a hair off-white, surfaces are white.
        canvas: "#f7f8fa",
        sidebar: "#fbfbfc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Enterprise-dense scale — 13/14px workhorse text, not consumer-large.
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }], // 11
        xs: ["0.75rem", { lineHeight: "1.05rem" }], // 12
        sm: ["0.8125rem", { lineHeight: "1.25rem" }], // 13
        base: ["0.875rem", { lineHeight: "1.45rem" }], // 14
        md: ["0.9375rem", { lineHeight: "1.5rem" }], // 15
        lg: ["1.0625rem", { lineHeight: "1.6rem" }], // 17
        xl: ["1.25rem", { lineHeight: "1.7rem" }], // 20
        "2xl": ["1.5rem", { lineHeight: "1.9rem" }], // 24
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36
      },
      borderRadius: {
        // Tight, mechanical radii — no consumer pills.
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.75rem",
        "2xl": "0.875rem",
      },
      boxShadow: {
        // Subtle, layered — borders carry structure, shadows add the faintest lift.
        xs: "0 1px 2px rgba(16, 24, 40, 0.04)",
        sm: "0 1px 2px rgba(16, 24, 40, 0.05), 0 1px 3px rgba(16, 24, 40, 0.05)",
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 0 0 1px rgba(16, 24, 40, 0.02)",
        md: "0 2px 4px -1px rgba(16, 24, 40, 0.06), 0 4px 12px -2px rgba(16, 24, 40, 0.08)",
        lg: "0 12px 32px -8px rgba(16, 24, 40, 0.16), 0 4px 8px -4px rgba(16, 24, 40, 0.08)",
        pop: "0 16px 40px -12px rgba(16, 24, 40, 0.22)",
        // Back-compat aliases used by older, not-yet-restyled components.
        soft: "0 1px 2px rgba(16, 24, 40, 0.05), 0 1px 3px rgba(16, 24, 40, 0.05)",
        float: "0 2px 4px -1px rgba(16, 24, 40, 0.06), 0 4px 12px -2px rgba(16, 24, 40, 0.08)",
        lift: "0 12px 32px -8px rgba(16, 24, 40, 0.16), 0 4px 8px -4px rgba(16, 24, 40, 0.08)",
        premium: "0 24px 60px -20px rgba(16, 24, 40, 0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
