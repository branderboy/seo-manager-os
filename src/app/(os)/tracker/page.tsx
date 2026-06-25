import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { EngName } from "@/components/engagement/eng";
import { WorkView } from "@/components/tracker/work-view";
import { RankingsView } from "@/components/tracker/rankings-view";
import { MentionsView } from "@/components/tracker/mentions-view";
import { trackerStats, lastScan } from "@/lib/tracker";

export const metadata: Metadata = { title: "Tracker" };

export default function TrackerPage() {
  return (
    <>
      <PageHeader
        title="Tracker"
        description="Continuous monitoring of search rankings and AI answer visibility — daily rank scans across every market and LLM-mention tracking across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews."
      >
        <Badge variant="accent">
          <EngName />
        </Badge>
        <Badge variant="outline">
          <RefreshCw className="h-3 w-3" />
          {lastScan}
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trackerStats.map((s) => (
          <StatCard key={s.key} label={s.label} value={s.value} delta={s.delta} blurb={s.blurb} />
        ))}
      </div>

      <Tabs
        className="mt-2"
        tabs={[
          { id: "work", label: "Work", content: <WorkView /> },
          { id: "rankings", label: "Search Rankings", content: <RankingsView /> },
          { id: "mentions", label: "AI Mentions", content: <MentionsView /> },
        ]}
      />
    </>
  );
}

function StatCard({
  label,
  value,
  delta,
  blurb,
}: {
  label: string;
  value: string;
  delta: number;
  blurb: string;
}) {
  const up = delta >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            up ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {up ? "+" : ""}
          {delta}
        </span>
      </div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <p className="mt-2.5 text-xs leading-relaxed text-slate-500">{blurb}</p>
    </Card>
  );
}
