import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AeoPanel } from "@/components/modules/aeo-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonutChart, AreaTrend } from "@/components/charts/charts";
import { enterpriseDashboard as d } from "@/lib/dashboards";

export const metadata: Metadata = { title: "Enterprise SEO Dashboard" };

export default function EnterpriseDashboard() {
  const indexRate = Math.round((d.indexation.indexed / d.indexation.submitted) * 100);
  return (
    <div className="space-y-6">
      <DashboardHeader
        active="enterprise"
        account={d.account}
        market={d.market}
        scores={[
          { label: "Visibility", value: d.scores.visibility },
          { label: "Indexed", value: d.scores.indexation },
          { label: "Crawl", value: d.scores.crawl },
          { label: "AI", value: d.scores.ai },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>The technical constraints capping organic revenue.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-relaxed text-slate-600">
            Vantage wastes a third of its crawl budget on parameter and facet URLs, leaving
            61k valuable pages crawled-but-not-indexed. The category template has decayed
            18% YoY and revenue pages average just 1.4 internal links. Fixing indexation and
            internal linking models to +22% qualified sessions over six months.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Crawl budget */}
        <Card>
          <CardHeader>
            <CardTitle>Crawl Budget</CardTitle>
            <CardDescription>Where Googlebot spends its time.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={d.crawl} height={200} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {d.crawl.map((c) => (
                <div key={c.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
                  <span className="text-slate-600">{c.label}</span>
                  <span className="font-semibold text-slate-800">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indexation */}
        <Card>
          <CardHeader>
            <CardTitle>Indexation</CardTitle>
            <CardDescription>{indexRate}% of submitted URLs indexed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <IndexRow label="Submitted" value={d.indexation.submitted} max={d.indexation.submitted} tone="bg-slate-400" />
              <IndexRow label="Indexed" value={d.indexation.indexed} max={d.indexation.submitted} tone="bg-emerald-500" />
              <IndexRow label="Crawled — not indexed" value={d.indexation.crawledNotIndexed} max={d.indexation.submitted} tone="bg-rose-500" />
              <IndexRow label="Duplicate" value={d.indexation.duplicate} max={d.indexation.submitted} tone="bg-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template performance + link graph */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template Performance</CardTitle>
            <CardDescription>Relative traffic, YoY decay and avg. internal links.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {d.templates.map((t) => (
                <li key={t.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.links} internal links avg</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-20"><Progress value={t.traffic} tone="bg-accent-400" /></span>
                    <span className={`inline-flex w-14 items-center justify-end gap-0.5 text-sm font-semibold ${t.decay >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.decay >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {Math.abs(t.decay)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internal Link Graph</CardTitle>
            <CardDescription>Equity distribution health.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <GraphStat label="Orphan URLs" value={d.links.orphans.toLocaleString()} tone="bad" />
              <GraphStat label="Avg links / revenue page" value={`${d.links.avgRevenueLinks}`} tone="bad" />
              <GraphStat label="Hub pages" value={`${d.links.hubs}`} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              9,200 orphan URLs receive no internal links, and money pages are under-linked.
              Routing equity from hubs to revenue templates is the highest-leverage fix.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Forecasting</CardTitle>
          <CardDescription>Modeled qualified sessions if fixes ship (indexed = 100).</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaTrend data={d.forecast} dataKey="sessions" />
        </CardContent>
      </Card>

      <AeoPanel />
    </div>
  );
}

function IndexRow({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{value.toLocaleString()}</span>
      </div>
      <Progress value={(value / max) * 100} tone={tone} />
    </div>
  );
}

function GraphStat({ label, value, tone }: { label: string; value: string; tone?: "bad" }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
      <div className={`text-xl font-semibold ${tone === "bad" ? "text-rose-600" : "text-slate-900"}`}>{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{label}</div>
    </div>
  );
}
