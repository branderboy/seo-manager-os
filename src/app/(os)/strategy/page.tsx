import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CarriedFromDiagnosis } from "@/components/flow/carried-from-diagnosis";
import { BriefVersions } from "@/components/flow/brief-versions";
import { BriefShare } from "@/components/flow/brief-share";
import { BriefApproval } from "@/components/flow/brief-approval";
import { StrategyDoc } from "@/components/flow/strategy-doc";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Project Brief" };

export default function StrategyPage() {
  return (
    <>
      <PageHeader
        stage={7}
        title="Project Brief"
        badge="Executive-ready"
        description="A board-ready strategy document, generated for the active client. Everything traces back to a root cause and forward to an expected outcome — and adapts to the client's SEO type."
      >
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      <CarriedFromDiagnosis />
      <BriefVersions />
      <StrategyDoc />
      <BriefApproval />
      <BriefShare />
    </>
  );
}
