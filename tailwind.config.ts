import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map the design tokens (globals.css) into Tailwind so utilities stay in sync.
        canvas: "var(--canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          inv: "var(--ink-inv)",
        },
        line: {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
          strong: "var(--line-strong)",
        },
        // Single signal accent + functional status.
        signal: {
          DEFAULT: "var(--signal)",
          hover: "var(--signal-hover)",
          press: "var(--signal-press)",
          weak: "var(--signal-weak)",
          line: "var(--signal-line)",
          ink: "var(--signal-ink)",
          // ramp kept for charts / legacy `accent-*` parity
          50: "#efeefc",
          100: "#e2e0fa",
          200: "#cbc8f5",
          300: "#aaa5ee",
          400: "#827ce6",
          500: "#5b56e0",
          600: "#4d48d4",
          700: "#413dbd",
          800: "#37339c",
          900: "#2f2c7d",
        },
        // Back-compat: existing components reference `accent-*`. Alias to signal ramp.
        accent: {
          50: "#efeefc",
          100: "#e2e0fa",
          200: "#cbc8f5",
          300: "#aaa5ee",
          400: "#827ce6",
          500: "#5b56e0",
          600: "#4d48d4",
          700: "#413dbd",
          800: "#37339c",
          900: "#2f2c7d",
        },
        ok: { DEFAULT: "var(--ok)", weak: "var(--ok-weak)" },
        warn: { DEFAULT: "var(--warn)", weak: "var(--warn-weak)" },
        danger: { DEFAULT: "var(--danger)", weak: "var(--danger-weak)" },
        primary: "var(--signal)",
        panel: "var(--canvas)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Refined SaaS scale — readable through contrast, not bulk. 15px base.
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }], // 11
        xs: ["0.75rem", { lineHeight: "1.1rem" }],                              // 12
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],                           // 13
        base: ["0.9375rem", { lineHeight: "1.5rem" }],                          // 15
        md: ["1rem", { lineHeight: "1.55rem" }],                                // 16
        lg: ["1.0625rem", { lineHeight: "1.6rem" }],                            // 17
        xl: ["1.25rem", { lineHeight: "1.7rem", letterSpacing: "-0.01em" }],    // 20
        "2xl": ["1.5rem", { lineHeight: "1.9rem", letterSpacing: "-0.018em" }], // 24
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.022em" }], // 30
        "4xl": ["2.375rem", { lineHeight: "2.6rem", letterSpacing: "-0.028em" }],  // 38
      },
      borderRadius: {
        lg: "0.625rem",   // 10
        xl: "0.75rem",    // 12 — default card
        "2xl": "1rem",    // 16 — large surfaces
        "3xl": "1.25rem", // 20
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        soft: "var(--shadow-sm)",
        pop: "var(--shadow-pop)",
        card: "var(--shadow-sm)",
        lift: "var(--shadow-pop)",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.16, 1, 0.3, 1)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
