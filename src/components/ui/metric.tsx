import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "good" | "warn" | "bad";

// Soft color-filled panels — warmth + instant differentiation (BrightLocal-style).
const toneSurface: Record<Tone, string> = {
  default: "border-[var(--border)] bg-[var(--surface)]",
  accent: "border-accent-100 bg-[var(--accent-tint)]",
  good: "border-emerald-100 bg-[var(--ok-tint)]",
  warn: "border-amber-100 bg-[var(--warn-tint)]",
  bad: "border-rose-100 bg-[var(--danger-tint)]",
};
const toneValue: Record<Tone, string> = {
  default: "text-[var(--foreground)]",
  accent: "text-accent-700",
  good: "text-[#157552]",
  warn: "text-[#9a6512]",
  bad: "text-[#b13a31]",
};
const toneLabel: Record<Tone, string> = {
  default: "text-[var(--muted)]",
  accent: "text-accent-700/70",
  good: "text-[#157552]/70",
  warn: "text-[#9a6512]/75",
  bad: "text-[#b13a31]/70",
};
const toneIcon: Record<Tone, string> = {
  default: "text-[var(--faint)]",
  accent: "text-accent-500",
  good: "text-[var(--ok)]",
  warn: "text-[var(--warn)]",
  bad: "text-[var(--danger)]",
};

/**
 * KPI tile — a soft color-filled panel with a big, bold figure. Tone drives the
 * fill so a band of metrics reads as distinct, colorful objects, not lookalikes.
 */
export function StatTile({
  label,
  value,
  sub,
  tone = "default",
  delta,
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: Tone;
  delta?: { value: string; direction: "up" | "down"; good?: boolean };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const deltaGood = delta?.good ?? delta?.direction === "up";
  return (
    <div className={cn("rounded-xl border p-5 shadow-card", toneSurface[tone], className)}>
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-semibold", toneLabel[tone])}>{label}</span>
        {Icon && <Icon className={cn("h-4 w-4", toneIcon[tone])} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn("tnum text-3xl font-bold tracking-tight", toneValue[tone])}>{value}</span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-sm font-bold tnum",
              deltaGood ? "text-[var(--ok)]" : "text-[var(--danger)]"
            )}
          >
            {delta.direction === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {delta.value}
          </span>
        )}
      </div>
      {sub && <div className={cn("mt-1 text-sm", toneLabel[tone])}>{sub}</div>}
    </div>
  );
}

/** A row of colored stat panels with comfortable gaps. */
export function StatRow({
  children,
  className,
  cols = 4,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4 | 5;
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
  }[cols];
  return <div className={cn("grid grid-cols-1 gap-4", colClass, className)}>{children}</div>;
}
