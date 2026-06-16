import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScoreCard } from "@/components/modules/score-card";
import { AeoPanel } from "@/components/modules/aeo-panel";
import { TrendChart } from "@/components/charts/charts";
import { Badge } from "@/components/ui/badge";
import { EngName } from "@/components/engagement/eng";
import { ReportShare } from "@/components/reports/report-share";
import { coreScores, trend } from "@/lib/data";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        stage={8}
        title="Reports"
        description="Track results against the goals set in Discovery — rankings, traffic, leads, calls, AI visibility and revenue — then approve and share the performance report."
      >
        <Badge variant="accent">
          <EngName />
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {coreScores.map((s) => (
          <ScoreCard key={s.key} label={s.label} value={s.value} delta={s.delta} blurb={s.blurb} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score trajectory</CardTitle>
          <CardDescription>Six-month trend across the core intelligence scores.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            data={trend}
            keys={[
              { key: "visibility", label: "Visibility", color: "#635bff" },
              { key: "authority", label: "Authority", color: "#10b981" },
              { key: "trust", label: "Trust", color: "#f59e0b" },
              { key: "ai", label: "AI Visibility", color: "#f43f5e" },
            ]}
          />
        </CardContent>
      </Card>

      <ReportShare />

      <AeoPanel />
    </>
  );
}
