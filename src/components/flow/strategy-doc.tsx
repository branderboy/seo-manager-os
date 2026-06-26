"use client";

import { FileText, Activity, ListChecks, Lightbulb, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEngagement } from "@/components/engagement/store";
import { strategyByType } from "@/lib/recommendations";

/** The project brief, generated for the active client · adapts to its SEO type. */
export function StrategyDoc() {
  const { engagement } = useEngagement();
  const st = strategyByType[engagement.model];

  return (
    <Card>
      <div className="space-y-9 p-7 sm:p-9">
        <div className="flex items-start justify-between border-b border-[var(--border)] pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">Search Strategy</div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{engagement.business}</h2>
            <div className="text-sm text-slate-600">
              {engagement.model} SEO · {engagement.market} · Prepared by SEO Manager OS
            </div>
          </div>
          <FileText className="hidden h-8 w-8 text-slate-200 sm:block" />
        </div>

        <Block icon={FileText} title="Executive Summary">
          <p className="text-[15px] leading-relaxed text-slate-700">{st.executiveSummary}</p>
        </Block>

        <div className="grid gap-9 sm:grid-cols-2">
          <Block icon={Activity} title="Current State"><Bullets items={st.currentState} /></Block>
          <Block icon={ListChecks} title="Key Findings"><Bullets items={st.keyFindings} /></Block>
          <Block icon={Lightbulb} title="Opportunities"><Bullets items={st.opportunities} /></Block>
          <Block icon={AlertTriangle} title="Risks"><Bullets items={st.risks} /></Block>
        </div>

        <Block icon={TrendingUp} title="Expected Outcomes">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {st.expectedOutcomes.map((o) => (
              <div key={o.metric} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <div className="text-sm text-slate-700">{o.metric}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-slate-600 line-through">{o.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                  <span className="text-2xl font-semibold text-slate-900">{o.to}</span>
                </div>
                <div className="mt-1 text-xs font-medium text-emerald-600">
                  +{Math.round(((o.to - o.from) / Math.max(o.from, 1)) * 100)}% projected
                </div>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </Card>
  );
}

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
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
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
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
          {i}
        </li>
      ))}
    </ul>
  );
}
