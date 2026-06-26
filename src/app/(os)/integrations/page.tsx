import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { IntegrationsView } from "@/components/integrations/integrations-view";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        badge="Connections"
        description="Connect the data sources that power every stage · search, analytics, reviews, CRM and the channels that deliver your daily alerts."
      />
      <IntegrationsView />
    </>
  );
}
