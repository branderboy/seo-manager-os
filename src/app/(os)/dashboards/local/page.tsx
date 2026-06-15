import type { Metadata } from "next";
import { Star, Check, X, TrendingDown } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GeoGrid } from "@/components/dashboard/geo-grid";
import { AeoPanel } from "@/components/modules/aeo-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "@/components/charts/charts";
import { localDashboard as d } from "@/lib/dashboards";
import { diagnosis } from "@/lib/data";

export const metadata: Metadata = { title: "Local SEO Dashboard" };

export default function LocalDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        active="local"
        account={d.account}
        market={d.market}
        scores={[
          { label: "Visibility", value: d.scores.visibility },
          { label: "Trust", value: d.scores.trust },
          { label: "Authority", value: d.scores.authority },
          { label: "AI", value: d.scores.ai },
        ]}
      />

      {/* Executive summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>The one-paragraph read on where this business stands.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-relaxed text-slate-600">
            Northwind wins within a tight 2-mile core but loses reach quickly beyond it.
            The constraint is trust, not content: review velocity trails the market 3-to-1
            and half of advertised services lack a page. AI visibility is critically low —
            the brand is largely absent from AI answers for core service terms.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Geo grid */}
        <Card>
          <CardHeader>
            <CardTitle>Geo Grid</CardTitle>
            <CardDescription>Average rank across the service radius (7×7).</CardDescription>
          </CardHeader>
          <CardContent>
            <GeoGrid grid={d.geoGrid} />
          </CardContent>
        </Card>

        {/* GBP health */}
        <Card>
          <CardHeader>
            <CardTitle>GBP Health</CardTitle>
            <CardDescription>Google Business Profile completeness.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {d.gbp.map((g) => (
                <li key={g.label} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">{g.label}</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    {g.value}
                    {g.ok ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-rose-500" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Review intelligence */}
      <Card>
        <CardHeader>
          <CardTitle>Review Intelligence</CardTitle>
          <CardDescription>Velocity is the primary constraint on reach.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Rating" value={`${d.reviews.rating}★`} icon={<Star className="h-4 w-4 text-amber-400" />} />
              <Stat label="Total reviews" value={d.reviews.total.toLocaleString()} />
              <Stat label="Velocity / mo" value={`${d.reviews.velocity}`} tone="bad" />
              <Stat label="Response rate" value={`${d.reviews.responseRate}%`} tone="bad" />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Velocity vs. market</span>
                <span className="flex items-center gap-1 text-rose-600">
                  <TrendingDown className="h-4 w-4" /> 3.7× behind
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>You</span>
                    <span>{d.reviews.velocity}/mo</span>
                  </div>
                  <Progress value={(d.reviews.velocity / d.reviews.marketVelocity) * 100} tone="bg-rose-500" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Market median</span>
                    <span>{d.reviews.marketVelocity}/mo</span>
                  </div>
                  <Progress value={100} tone="bg-slate-400" />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm text-slate-600">Sentiment</div>
              <DonutChart data={d.reviews.sentiment} height={180} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor trust + authority */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Trust Analysis</CardTitle>
            <CardDescription>Reviews, velocity and authority vs. the field.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-medium">Competitor</th>
                    <th className="py-2 font-medium">Reviews</th>
                    <th className="py-2 font-medium">Vel.</th>
                    <th className="py-2 font-medium">Auth.</th>
                  </tr>
                </thead>
                <tbody>
                  {d.competitors.map((c) => {
                    const you = c.name.includes("you");
                    return (
                      <tr key={c.name} className="border-t border-[var(--border)]">
                        <td className="py-2.5 font-medium text-slate-800">
                          {c.name}
                          {you && <Badge variant="accent" className="ml-2">You</Badge>}
                        </td>
                        <td className="py-2.5 text-slate-600">{c.reviews.toLocaleString()}</td>
                        <td className="py-2.5 text-slate-600">{c.velocity}/mo</td>
                        <td className="py-2.5 text-slate-600">{c.authority}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Authority &amp; Entities</CardTitle>
            <CardDescription>Referring domains and link sources.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <Stat label="Referring domains" value={`${d.authority.referringDomains}`} tone="bad" />
              <Stat label="Market median" value={`${d.authority.marketMedian}`} />
            </div>
            <ul className="space-y-2.5">
              {d.authority.sources.map((s) => (
                <li key={s.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-medium text-slate-800">{s.value}</span>
                  </div>
                  <Progress value={(s.value / d.authority.marketMedian) * 100} tone="bg-accent-400" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <AeoPanel />

      {/* Diagnostic summary + roadmap */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-accent-200">
          <CardHeader>
            <CardTitle>Diagnostic Summary</CardTitle>
            <CardDescription>The root cause behind the numbers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">{diagnosis.primary.title}</span>
              <Badge variant="bad">High impact</Badge>
            </div>
            <div className="mt-3">
              <Progress value={diagnosis.primary.confidence} tone="bg-accent-500" />
              <div className="mt-1 text-xs text-slate-400">{diagnosis.primary.confidence}% confidence</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roadmap</CardTitle>
            <CardDescription>Next moves, in order.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5">
              {["Launch review-request automation", "Fix NAP across 9 citations", "Publish 6 service pages", "Stand up AEO foundation"].map((r, i) => (
                <li key={r} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-xs font-semibold text-accent-600">
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  tone?: "bad";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mt-0.5 flex items-center gap-1.5 text-xl font-semibold ${tone === "bad" ? "text-rose-600" : "text-slate-900"}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}
