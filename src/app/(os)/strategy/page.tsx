import type { Metadata } from "next";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ListChecks,
  Activity,
  ArrowRight,
  Download,
  Check,
  Target,
  Radar,
  Route,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CarriedFromDiagnosis } from "@/components/flow/carried-from-diagnosis";
import { BriefVersions } from "@/components/flow/brief-versions";
import { BriefShare } from "@/components/flow/brief-share";
import { BriefApproval } from "@/components/flow/brief-approval";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityScatter } from "@/components/charts/charts";
import { EngName, EngModel, EngMarket } from "@/components/engagement/eng";
import { strategy, priorityMatrix, executionPlans } from "@/lib/data";
import type { Impact } from "@/lib/data";

export const metadata: Metadata = { title: "Project Brief" };

// What each upstream stage contributed — the brief is the synthesis of the pipeline.
const SYNTHESIZED = [
  { stage: "01 · Discovery", got: "Goals: more leads, more calls, AI visibility" },
  { stage: "02 · Data Collection", got: "GSC · GA4 · GBP · site crawl synced" },
  { stage: "03 · Intent Mapping", got: "TOF / MOF / BOF mapped to the goals" },
  { stage: "04 · Competitive Insights", got: "3 rivals · 11% share of voice (3rd)" },
  { stage: "05 · Diagnosis", got: "Root cause: weak review velocity (87%)" },
  { stage: "06 · Playbooks", got: "Local · GEO · AEO playbooks selected" },
];

const INTENT = [
  { tier: "TOF", goal: "AI Visibility", example: "“how to fix an AC”", tone: "bg-blue-50 text-blue-700 ring-blue-200" },
  { tier: "MOF", goal: "Qualified Leads", example: "“best HVAC company austin”", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  { tier: "BOF", goal: "Calls", example: "“emergency AC repair near me”", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
];

const RIVALS = [
  { name: "Comfort Pros HVAC", sov: 31, ai: "Cited", you: false },
  { name: "Austin Air Experts", sov: 22, ai: "Cited", you: false },
  { name: "Northwind Heating & Air", sov: 11, ai: "Absent", you: true },
];

const priorityTone: Record<Impact, string> = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
          {i}
        </li>
      ))}
    </ul>
  );
}

export default function StrategyPage() {
  return (
    <>
      <PageHeader
        stage={7}
        title="Project Brief"
        badge="Executive-ready"
        description="A board-ready strategy document, generated from the diagnosis. Everything traces back to a root cause and forward to an expected outcome."
      >
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      <CarriedFromDiagnosis />

      <BriefVersions />

      <Card>
        <div className="space-y-9 p-7 sm:p-9">
          {/* Doc header */}
          <div className="flex items-start justify-between border-b border-[var(--border)] pb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                Search Strategy
              </div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                <EngName />
              </h2>
              <div className="text-sm text-slate-500">
                <EngModel /> SEO · <EngMarket /> · Prepared by SEO Manager OS
              </div>
            </div>
            <FileText className="hidden h-8 w-8 text-slate-200 sm:block" />
          </div>

          {/* Synthesized from the pipeline — every input that built this brief */}
          <Block icon={Route} title="Synthesized From">
            <p className="mb-3 text-sm text-slate-600">
              This brief brings the whole pipeline together — every stage&apos;s output feeds the plan below.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {SYNTHESIZED.map((s) => (
                <li key={s.stage} className="flex items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-accent-600">{s.stage}</div>
                    <div className="text-sm text-slate-700">{s.got}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={FileText} title="Executive Summary">
            <p className="text-[15px] leading-relaxed text-slate-600">
              {strategy.executiveSummary}
            </p>
          </Block>

          <div className="grid gap-9 sm:grid-cols-2">
            <Block icon={Activity} title="Current State">
              <Bullets items={strategy.currentState} />
            </Block>
            <Block icon={ListChecks} title="Key Findings">
              <Bullets items={strategy.keyFindings} />
            </Block>
            <Block icon={AlertTriangle} title="Root Causes">
              <Bullets items={strategy.rootCauses} />
            </Block>
            <Block icon={Lightbulb} title="Opportunities">
              <Bullets items={strategy.opportunities} />
            </Block>
          </div>

          {/* Search intent → goals */}
          <Block icon={Target} title="Search Intent → Goals">
            <div className="grid gap-3 sm:grid-cols-3">
              {INTENT.map((t) => (
                <div key={t.tier} className="rounded-xl border border-[var(--border)] p-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${t.tone}`}>
                    {t.tier}
                  </span>
                  <div className="mt-2.5 text-sm text-slate-500">{t.example}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" /> {t.goal}
                  </div>
                </div>
              ))}
            </div>
          </Block>

          {/* Competitive position */}
          <Block icon={Radar} title="Competitive Position">
            <p className="mb-3 text-sm text-slate-600">
              Northwind sits third in the local market — the gaps below are measured against who&apos;s
              actually winning, not in a vacuum.
            </p>
            <ul className="space-y-2">
              {RIVALS.map((r) => (
                <li key={r.name} className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${r.you ? "border-accent-300 bg-accent-50/40" : "border-[var(--border)]"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-700">{r.sov}%</span>
                    <span className={`truncate text-sm ${r.you ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {r.name}{r.you && " (you)"}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${r.ai === "Cited" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}>
                    {r.ai} in AI
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={AlertTriangle} title="Risks">
            <Bullets items={strategy.risks} />
          </Block>

          {/* Priority matrix */}
          <Block icon={ListChecks} title="Priority Matrix">
            <p className="mb-2 text-sm text-slate-600">
              Impact vs. effort. The upper-left quadrant — high impact, low effort —
              is where execution starts.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <PriorityScatter data={priorityMatrix} />
            </div>
          </Block>

          {/* Action roadmap — the actionable plan, owned and time-boxed */}
          <Block icon={Route} title="Action Roadmap">
            <p className="mb-4 text-sm text-slate-600">
              The plan, sequenced and owned. Each action ships through the Daily Task Engine and routes
              to the right person.
            </p>
            <div className="space-y-5">
              {executionPlans.map((plan) => (
                <div key={plan.horizon}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                      {plan.horizon}
                    </span>
                    <span className="text-xs text-slate-500">{plan.items.length} actions</span>
                  </div>
                  <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)]">
                    {plan.items.map((it) => (
                      <li key={it.name} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${priorityTone[it.priority]}`}>
                            {it.priority}
                          </span>
                          <span className="truncate text-sm text-slate-700">{it.name}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                          <span className="hidden sm:inline">{it.owner}</span>
                          <span className="font-mono">{it.confidence}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          {/* Expected outcomes */}
          <Block icon={TrendingUp} title="Expected Outcomes">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {strategy.expectedOutcomes.map((o) => (
                <div key={o.metric} className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <div className="text-sm text-slate-600">{o.metric}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-slate-500 line-through">{o.from}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-2xl font-semibold text-slate-900">{o.to}</span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-emerald-600">
                    +{Math.round(((o.to - o.from) / o.from) * 100)}% projected
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </div>
      </Card>

      <BriefApproval />
      <BriefShare />
    </>
  );
}
