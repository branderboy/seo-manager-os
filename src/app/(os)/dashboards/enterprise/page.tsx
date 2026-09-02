import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Section, RootCause } from "@/components/dashboard/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatTile, StatRow } from "@/components/ui/metric";
import { enterpriseDashboard as d } from "@/lib/dashboards";

export const metadata: Metadata = { title: "Enterprise SEO Dashboard" };

const ROADMAP = [
  "Block faceted URLs from crawl",
  "Fix crawled-not-indexed at scale",
  "Rebuild decaying category template",
  "Internally link 9k orphan pages",
];

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${Math.round(n / 1000)}k` : `${n}`;

export default function EnterpriseDashboard() {
  const { indexation: ix } = d;
  const indexedPct = Math.round((ix.indexed / ix.submitted) * 100);
  const cniPct = Math.round((ix.crawledNotIndexed / ix.submitted) * 100);
  const dupPct = Math.round((ix.duplicate / ix.submitted) * 100);
  const wastedCrawl = d.crawl.find((c) => c.label.startsWith("Parameter"))?.value ?? 0;

  const coverage = [
    { label: "Indexed", count: ix.indexed, pct: indexedPct, tone: "bg-accent-500", good: true },
    { label: "Crawled, not indexed", count: ix.crawledNotIndexed, pct: cniPct, tone: "bg-[var(--warn)]" },
    { label: "Duplicate / canonical", count: ix.duplicate, pct: dupPct, tone: "bg-[var(--danger)]" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        active="enterprise"
        account={d.account}
        market={d.market}
        scores={[
          { label: "Visibility", value: d.scores.visibility },
          { label: "Indexation", value: d.scores.indexation },
          { label: "Crawl", value: d.scores.crawl },
          { label: "AI", value: d.scores.ai },
        ]}
      />

      {/* Read first */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="text-sm font-semibold text-[var(--foreground)]">Executive Summary</div>
          <p className="mt-2 text-base leading-relaxed text-[var(--ink-soft)]">
            Vantage Retail has 1.2M URLs but Google indexes just {indexedPct}% of them. A third of the
            crawl budget is spent on filter and parameter pages that earn nothing, while {fmt(ix.crawledNotIndexed)}{" "}
            real pages are crawled and left out of the index. Reclaiming that budget, not making more
            pages, is what lifts revenue traffic.
          </p>
        </Card>
        <RootCause title="Crawl budget wasted on filter pages" confidence={78} impact="High impact" />
      </div>

      {/* Crawl budget */}
      <Section label="Crawl budget">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">Where Google spends its crawl</div>
              <p className="mt-0.5 text-sm text-[var(--muted)]">Share of crawl requests by page type.</p>
            </div>
            <Badge variant="bad">{wastedCrawl}% wasted on filters</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {d.crawl.map((c) => {
              const wasteful = c.label.startsWith("Parameter");
              return (
                <li key={c.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-[var(--ink-soft)]">{c.label}</span>
                    <span className="font-semibold tnum text-[var(--foreground)]">{c.value}%</span>
                  </div>
                  <Progress value={c.value} tone={wasteful ? "bg-[var(--danger)]" : "bg-accent-500"} />
                </li>
              );
            })}
          </ul>
        </Card>
      </Section>

      {/* Indexation coverage */}
      <Section label="Indexation coverage">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-semibold text-[var(--foreground)]">Of {fmt(ix.submitted)} submitted URLs</div>
              <div className="text-2xl font-bold tnum text-[var(--foreground)]">{indexedPct}% indexed</div>
            </div>
            <ul className="mt-4 space-y-3.5">
              {coverage.map((c) => (
                <li key={c.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-[var(--ink-soft)]">{c.label}</span>
                    <span className="font-semibold tnum text-[var(--foreground)]">
                      {fmt(c.count)} <span className="text-[var(--muted)]">· {c.pct}%</span>
                    </span>
                  </div>
                  <Progress value={c.pct} tone={c.tone} />
                </li>
              ))}
            </ul>
          </Card>
          <StatRow cols={2} className="lg:grid-cols-1 lg:content-start">
            <StatTile label="Crawled, not indexed" value={fmt(ix.crawledNotIndexed)} tone="warn" sub="real pages left out" />
            <StatTile label="Duplicate / canonical" value={fmt(ix.duplicate)} tone="bad" sub="competing with each other" />
          </StatRow>
        </div>
      </Section>

      {/* Template performance */}
      <Section label="Template performance">
        <Card>
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 border-b border-[var(--border)] px-5 py-2.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
            <span>Template</span>
            <span className="text-right">Traffic</span>
            <span className="text-right">Trend</span>
            <span className="text-right">Links / page</span>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {d.templates.map((t) => {
              const down = t.decay < 0;
              return (
                <li key={t.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 px-5 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">{t.name}</span>
                  <div className="w-28 justify-self-end">
                    <Progress value={t.traffic} tone="bg-accent-500" />
                  </div>
                  <span className={`inline-flex items-center justify-end gap-0.5 text-sm font-semibold tnum ${down ? "text-[var(--danger)]" : "text-[var(--ok)]"}`}>
                    {down ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    {Math.abs(t.decay)}%
                  </span>
                  <span className="text-right text-sm tnum text-[var(--ink-soft)]">{t.links}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </Section>

      {/* Internal links */}
      <Section label="Internal links">
        <StatRow cols={3}>
          <StatTile label="Orphan pages" value={fmt(d.links.orphans)} tone="bad" sub="no internal links in" />
          <StatTile label="Links to revenue pages" value={d.links.avgRevenueLinks} sub="avg per page · too few" tone="warn" />
          <StatTile label="Hub pages" value={d.links.hubs} tone="accent" sub="distributing authority" />
        </StatRow>
      </Section>

      {/* Forecast */}
      <Section label="6-month forecast">
        <Card className="p-6">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-semibold text-[var(--foreground)]">Organic sessions if we fix crawl + indexation</div>
            <span className="text-sm font-semibold text-[var(--ok)]">
              +{d.forecast[d.forecast.length - 1].sessions - d.forecast[0].sessions}% projected
            </span>
          </div>
          <div className="mt-5 flex items-end gap-2 sm:gap-3">
            {d.forecast.map((f) => {
              const min = d.forecast[0].sessions;
              const max = d.forecast[d.forecast.length - 1].sessions;
              const h = 32 + ((f.sessions - min) / (max - min || 1)) * 96;
              return (
                <div key={f.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center" style={{ height: 128 }}>
                    <div
                      className="w-full max-w-[40px] rounded-t-md bg-accent-500/85"
                      style={{ height: `${h}px` }}
                    />
                  </div>
                  <span className="text-2xs font-medium text-[var(--muted)]">{f.month}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* Roadmap */}
      <Section label="Roadmap">
        <Card className="p-5">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((r, i) => (
              <li key={r} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-600 text-xs font-semibold text-white">{i + 1}</span>
                <span className="text-sm font-medium text-[var(--ink-soft)]">{r}</span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>
    </div>
  );
}
