import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Compact status chips · rounded, not pill. Semantic tints, low chroma.
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold ring-1 ring-inset whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-3)] text-[var(--ink-soft)] ring-[var(--border)]",
        accent: "bg-[var(--accent-tint)] text-[var(--accent-ink)] ring-accent-200",
        good: "bg-[var(--ok-tint)] text-[var(--ok-ink)] ring-emerald-200/70",
        warn: "bg-[var(--warn-tint)] text-[var(--warn-ink)] ring-amber-200/70",
        bad: "bg-[var(--danger-tint)] text-[var(--danger-ink)] ring-rose-200/70",
        outline: "bg-[var(--surface)] text-[var(--ink-soft)] ring-[var(--border-strong)]",
        solid: "bg-accent-600 text-white ring-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/** Status dot · a quiet color signal that pairs with a label. */
const dotTone = {
  default: "bg-[var(--faint)]",
  accent: "bg-accent-500",
  good: "bg-[var(--ok)]",
  warn: "bg-[var(--warn)]",
  bad: "bg-[var(--danger)]",
} as const;

export function StatusDot({
  tone = "default",
  pulse,
  className,
}: {
  tone?: keyof typeof dotTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            dotTone[tone]
          )}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotTone[tone])} />
    </span>
  );
}
