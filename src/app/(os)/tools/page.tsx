import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelTabs } from "@/components/engagement/model-tabs";
import { ModelBadge } from "@/components/engagement/eng";
import { executionTools } from "@/lib/data";
import type { SeoModel } from "@/lib/data";

export const metadata: Metadata = { title: "Execution Tools" };

function ToolGrid({ tools, model }: { tools: { name: string; blurb: string }[]; model: SeoModel }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <Card key={t.name} className="group cursor-pointer p-5 transition-shadow hover:shadow-card">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{t.name}</h3>
            <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-accent-500" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{t.blurb}</p>
          <div className="mt-4">
            <Badge variant="outline">{model} tool</Badge>
          </div>
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
        title="Execution Tools"
        description="Purpose-built planners that turn each recommendation into structured work. Every SEO model gets its own toolkit, plus a shared AEO planner."
      >
        <ModelBadge suffix="tools featured" />
      </PageHeader>
      <ModelTabs
        tabs={models.map((m) => ({
          id: m,
          label: `${m} SEO`,
          count: executionTools[m].length,
          content: <ToolGrid tools={executionTools[m]} model={m} />,
        }))}
      />
    </>
  );
}
