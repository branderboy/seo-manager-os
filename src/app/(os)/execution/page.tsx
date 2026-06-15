import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { NextStep } from "@/components/layout/next-step";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, ImpactBadge } from "@/components/ui/status-badge";
import { executionPlans } from "@/lib/data";
import type { Impact } from "@/lib/data";

export const metadata: Metadata = { title: "Execution Planner" };

function effortBadge(effort: Impact) {
  // Lower effort is better — invert the color framing.
  const variant = effort === "Low" ? "good" : effort === "Medium" ? "warn" : "bad";
  return <Badge variant={variant}>{effort}</Badge>;
}

export default function ExecutionPage() {
  return (
    <>
      <PageHeader
        stage={6}
        title="Execution Planner"
        badge="30 / 90 / 180-day"
        description="The strategy, sequenced into time-boxed plans. Every recommendation carries priority, impact, effort, confidence, an owner and a status."
      />

      <div className="space-y-7">
        {executionPlans.map((plan) => (
          <div key={plan.horizon}>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {plan.horizon} Plan
              </h2>
              <Badge variant="outline">{plan.items.length} actions</Badge>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-3 font-medium">Recommendation</th>
                      <th className="px-3 py-3 font-medium">Priority</th>
                      <th className="px-3 py-3 font-medium">Impact</th>
                      <th className="px-3 py-3 font-medium">Effort</th>
                      <th className="px-3 py-3 font-medium">Confidence</th>
                      <th className="px-3 py-3 font-medium">Owner</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.items.map((item) => (
                      <tr
                        key={item.name}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-800">{item.name}</td>
                        <td className="px-3 py-3.5">
                          <ImpactBadge impact={item.priority} />
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge variant={item.impact === "High" ? "accent" : "default"}>{item.impact}</Badge>
                        </td>
                        <td className="px-3 py-3.5">{effortBadge(item.effort)}</td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-accent-400" style={{ width: `${item.confidence}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-500">{item.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-slate-600">{item.owner}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <NextStep from={6} cta="Open Playbooks" />
    </>
  );
}
