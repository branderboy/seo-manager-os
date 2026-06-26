import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CompetitiveView } from "@/components/stages/competitive-view";

export const metadata: Metadata = { title: "Competitive Insights" };

export default function CompetitorsPage() {
  return (
    <>
      <PageHeader
        stage={4}
        title="Competitive Insights"
        badge="Market intelligence"
        description="Read the field before diagnosing your own gaps · who's winning the SERP and AI answers, where share of voice sits, and which lanes are open. Adapts to the client's market."
      />
      <CompetitiveView />
    </>
  );
}
