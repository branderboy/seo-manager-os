import type { Metadata } from "next";
import {
  CheckCircle2,
  Search,
  TrendingUp,
  Wrench,
  FileText,
  Star,
  Rocket,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { winGroups, type WinKind } from "@/lib/wins";

export const metadata: Metadata = { title: "Wins" };

const kindIcon: Record<WinKind, typeof Search> = {
  Index: Search,
  Rank: TrendingUp,
  Technical: Wrench,
  Content: FileText,
  Review: Star,
  Deploy: Rocket,
  Traffic: Activity,
};

export default function WinsPage() {
  return (
    <>
      <PageHeader title="Wins" description="Momentum across the portfolio — what moved, indexed, ranked, passed and shipped." />

      <div className="space-y-6">
        {winGroups.map(
          (g) =>
            g.items.length > 0 && (
              <section key={g.group}>
                <h2 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {g.group}
                </h2>
                <Card>
                  <ul className="divide-y divide-[var(--border)]">
                    {g.items.map((w) => {
                      const Icon = kindIcon[w.kind];
                      return (
                        <li key={w.id} className="flex items-start gap-3 px-5 py-3.5">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-800">{w.text}</div>
                            <div className="mt-0.5 text-sm text-slate-500">
                              {w.client} · {w.when}
                            </div>
                          </div>
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </section>
            )
        )}
      </div>
    </>
  );
}
