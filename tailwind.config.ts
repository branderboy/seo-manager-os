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
        // Search Intelligence OS accent (Stripe "blurple").
        accent: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c7ccff",
          300: "#a5abff",
          400: "#827dff",
          500: "#635bff",
          600: "#5a4af2",
          700: "#4c3bd4",
          800: "#3f33ab",
          900: "#363188",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
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
