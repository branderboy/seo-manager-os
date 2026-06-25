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
        // Single accent — a confident emerald green. The brand signal.
        accent: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#16b364",
          600: "#099250",
          700: "#087443",
          800: "#095c37",
          900: "#084c2e",
        },
        primary: "#16b364",
        // App canvas + chrome. Sidebar is a hair off-white, surfaces are white.
        canvas: "#f7f8fa",
        sidebar: "#fbfbfc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Readable scale — comfortable 16px workhorse text, legible labels.
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.05rem", letterSpacing: "0.01em" }], // 12
        xs: ["0.8125rem", { lineHeight: "1.15rem" }], // 13
        sm: ["0.9375rem", { lineHeight: "1.4rem" }], // 15
        base: ["1rem", { lineHeight: "1.6rem" }], // 16
        md: ["1.0625rem", { lineHeight: "1.65rem" }], // 17
        lg: ["1.1875rem", { lineHeight: "1.75rem" }], // 19
        xl: ["1.375rem", { lineHeight: "1.85rem" }], // 22
        "2xl": ["1.625rem", { lineHeight: "2.05rem" }], // 26
        "3xl": ["2rem", { lineHeight: "2.4rem" }], // 32
        "4xl": ["2.5rem", { lineHeight: "2.75rem" }], // 40
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
