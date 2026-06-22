import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing WP Prospector brand (kept so the legacy app still styles).
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec1ff",
          400: "#599fff",
          500: "#337bff",
          600: "#1b5af5",
          700: "#1546e1",
          800: "#173bb6",
          900: "#19378f",
          950: "#101f4d",
        },
        // App accent — aligned to the landing page blue.
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
        },
        // Your design tokens — global, inherited by every page.
        primary: "#1DA1F2",
        sidebar: "#2F3E4D",
        panel: "#F8FAFC",
        greenbar: "#51B34E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Bumped up from Tailwind defaults — readable for humans, not tiny.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.15rem" }], // 13px (was 12)
        sm: ["0.9375rem", { lineHeight: "1.45rem" }], // 15px (was 14)
        base: ["1.0625rem", { lineHeight: "1.65rem" }], // 17px (was 16)
        lg: ["1.1875rem", { lineHeight: "1.8rem" }], // 19px (was 18)
        xl: ["1.3125rem", { lineHeight: "1.85rem" }], // 21px (was 20)
        "2xl": ["1.625rem", { lineHeight: "2.1rem" }], // 26px (was 24)
        "3xl": ["2rem", { lineHeight: "2.4rem" }], // 32px (was 30)
        "4xl": ["2.5rem", { lineHeight: "2.85rem" }], // 40px (was 36)
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        float: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(16,24,40,0.06), 0 8px 24px -12px rgba(16,24,40,0.12)",
        lift: "0 12px 40px -16px rgba(16,24,40,0.24)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
