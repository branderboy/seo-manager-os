import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelTabs } from "@/components/engagement/model-tabs";
import { ModelBadge } from "@/components/engagement/eng";
import { executionTools } from "@/lib/data";
import type { SeoModel } from "@/lib/data";

export const metadata: Metadata = { title: "Execution Playbooks" };

function PlaybookGrid({ playbooks, model }: { playbooks: { name: string; blurb: string }[]; model: SeoModel }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playbooks.map((p) => (
        <Card key={p.name} className="group flex cursor-pointer flex-col p-5 transition-shadow hover:shadow-card">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
            <Badge variant="outline">{model}</Badge>
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{p.blurb}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-600 group-hover:gap-1.5">
            Open playbook <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Card>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  const models: SeoModel[] = ["Local", "SaaS", "Enterprise"];
  return (
    <>
      <PageHeader
        stage={7}
        title="Execution Playbooks"
        description="A playbook takes one recommendation from the strategy and expands it into sequenced steps with owners — ready-to-run work. Each SEO model has its own set; the AEO playbook is shared."
      >
        <ModelBadge suffix="playbooks featured" />
      </PageHeader>

      {/* How it fits the pipeline — removes the "what is this stage?" confusion */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">How it works</span>
        <span className="text-slate-300">·</span>
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Strategy recommendation</span>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-accent-700 ring-1 ring-inset ring-accent-200">Run a playbook</span>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">Sequenced tasks → Daily Task Engine</span>
      </div>

      <ModelTabs
        tabs={models.map((m) => ({
          id: m,
          label: `${m} SEO`,
          count: executionTools[m].length,
          content: <PlaybookGrid playbooks={executionTools[m]} model={m} />,
        }))}
      />
    </>
  );
}
