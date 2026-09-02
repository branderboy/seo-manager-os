import type { Metadata } from "next";
import { Plus, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatTile, StatRow } from "@/components/ui/metric";
import { ClientTable } from "@/components/clients/client-table";
import { clients } from "@/lib/model";
import { riskSummary } from "@/lib/risk";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsPage() {
  const active = clients.filter((c) => c.status === "Active").length;

  return (
    <>
      <PageHeader
        title="Clients"
        badge={`${clients.length} accounts`}
        description="Every account in one operations view · model, owner, live risk and AI visibility. Open one to enter its workspace."
      >
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add client
        </Button>
      </PageHeader>

      {/* Summary */}
      <StatRow cols={4}>
        <StatTile label="Total clients" value={clients.length} />
        <StatTile label="Active" value={active} tone="good" sub={`${clients.length - active} onboarding / paused`} />
        <StatTile label="Avg. risk" value={riskSummary.avg} tone={riskSummary.avg >= 60 ? "bad" : riskSummary.avg >= 45 ? "warn" : "good"} />
        <StatTile label="High-risk accounts" value={riskSummary.high} tone="bad" sub="need attention" />
      </StatRow>

      <ClientTable clients={clients} />
    </>
  );
}
