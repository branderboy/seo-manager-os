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
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { PriorityScatter } from "@/components/charts/charts";
import { EngName, EngModel, EngMarket } from "@/components/engagement/eng";
import { strategy, priorityMatrix } from "@/lib/data";

export const metadata: Metadata = { title: "Strategy Brief" };

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
        stage={5}
        title="Strategy Brief"
        badge="Executive-ready"
        description="A board-ready strategy document, generated from the diagnosis. Everything traces back to a root cause and forward to an expected outcome."
      >
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

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
              <div className="text-sm text-slate-400">
                <EngModel /> SEO · <EngMarket /> · Prepared by SEO Manager OS
              </div>
            </div>
            <FileText className="hidden h-8 w-8 text-slate-200 sm:block" />
          </div>

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

          <Block icon={AlertTriangle} title="Risks">
            <Bullets items={strategy.risks} />
          </Block>

          {/* Priority matrix */}
          <Block icon={ListChecks} title="Priority Matrix">
            <p className="mb-2 text-sm text-slate-500">
              Impact vs. effort. The upper-left quadrant — high impact, low effort —
              is where execution starts.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <PriorityScatter data={priorityMatrix} />
            </div>
          </Block>

          {/* Expected outcomes */}
          <Block icon={TrendingUp} title="Expected Outcomes">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {strategy.expectedOutcomes.map((o) => (
                <div key={o.metric} className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <div className="text-sm text-slate-500">{o.metric}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-slate-400 line-through">{o.from}</span>
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

      <div className="flex justify-end">
        <ButtonLink href="/execution">
          Build execution plan
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </>
  );
}
