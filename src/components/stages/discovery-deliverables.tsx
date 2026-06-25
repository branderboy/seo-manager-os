"use client";

import { FileText, Target, AlertTriangle, Database, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEngagement } from "@/components/engagement/store";
import { strategyByType } from "@/lib/recommendations";

/** The deliverables the Discovery stage generates for the active client. */
export function DiscoveryDeliverables() {
  const { engagement } = useEngagement();
  const summary = strategyByType[engagement.model].executiveSummary;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Badge variant="accent">{engagement.model} SEO</Badge>
        <span>Generated for {engagement.business} · {engagement.confidence}% classification confidence</span>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-accent-600" /> Client Profile</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <Field label="Business" value={engagement.business} />
            <Field label="Website" value={engagement.website} />
            <Field label="Industry" value={engagement.industry} />
            <Field label="Market" value={engagement.market} />
            <Field label="SEO type" value={`${engagement.model} SEO`} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-accent-600" /> Discovery Summary</CardTitle></CardHeader>
        <CardContent><p className="text-[15px] leading-relaxed text-slate-700">{summary}</p></CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Chips icon={Target} title="Project Goals" items={engagement.goals} />
        <Chips icon={AlertTriangle} title="Problems" items={engagement.problems} />
        <Chips icon={Database} title="Assets" items={engagement.assets} />
        <Chips icon={Users} title="Competitors" items={engagement.competitors} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[var(--border)] py-1.5 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

function Chips({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-slate-500" /> {title}
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i} className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">{i}</li>
        ))}
      </ul>
    </Card>
  );
}
