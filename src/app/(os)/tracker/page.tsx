import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { StatTile, StatRow } from "@/components/ui/metric";
import { EngName } from "@/components/engagement/eng";
import { WorkView } from "@/components/tracker/work-view";
import { RankingsView } from "@/components/tracker/rankings-view";
import { MentionsView } from "@/components/tracker/mentions-view";
import { trackerStats, lastScan } from "@/lib/tracker";

export const metadata: Metadata = { title: "Operations Tracker" };

export default function TrackerPage() {
  return (
    <>
      <PageHeader
        title="Operations Tracker"
        description="The agency's live operations center — project work, rankings and AI-answer visibility. Daily rank scans across every market plus LLM-mention tracking across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews."
      >
        <Badge variant="accent">
          <EngName />
        </Badge>
        <Badge variant="outline">
          <RefreshCw className="h-3 w-3" />
          {lastScan}
        </Badge>
      </PageHeader>

      <StatRow cols={4}>
        {trackerStats.map((s) => (
          <StatTile
            key={s.key}
            label={s.label}
            value={s.value}
            sub={s.blurb}
            delta={{ value: `${Math.abs(s.delta)}`, direction: s.delta >= 0 ? "up" : "down", good: s.delta >= 0 }}
          />
        ))}
      </StatRow>

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
