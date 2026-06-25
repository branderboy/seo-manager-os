import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Big, bold, pressable keys — tall darker bottom edge, uppercase labels, strong
// ambient glow. Each button looks physically raised and slams down on click
// (aggressive ClickFunnels depth). Ghost stays quiet for tertiary actions.
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.04em] whitespace-nowrap transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        // Primary = confident blue key, deep 5px edge + big blue glow.
        primary:
          "bg-gradient-to-b from-accent-400 to-accent-600 text-white shadow-[0_5px_0_0_#17317f,0_9px_18px_-4px_rgba(29,78,216,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-accent-300 hover:to-accent-500 hover:shadow-[0_5px_0_0_#17317f,0_14px_26px_-6px_rgba(29,78,216,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[5px] active:shadow-[0_0_0_0_#17317f,inset_0_2px_4px_rgba(0,0,0,0.18)]",
        accent:
          "bg-gradient-to-b from-accent-300 to-accent-500 text-white shadow-[0_5px_0_0_#1b40b0,0_9px_18px_-4px_rgba(47,102,245,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-accent-200 hover:to-accent-400 hover:shadow-[0_5px_0_0_#1b40b0,0_14px_26px_-6px_rgba(47,102,245,0.65),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-[5px] active:shadow-[0_0_0_0_#1b40b0,inset_0_2px_4px_rgba(0,0,0,0.16)]",
        // Secondary = raised white key with a 4px gray edge.
        secondary:
          "border border-[var(--border-strong)] bg-gradient-to-b from-white to-[#eceff4] text-[var(--ink-soft)] shadow-[0_4px_0_0_#d2d6df,0_6px_12px_-3px_rgba(16,24,40,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] hover:text-[var(--foreground)] hover:shadow-[0_4px_0_0_#d2d6df,0_10px_18px_-4px_rgba(16,24,40,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-[4px] active:shadow-[0_0_0_0_#d2d6df,inset_0_2px_4px_rgba(16,24,40,0.08)]",
        ghost:
          "font-semibold normal-case tracking-normal text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        danger:
          "bg-gradient-to-b from-[#e8675d] to-[var(--danger)] text-white shadow-[0_5px_0_0_#992f27,0_9px_18px_-4px_rgba(212,73,63,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105 hover:shadow-[0_5px_0_0_#992f27,0_14px_26px_-6px_rgba(212,73,63,0.65)] active:translate-y-[5px] active:shadow-[0_0_0_0_#992f27,inset_0_2px_4px_rgba(0,0,0,0.18)]",
        // Back-compat alias — matches primary.
        dark:
          "bg-gradient-to-b from-accent-400 to-accent-600 text-white shadow-[0_5px_0_0_#17317f,0_9px_18px_-4px_rgba(29,78,216,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-accent-300 hover:to-accent-500 active:translate-y-[5px] active:shadow-[0_0_0_0_#17317f]",
      },
      size: {
        xs: "h-8 px-3 text-2xs",
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-[3.25rem] px-7 text-base",
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
