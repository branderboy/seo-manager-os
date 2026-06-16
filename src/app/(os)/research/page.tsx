import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ModelBadge } from "@/components/engagement/eng";
import { ActiveResearchPlan } from "@/components/engagement/active-research-plan";

export const metadata: Metadata = { title: "Data Collection" };

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        stage={2}
        title="Data Collection"
        description="From the classification, the OS assembles the research plan automatically — the exact signals to gather for this client before forming any opinion."
      >
        <ModelBadge suffix="playbook active" />
      </PageHeader>
      <ActiveResearchPlan />
    </>
  );
}
