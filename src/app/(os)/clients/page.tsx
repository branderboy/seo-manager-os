import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search, MapPin, Cloud, Building2, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { clients } from "@/lib/crm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Clients" };

const modelIcon = { Local: MapPin, SaaS: Cloud, Enterprise: Building2 } as const;
const dashHref = { Local: "/dashboards/local", SaaS: "/dashboards/saas", Enterprise: "/dashboards/enterprise" } as const;
const statusVariant = { Active: "good", Onboarding: "accent", Paused: "warn" } as const;

export default function ClientsPage() {
  const active = clients.filter((c) => c.status === "Active").length;
  const avgHealth = Math.round(clients.reduce((s, c) => s + c.health, 0) / clients.length);

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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-slate-500">Total clients</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{clients.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">Active</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{active}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">Avg. health score</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{avgHealth}</div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search clients…"
            className="h-9 w-64 rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
          />
        </div>
        <span className="text-sm text-slate-400">Sorted by health</span>
      </div>

      {/* Client table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-3 py-3 font-medium">Model</th>
                <th className="px-3 py-3 font-medium">Owner</th>
                <th className="px-3 py-3 font-medium">Health</th>
                <th className="px-3 py-3 font-medium">AI</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {[...clients]
                .sort((a, b) => b.health - a.health)
                .map((c) => {
                  const Icon = modelIcon[c.model];
                  return (
                    <tr key={c.id} className="group border-b border-[var(--border)] last:border-0 hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <Link href={dashHref[c.model]} className="flex items-center gap-3">
                          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white", c.color)}>
                            {c.initials}
                          </span>
                          <span>
                            <span className="block font-medium text-slate-800 group-hover:text-accent-600">{c.name}</span>
                            <span className="block text-xs text-slate-400">{c.industry} · {c.location}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Icon className="h-4 w-4 text-slate-400" />
                          {c.model}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{c.owner}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={c.health} />
                          </div>
                          <span className="text-xs font-medium text-slate-500">{c.health}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{c.ai}</td>
                      <td className="px-3 py-3.5">
                        <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={dashHref[c.model]} className="inline-flex text-slate-300 group-hover:text-accent-500">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
