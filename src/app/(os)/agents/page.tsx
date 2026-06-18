import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AgentsView } from "@/components/agents/agents-view";

export const metadata: Metadata = { title: "Agent Store" };

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        title="Agent Store"
        description="Deploy the agent fleet. One Orchestrator runs the engagement; eight specialists do the work and report back. Deploy them here, or from each pipeline stage."
      />
      <AgentsView />
    </>
  );
}
