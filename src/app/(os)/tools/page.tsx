import type { Metadata } from "next";
import {
  ArrowRight,
  TrendingUp,
  MousePointerClick,
  Magnet,
  DollarSign,
  MapPin,
  Globe,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { playbooks } from "@/lib/data";
import type { Playbook } from "@/lib/data";

export const metadata: Metadata = { title: "Playbooks" };

const ICONS: Record<string, LucideIcon> = {
  traffic: TrendingUp,
  ctr: MousePointerClick,
  lead: Magnet,
  revenue: DollarSign,
  local: MapPin,
  geo: Globe,
  aeo: Bot,
};

function PlaybookCard({ pb }: { pb: Playbook }) {
  const Icon = ICONS[pb.key] ?? TrendingUp;
  return (
    <Card className="group flex cursor-pointer flex-col p-5 transition-shadow hover:shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{pb.name}</h3>
          <p className="text-sm text-slate-500">{pb.goal}</p>
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-400">{pb.plays.length} plays</span>
      </div>

      {/* The plays inside this playbook */}
      <ul className="mt-4 flex flex-1 flex-wrap gap-1.5">
        {pb.plays.map((play) => (
          <li
            key={play}
            className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-[var(--border)]"
          >
            {play}
          </li>
        ))}
      </ul>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-600 group-hover:gap-1.5">
        Open playbook <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Card>
  );
}

export default function PlaybooksPage() {
  const totalPlays = playbooks.reduce((n, p) => n + p.plays.length, 0);
  return (
    <>
      <PageHeader
        stage={7}
        title="Playbooks"
        description="The action center. Each playbook groups the plays that move one outcome — traffic, clicks, leads, revenue, local, GEO or AEO. Run a play and it produces recommended actions that flow into the Daily Task Engine."
      >
        <span className="rounded-full bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700">
          {playbooks.length} playbooks · {totalPlays} plays
        </span>
      </PageHeader>

      {/* How it fits the pipeline — removes the "what is this stage?" confusion */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">How it works</span>
        <span className="text-slate-300">·</span>
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Pick a playbook</span>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Run its plays</span>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-accent-700 ring-1 ring-inset ring-accent-200">Recommended Actions → Daily Task Engine</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {playbooks.map((pb) => (
          <PlaybookCard key={pb.key} pb={pb} />
        ))}
      </div>
    </>
  );
}
