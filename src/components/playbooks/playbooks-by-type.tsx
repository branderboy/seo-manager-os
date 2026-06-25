"use client";

import { useState } from "react";
import { PlaybookCard } from "@/components/playbooks/playbook-card";
import { playbookTypes, playbooksByType, type PlaybookType } from "@/lib/playbooks";
import { cn } from "@/lib/utils";

export function PlaybooksByType() {
  const [type, setType] = useState<PlaybookType>("Local");
  const list = playbooksByType[type];
  const plays = list.reduce((n, p) => n + p.plays.length, 0);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap gap-2">
          {playbookTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                type === t
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-[var(--border)] bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Same engine, specialized plays — {list.length} playbooks · {plays} plays for{" "}
          <span className="font-medium text-slate-700">{type}</span> SEO.
        </p>
      </div>

      <div className="stagger grid gap-4 lg:grid-cols-2">
        {list.map((pb) => (
          <PlaybookCard key={pb.key} pb={pb} />
        ))}
      </div>
    </div>
  );
}
