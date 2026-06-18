"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { diagnosis } from "@/lib/data";
import { useHandoff } from "@/components/flow/handoff-store";
import { cn } from "@/lib/utils";

const ALL = [
  { title: diagnosis.primary.title, meta: `Primary · ${diagnosis.primary.impact}` },
  { title: diagnosis.secondary.title, meta: `Secondary · ${diagnosis.secondary.impact}` },
  ...diagnosis.possible.map((p) => ({ title: p.title, meta: `Possible · ${p.impact}` })),
];

export function PushToStrategy() {
  const { strategyInputs, setStrategyInputs } = useHandoff();
  const [sel, setSel] = useState<string[]>(strategyInputs);
  const [pushed, setPushed] = useState(false);

  const toggle = (t: string) => {
    setPushed(false);
    setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Send to Project Brief</h3>
        <p className="mt-1 text-sm text-slate-600">
          Choose which causes carry forward into the Project Brief. Only what you select becomes the plan.
        </p>

        <ul className="mt-4 divide-y divide-[var(--border)]">
          {ALL.map((c) => {
            const on = sel.includes(c.title);
            return (
              <li key={c.title} className="flex items-center gap-3 py-2.5">
                <button
                  onClick={() => toggle(c.title)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    on ? "border-accent-500 bg-accent-500 text-white" : "border-slate-300 hover:border-accent-400"
                  )}
                  aria-label={on ? "Deselect" : "Select"}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </button>
                <span className="flex-1 text-sm font-medium text-slate-800">{c.title}</span>
                <span className="font-mono text-xs uppercase tracking-wide text-slate-500">{c.meta}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setStrategyInputs(sel);
              setPushed(true);
            }}
            disabled={sel.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Push {sel.length} to Project Brief <ArrowRight className="h-4 w-4" />
          </button>
          {pushed && (
            <Link href="/strategy" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              <Check className="h-4 w-4" /> Pushed. Open Project Brief <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
