import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PlaybookCard } from "@/components/playbooks/playbook-card";
import { playbooks } from "@/lib/data";

export const metadata: Metadata = { title: "Playbooks" };

export default function PlaybooksPage() {
  const totalPlays = playbooks.reduce((n, p) => n + p.plays.length, 0);
  return (
    <>
      <PageHeader
        stage={6}
        title="Playbooks"
        description="The action center. Each playbook groups the plays that move one outcome — traffic, clicks, leads, revenue, local, GEO or AEO. Generate a playbook and its plays become tasks in the Daily Task Engine."
      >
        <span className="rounded-full bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700">
          {playbooks.length} playbooks · {totalPlays} plays
        </span>
      </PageHeader>

      {/* How it fits the pipeline — removes the "what is this stage?" confusion */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-slate-600">
        <span className="font-medium text-slate-700">How it works</span>
        <span className="text-slate-300">·</span>
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Pick a playbook</span>
        <ArrowRight className="h-4 w-4 text-slate-500" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Generate tasks</span>
        <ArrowRight className="h-4 w-4 text-slate-500" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-accent-700 ring-1 ring-inset ring-accent-200">Recommended Actions → Daily Task Engine</span>
      </div>

      <div className="stagger grid gap-4 lg:grid-cols-2">
        {playbooks.map((pb) => (
          <PlaybookCard key={pb.key} pb={pb} />
        ))}
      </div>
    </>
  );
}
