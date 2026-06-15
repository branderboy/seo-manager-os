import type { Metadata } from "next";
import { Check, X, Minus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Section, RootCause } from "@/components/dashboard/section";
import { AeoPanel } from "@/components/modules/aeo-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FunnelBars } from "@/components/charts/charts";
import { saasDashboard as d } from "@/lib/dashboards";

export const metadata: Metadata = { title: "SaaS SEO Dashboard" };

export default function SaasDashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        active="saas"
        account={d.account}
        market={d.market}
        scores={[
          { label: "Visibility", value: d.scores.visibility },
          { label: "Authority", value: d.scores.authority },
          { label: "Convert", value: d.scores.conversion },
          { label: "AI", value: d.scores.ai },
        ]}
      />

      {/* ── Read first: where we stand + why ───────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
            <CardDescription>Where the product wins and leaks in search.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Flowdesk has strong top-of-funnel content but a thin bottom of funnel. Pricing
              ranks, yet solution and use-case pages are missing, and competitors own the
              comparison SERPs. The largest untapped lever is a programmatic integration set —
              140 demand-backed pages currently unbuilt.
            </p>
          </CardContent>
        </Card>
        <RootCause title="Thin bottom-of-funnel coverage" confidence={84} />
      </div>

      {/* ── Demand capture ─────────────────────────────────────────────────── */}
      <Section label="Demand capture">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* BOFU coverage */}
        <Card>
          <CardHeader>
            <CardTitle>BOFU Coverage</CardTitle>
            <CardDescription>Bottom-of-funnel page health.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {d.bofu.map((b) => (
                <li key={b.page} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm font-medium text-slate-800">{b.page}</span>
                  <div className="flex items-center gap-3">
                    <span className="w-24"><Progress value={b.coverage} /></span>
                    <Badge variant={b.status === "Ranking" ? "good" : b.status === "Thin" ? "warn" : "bad"}>
                      {b.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Comparison & alternative pages */}
        <Card>
          <CardHeader>
            <CardTitle>Comparison &amp; Alternative Pages</CardTitle>
            <CardDescription>High-intent terms and whether a page exists.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {d.comparisons.map((c) => (
                <li key={c.term} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{c.term}</div>
                    <div className="text-xs text-slate-500">
                      {c.volume.toLocaleString()} vol · KD {c.difficulty}
                    </div>
                  </div>
                  {c.hasPage ? (
                    <Badge variant="good"><Check className="h-3 w-3" /> Built</Badge>
                  ) : (
                    <Badge variant="bad"><X className="h-3 w-3" /> Missing</Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Programmatic + integrations + use cases */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Programmatic Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {d.programmatic.intentBacked}
            </div>
            <p className="text-sm text-slate-600">demand-backed pages unbuilt</p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-600">
                <span>Built {d.programmatic.built}</span>
                <span>Opportunity {d.programmatic.opportunity}</span>
              </div>
              <Progress value={(d.programmatic.built / d.programmatic.opportunity) * 100} tone="bg-accent-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {d.integrations.live}/{d.integrations.catalog}
            </div>
            <p className="text-sm text-slate-600">integration pages live</p>
            <div className="mt-4">
              <Progress value={(d.integrations.live / d.integrations.catalog) * 100} tone="bg-accent-500" />
              <div className="mt-1 text-xs text-slate-500">{d.integrations.ranking} ranking page 1</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-3xl font-semibold text-amber-600">
              <Minus className="h-6 w-6" /> Thin
            </div>
            <p className="text-sm text-slate-600">JTBD coverage at 35% of demand</p>
            <div className="mt-4">
              <Progress value={35} tone="bg-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      </Section>

      {/* ── Conversion ─────────────────────────────────────────────────────── */}
      <Section label="Conversion">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Organic sessions to qualified signup.</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelBars data={d.funnel} />
          </CardContent>
        </Card>
      </Section>

      {/* ── AI visibility ──────────────────────────────────────────────────── */}
      <Section label="AI visibility">
        <AeoPanel />
      </Section>
    </div>
  );
}
