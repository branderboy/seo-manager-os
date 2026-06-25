"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useEngagement } from "@/components/engagement/store";
import { demoEngagements } from "@/lib/engagements";

/** Top-bar switcher: change the active client and its SEO type, app-wide. */
export function ClientSwitcher() {
  const { engagement, setEngagement } = useEngagement();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-black/10 px-3 py-1.5 text-white transition-colors hover:bg-black/20"
      >
        <span className="max-w-[180px] truncate text-sm font-semibold">{engagement.business}</span>
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-semibold">{engagement.model}</span>
        <ChevronDown className="h-4 w-4 opacity-80" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-30 mt-1.5 w-80 rounded-xl border border-[var(--border)] bg-white p-1.5 shadow-lift">
            <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Switch client · SEO type
            </div>
            {demoEngagements.map((e) => {
              const active = e.business === engagement.business;
              return (
                <button
                  key={e.business}
                  type="button"
                  onClick={() => {
                    setEngagement(e);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800">{e.business}</div>
                    <div className="truncate text-xs text-slate-500">
                      {e.industry} · {e.market}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-700">
                      {e.model}
                    </span>
                    {active && <Check className="h-4 w-4 text-emerald-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
