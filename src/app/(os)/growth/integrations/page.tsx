import type { Metadata } from "next";
import { IntegrationsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Integrations" };

export default function GrowthIntegrationsPage() {
  return <IntegrationsScreen />;
}
