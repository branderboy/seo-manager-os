import type { Metadata } from "next";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientRow } from "@/components/clients/client-row";
import { clients } from "@/lib/model";
import { riskForClient, riskSummary } from "@/lib/risk";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsPage() {
  const active = clients.filter((c) => c.status === "Active").length;

  return (
    <>
      <PageHeader
        title="Clients"
        badge={`${clients.length} accounts`}
        description="Every client account in one list — model, owner and live search health. Open one to jump into its dashboard."
      >
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add client
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="stagger grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-slate-600">Total clients</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{clients.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-600">Active</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{active}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-600">Avg. risk</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{riskSummary.avg}</div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search clients…"
            className="h-9 w-64 rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
          />
        </div>
        <span className="text-sm text-slate-500">Sorted by risk</span>
      </div>

      {/* Client table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-3 py-3 font-medium">Model</th>
                <th className="px-3 py-3 font-medium">Owner</th>
                <th className="px-3 py-3 font-medium">Risk</th>
                <th className="px-3 py-3 font-medium">AI</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {[...clients]
                .sort((a, b) => riskForClient(b).overall - riskForClient(a).overall)
                .map((c) => (
                  <ClientRow key={c.id} client={c} />
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
