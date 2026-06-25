import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DiagnosisView } from "@/components/diagnosis/diagnosis-view";
import { ForecastPanel } from "@/components/flow/forecast-panel";

export const metadata: Metadata = { title: "Diagnosis" };

export default function DiagnosisPage() {
  return (
    <>
      <PageHeader
        stage={5}
        title="Diagnosis"
        description="Root cause and the prioritized fixes — what to do first for this client. The diagnosis adapts to the client's SEO type."
      />
      <DiagnosisView />
      <ForecastPanel />
    </>
  );
}
