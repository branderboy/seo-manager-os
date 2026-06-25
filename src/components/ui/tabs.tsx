"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Segmented sub-navigation. A clear, clickable control that shows one view at a
 * time instead of stacking everything on the page. Counts surface on each tab so
 * you can see where the work is before clicking in.
 */
export function Tabs({
  tabs,
  initial,
  className,
}: {
  tabs: { id: string; label: string; content: React.ReactNode; count?: number; icon?: React.ComponentType<{ className?: string }> }[];
  initial?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-3)] p-1 shadow-card">
        {tabs.map((t) => {
          const on = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-all",
                on
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {Icon && <Icon className={cn("h-4 w-4", on ? "text-accent-600" : "text-[var(--faint)]")} />}
              {t.label}
              {typeof t.count === "number" && (
                <span
                  className={cn(
                    "tnum rounded px-1.5 py-0.5 text-2xs font-bold",
                    on ? "bg-[var(--accent-tint)] text-[var(--accent-ink)]" : "bg-[var(--border)] text-[var(--muted)]"
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-5">{current?.content}</div>
    </div>
  );
}
