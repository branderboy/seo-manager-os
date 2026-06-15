import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { scoreToneClasses } from "@/lib/utils";
import { investigations, account } from "@/lib/data";
import type { SeoModel, Audit } from "@/lib/data";

export const metadata: Metadata = { title: "Investigation" };

function AuditList({ audits }: { audits: Audit[] }) {
  const avg = Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length);
  return (
    <div>
      <Card className="mb-5 flex items-center justify-between p-4">
        <div>
          <div className="text-sm font-medium text-slate-700">Investigation health</div>
          <div className="text-xs text-slate-400">{audits.length} audits in this track</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold ring-1 ring-inset ${scoreToneClasses(avg)}`}>
          {avg}
        </div>
      </Card>
      <div className="space-y-3">
        {audits.map((a) => (
          <Card key={a.name} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-slate-900">{a.name}</h3>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {a.finding}
                </p>
              </div>
              <div className="w-40 shrink-0">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Score</span>
                  <span className="font-semibold text-slate-700">{a.score}</span>
                </div>
                <Progress value={a.score} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function InvestigationPage() {
  const models: SeoModel[] = ["Local", "SaaS", "Enterprise"];
  return (
    <>
      <PageHeader
        stage={3}
        title="Investigation"
        badge={`${account.model} track`}
        description="Where the audits run. Each surfaces the evidence behind a symptom — scored, with the single most important finding called out."
      />
      <Tabs
        initial={account.model}
        tabs={models.map((m) => ({
          id: m,
          label: `${m} SEO`,
          count: investigations[m].length,
          content: <AuditList audits={investigations[m]} />,
        }))}
      />
    </>
  );
}
