"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  initial,
  className,
}: {
  tabs: { id: string; label: string; content: React.ReactNode; count?: number }[];
  initial?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "relative -mb-px flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
              active === t.id
                ? "text-slate-900"
                : "text-slate-700 hover:text-slate-800"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                {t.count}
              </span>
            )}
            {active === t.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent-500" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{current?.content}</div>
    </div>
  );
}
