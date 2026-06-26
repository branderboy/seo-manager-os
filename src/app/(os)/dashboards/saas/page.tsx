import type { Metadata } from "next";
import { Check, X, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Section, RootCause } from "@/components/dashboard/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatTile, StatRow } from "@/components/ui/metric";
import { saasDashboard as d } from "@/lib/dashboards";

export const metadata: Metadata = { title: "SaaS SEO Dashboard" };

const ROADMAP = [
  "Publish 3 missing comparison pages",
  "Rebuild thin use-case pages",
  "Scale programmatic integration pages",
  "Win the trial-CTA conversion gap",
];

const statusBadge = { Ranking: "good", Thin: "warn", Missing: "bad" } as const;

export default function SaasDashboard() {
  const missingComparisons = d.comparisons.filter((c) => !c.hasPage);

  return (
    <div className="space-y-8">
      <DashboardHeader
        active="saas"
        account={d.account}
        market={d.market}
        scores={[
          { label: "Visibility", value: d.scores.visibility },
          { label: "Authority", value: d.scores.authority },
          { label: "Conversion", value: d.scores.conversion },
          { label: "AI", value: d.scores.ai },
        ]}
      />

      {/* Read first */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="text-sm font-semibold text-[var(--foreground)]">Executive Summary</div>
          <p className="mt-2 text-base leading-relaxed text-[var(--ink-soft)]">
            Flowdesk ranks well top-of-funnel but leaks demand where it converts. The bottom-funnel
            pages that win trials — comparisons, use cases and solutions — are thin or missing, so
            high-intent “vs” searches go to competitors. Closing the comparison gap is the fastest
            path to qualified signups.
          </p>
        </Card>
        <RootCause title="Thin bottom-funnel coverage" confidence={81} impact="High impact" />
      </div>

      {/* Acquisition funnel */}
      <Section label="Organic acquisition">
        <Card className="p-6">
          <div className="text-sm font-semibold text-[var(--foreground)]">Organic → signup funnel</div>
          <p className="mt-0.5 text-sm text-[var(--muted)]">Where organic visitors drop off on the way to a trial.</p>
          <ul className="mt-4 space-y-3">
            {d.funnel.map((f) => (
              <li key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">{f.stage}</span>
                  <span className="font-semibold tnum text-[var(--foreground)]">{f.value}%</span>
                </div>
                <Progress value={f.value} tone="bg-accent-500" />
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* Bottom-funnel coverage */}
      <Section label="Bottom-funnel coverage">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="border-b border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]">Money pages</div>
            <ul className="divide-y divide-[var(--border)]">
              {d.bofu.map((b) => (
                <li key={b.page} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{b.page}</div>
                    <div className="text-xs text-[var(--muted)]">{b.rank ? `Ranks #${b.rank}` : "Not ranking"} · {b.coverage}% complete</div>
                  </div>
                  <Badge variant={statusBadge[b.status as keyof typeof statusBadge]}>{b.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
              <span className="text-sm font-semibold text-[var(--foreground)]">Comparison (“vs”) demand</span>
              <Badge variant="bad">{missingComparisons.length} pages missing</Badge>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {d.comparisons.map((c) => (
                <li key={c.term} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">{c.term}</div>
                    <div className="text-xs text-[var(--muted)]">{c.volume.toLocaleString()} searches/mo · difficulty {c.difficulty}</div>
                  </div>
                  {c.hasPage ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ok)]"><Check className="h-4 w-4" /> Have page</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--danger)]"><X className="h-4 w-4" /> Gap</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Scale */}
      <Section label="Programmatic scale">
        <StatRow cols={3}>
          <StatTile label="Integration pages live" value={`${d.integrations.live}/${d.integrations.catalog}`} sub={`${d.integrations.ranking} ranking`} tone="accent" />
          <StatTile label="Programmatic pages built" value={d.programmatic.built} sub={`of ${d.programmatic.opportunity} opportunity`} />
          <StatTile label="Intent-backed opportunities" value={d.programmatic.intentBacked} tone="good" sub="worth building" />
        </StatRow>
      </Section>

      {/* Roadmap */}
      <Section label="Roadmap">
        <Card className="p-5">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((r, i) => (
              <li key={r} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-white">{i + 1}</span>
                <span className="text-sm font-medium text-[var(--ink-soft)]">{r}</span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>
    </div>
  );
}
