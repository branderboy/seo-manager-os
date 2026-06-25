import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "good" | "warn" | "bad";

const valueTone: Record<Tone, string> = {
  default: "text-[var(--foreground)]",
  accent: "text-accent-600",
  good: "text-[var(--ok)]",
  warn: "text-[var(--warn)]",
  bad: "text-[var(--danger)]",
};

/**
 * KPI tile — deliberately distinct from a card. Small caps label up top, a
 * large tabular figure as the focal element, optional delta + sub. Used in a
 * divided row so the metrics band reads as one object, not four lookalike cards.
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
    <div className={cn("px-5 py-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5 text-[var(--faint)]" />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className={cn(
            "tnum text-2xl font-semibold tracking-tight",
            valueTone[tone]
          )}
        >
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold tnum",
              deltaGood ? "text-[var(--ok)]" : "text-[var(--danger)]"
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>
      {sub && <div className="mt-0.5 text-xs text-[var(--muted)]">{sub}</div>}
    </div>
  );
}

/** A row of stat tiles that share one bordered surface, divided by hairlines. */
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
  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card sm:divide-x sm:divide-y-0",
        colClass,
        className
      )}
    >
      {children}
    </div>
  );
}
