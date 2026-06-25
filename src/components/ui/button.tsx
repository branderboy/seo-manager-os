import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Raised, pressable controls — a hard darker bottom edge makes each button read
// as a physical key that presses down on click (ClickFunnels-style depth), kept
// restrained enough for enterprise. Top highlight + ambient shadow add gloss.
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        // Primary = confident blue key with a deep bottom edge + blue ambient glow.
        primary:
          "bg-gradient-to-b from-accent-500 to-accent-600 text-white shadow-[0_3px_0_0_#1b3a9e,0_5px_10px_-3px_rgba(29,78,216,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-accent-400 hover:to-accent-500 hover:shadow-[0_3px_0_0_#1b3a9e,0_8px_16px_-4px_rgba(29,78,216,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-[3px] active:shadow-[0_0_0_0_#1b3a9e,inset_0_1px_0_rgba(255,255,255,0.2)]",
        accent:
          "bg-gradient-to-b from-accent-400 to-accent-500 text-white shadow-[0_3px_0_0_#1d4ed8,0_5px_10px_-3px_rgba(47,102,245,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-accent-300 hover:to-accent-400 hover:shadow-[0_3px_0_0_#1d4ed8,0_8px_16px_-4px_rgba(47,102,245,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-[3px] active:shadow-[0_0_0_0_#1d4ed8,inset_0_1px_0_rgba(255,255,255,0.25)]",
        // Secondary = raised white key with a gray bottom edge.
        secondary:
          "border border-[var(--border-strong)] bg-gradient-to-b from-white to-[#f1f3f7] text-[var(--ink-soft)] shadow-[0_2px_0_0_#dadde4,0_3px_6px_-2px_rgba(16,24,40,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] hover:text-[var(--foreground)] hover:shadow-[0_2px_0_0_#dadde4,0_6px_12px_-3px_rgba(16,24,40,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-[2px] active:shadow-[0_0_0_0_#dadde4,inset_0_1px_0_rgba(255,255,255,0.9)]",
        ghost:
          "text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        danger:
          "bg-gradient-to-b from-[#e05b51] to-[var(--danger)] text-white shadow-[0_3px_0_0_#a8362e,0_5px_10px_-3px_rgba(212,73,63,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_0_0_0_#a8362e,inset_0_1px_0_rgba(255,255,255,0.2)]",
        // Back-compat alias — matches primary.
        dark:
          "bg-gradient-to-b from-accent-500 to-accent-600 text-white shadow-[0_3px_0_0_#1b3a9e,0_5px_10px_-3px_rgba(29,78,216,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-accent-400 hover:to-accent-500 active:translate-y-[3px] active:shadow-[0_0_0_0_#1b3a9e]",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-11 px-5 text-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type CommonProps = VariantProps<typeof buttonVariants> & { className?: string };

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
