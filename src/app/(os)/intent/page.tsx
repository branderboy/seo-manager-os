import type { Metadata } from "next";
import { Target, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Intent Mapping" };

const FUNNEL = [
  {
    tier: "TOF",
    name: "Top of Funnel",
    intent: "Informational · Awareness",
    tone: "bg-blue-50 text-blue-700 ring-blue-200",
    queries: ["how to fix an AC", "what is SEER rating", "furnace not heating"],
    goal: "AI Visibility",
    share: 38,
  },
  {
    tier: "MOF",
    name: "Middle of Funnel",
    intent: "Commercial · Consideration",
    tone: "bg-amber-50 text-amber-700 ring-amber-200",
    queries: ["best HVAC company austin", "AC repair vs replace", "HVAC reviews"],
    goal: "Qualified Leads",
    share: 34,
  },
  {
    tier: "BOF",
    name: "Bottom of Funnel",
    intent: "Transactional · Decision",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    queries: ["emergency AC repair near me", "book HVAC tech today", "AC repair cost quote"],
    goal: "Calls",
    share: 28,
  },
];

export default function IntentPage() {
  return (
    <>
      <PageHeader
        stage={3}
        title="Intent Mapping"
        badge="Funnel alignment"
        description="Before diagnosing, nail down what searchers actually want — mapped across the funnel (TOF / MOF / BOF) and aligned to the business goals set in Discovery."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {FUNNEL.map((f) => (
          <Card key={f.tier} className="p-6">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${f.tone}`}>
                {f.tier}
              </span>
              <span className="text-sm font-semibold text-slate-500">{f.share}% of demand</span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{f.name}</h3>
            <p className="text-sm text-slate-500">{f.intent}</p>

            <div className="mt-4">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Example queries</div>
              <ul className="space-y-1.5">
                {f.queries.map((q) => (
                  <li key={q} className="text-sm text-slate-600">&ldquo;{q}&rdquo;</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Aligned goal</span>
              <Badge variant="accent">{f.goal}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Goal alignment summary */}
      <Card>
        <div className="p-6">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Goal Alignment</h3>
          <p className="mt-1 text-sm text-slate-600">Every funnel tier maps to a goal set in Discovery, so nothing downstream is built on guesswork.</p>
          <ul className="mt-4 space-y-2">
            {[
              "TOF informational coverage feeds AI Visibility and top-of-funnel reach.",
              "MOF comparison and review intent captures qualified leads in-market.",
              "BOF transactional intent drives the calls and bookings that close revenue.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
}
