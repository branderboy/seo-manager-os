import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AgentsView } from "@/components/agents/agents-view";

export const metadata: Metadata = { title: "AI Workforce" };

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        title="AI Workforce"
        description="Your digital SEO team. The Orchestrator runs the floor; specialists pick up assignments, work the pipeline, and report back. Deploy and manage them like employees."
      />
      <AgentsView />
    </>
  );
}
