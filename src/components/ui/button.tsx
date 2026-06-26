import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Big, bold, pressable keys · tall darker bottom edge, uppercase labels, strong
// ambient glow. Each button looks physically raised and slams down on click
// (aggressive ClickFunnels depth). Ghost stays quiet for tertiary actions.
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        // Primary = confident green key with a subtle pressable bottom edge.
        primary:
          "bg-gradient-to-b from-accent-400 to-accent-600 text-white shadow-[0_3px_0_0_#064e2f,0_6px_14px_-4px_rgba(9,146,80,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-accent-300 hover:to-accent-500 hover:shadow-[0_3px_0_0_#064e2f,0_10px_20px_-6px_rgba(9,146,80,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] active:translate-y-[3px] active:shadow-[0_0_0_0_#064e2f,inset_0_2px_4px_rgba(0,0,0,0.15)]",
        accent:
          "bg-gradient-to-b from-accent-300 to-accent-500 text-white shadow-[0_3px_0_0_#075135,0_6px_14px_-4px_rgba(22,179,100,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-accent-200 hover:to-accent-400 active:translate-y-[3px] active:shadow-[0_0_0_0_#075135,inset_0_2px_4px_rgba(0,0,0,0.14)]",
        // Secondary = raised white key with a soft gray edge.
        secondary:
          "border border-[var(--border-strong)] bg-gradient-to-b from-white to-[#f1f3f7] text-[var(--ink-soft)] shadow-[0_3px_0_0_#dadde4,0_5px_12px_-4px_rgba(16,24,40,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] hover:text-[var(--foreground)] hover:shadow-[0_3px_0_0_#dadde4,0_8px_16px_-4px_rgba(16,24,40,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-[3px] active:shadow-[0_0_0_0_#dadde4,inset_0_2px_4px_rgba(16,24,40,0.07)]",
        ghost:
          "text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        danger:
          "bg-gradient-to-b from-[#e8675d] to-[var(--danger)] text-white shadow-[0_3px_0_0_#992f27,0_6px_14px_-4px_rgba(212,73,63,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_0_0_0_#992f27,inset_0_2px_4px_rgba(0,0,0,0.15)]",
        // Back-compat alias · matches primary.
        dark:
          "bg-gradient-to-b from-accent-400 to-accent-600 text-white shadow-[0_3px_0_0_#064e2f,0_6px_14px_-4px_rgba(9,146,80,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-accent-300 hover:to-accent-500 active:translate-y-[3px] active:shadow-[0_0_0_0_#064e2f]",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
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
