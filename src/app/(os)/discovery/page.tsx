import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StartHereCoach } from "@/components/layout/start-here";
import { DiscoveryWizard } from "@/components/discovery/wizard";
import { ClientInvite } from "@/components/discovery/client-invite";
import { DiscoveryDeliverables } from "@/components/stages/discovery-deliverables";

export const metadata: Metadata = { title: "Discovery Interview" };

export default function DiscoveryPage() {
  return (
    <>
      <PageHeader
        stage={1}
        title="Discovery Interview"
        description="A consultant-style intake. Before any audit, the OS learns the business, its model, goals and constraints · then classifies the engagement."
      />
      <StartHereCoach />
      <DiscoveryWizard />
      <ClientInvite />
      <DiscoveryDeliverables />
    </>
  );
}
