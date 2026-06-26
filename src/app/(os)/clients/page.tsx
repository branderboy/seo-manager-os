import type { Metadata } from "next";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatTile, StatRow } from "@/components/ui/metric";
import { TableShell, THead, TH, TBody } from "@/components/ui/data-table";
import { ClientRow } from "@/components/clients/client-row";
import { clients } from "@/lib/model";
import { riskForClient, riskSummary } from "@/lib/risk";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsPage() {
  const active = clients.filter((c) => c.status === "Active").length;
  const sorted = [...clients].sort((a, b) => riskForClient(b).overall - riskForClient(a).overall);

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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
          <input
            placeholder="Search clients…"
            className="h-9 w-72 rounded-md border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm shadow-card outline-none placeholder:text-[var(--faint)] focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
          />
        </div>
        <span className="text-xs text-[var(--muted)]">
          Sorted by <span className="font-medium text-[var(--ink-soft)]">risk, descending</span>
        </span>
      </div>

      {/* Client table */}
      <TableShell className="min-w-full">
        <THead>
          <TH>Client</TH>
          <TH>Model</TH>
          <TH>Owner</TH>
          <TH sortable sortDir="desc">Risk</TH>
          <TH align="right">AI visibility</TH>
          <TH>Status</TH>
          <TH />
        </THead>
        <TBody>
          {sorted.map((c) => (
            <ClientRow key={c.id} client={c} />
          ))}
        </TBody>
      </TableShell>
    </>
  );
}
