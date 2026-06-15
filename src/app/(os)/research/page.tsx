import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { researchPlans, account } from "@/lib/data";
import type { SeoModel, ResearchItem } from "@/lib/data";

export const metadata: Metadata = { title: "Research Engine" };

function Plan({ items }: { items: ResearchItem[] }) {
  const total = items.reduce((s, i) => s + i.signals, 0);
  const done = items.filter((i) => i.status === "Complete").length;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
        <span>
          <strong className="text-slate-800">{items.length}</strong> research areas
        </span>
        <span>
          <strong className="text-slate-800">{total}</strong> planned signals
        </span>
        <span>
          <strong className="text-slate-800">{done}</strong> complete
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <Card key={item.name} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{item.detail}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Badge variant="outline">{item.signals} signals</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const models: SeoModel[] = ["Local", "SaaS", "Enterprise"];
  return (
    <>
      <PageHeader
        stage={2}
        title="Research Engine"
        badge={`${account.model} playbook active`}
        description="From the classification, the OS assembles the research plan automatically — the exact signals to gather before forming any opinion."
      />
      <Tabs
        initial={account.model}
        tabs={models.map((m) => ({
          id: m,
          label: `${m} SEO`,
          count: researchPlans[m].length,
          content: <Plan items={researchPlans[m]} />,
        }))}
      />
    </>
  );
}
