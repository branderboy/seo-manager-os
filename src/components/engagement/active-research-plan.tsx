"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useEngagement } from "@/components/engagement/store";
import { researchPlans } from "@/lib/data";
import type { ResearchItem, SeoModel } from "@/lib/data";

// Map the broad SEO type onto the closest research-plan template.
const RESEARCH_MODEL: Record<string, SeoModel> = {
  Local: "Local",
  SaaS: "SaaS",
  Enterprise: "Enterprise",
  Ecommerce: "Enterprise",
  Migration: "Enterprise",
  "AI Search": "SaaS",
};

/**
 * The Data Collection plan for the *active* client only. The engagement is one
 * company in one SEO category — so this stays focused on that category instead
 * of offering cross-model tabs that don't belong to this workspace.
 */
export function ActiveResearchPlan() {
  const { engagement } = useEngagement();
  const items: ResearchItem[] = researchPlans[RESEARCH_MODEL[engagement.model] ?? "Local"] ?? [];
  const total = items.reduce((s, i) => s + i.signals, 0);
  const done = items.filter((i) => i.status === "Complete").length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
        <Badge variant="accent">{engagement.model} SEO</Badge>
        <span>
          <strong className="text-slate-800">{items.length}</strong> research areas
        </span>
        <span>
          <strong className="text-slate-800">{total}</strong> planned signals
        </span>
        <span>
          <strong className="text-slate-800">{done}</strong> complete
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <Card key={item.name} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-700">{item.detail}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <Badge variant="outline">{item.signals} signals</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
