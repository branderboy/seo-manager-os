import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DiagnosisView } from "@/components/diagnosis/diagnosis-view";
import { ForecastPanel } from "@/components/flow/forecast-panel";

export const metadata: Metadata = { title: "Insights" };

export default function DiagnosisPage() {
  return (
    <>
      <PageHeader
        stage={5}
        title="Insights"
        description="The root cause and the prioritized fixes: what to do first for this client. These insights adapt to the client's SEO type."
      />
      <DiagnosisView />
      <ForecastPanel />
    </>
  );
}
