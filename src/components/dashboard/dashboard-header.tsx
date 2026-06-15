import Link from "next/link";
import { MapPin, Cloud, Building2 } from "lucide-react";
import { DASHBOARDS } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/ui/score-ring";

const icons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

export function DashboardHeader({
  active,
  account,
  market,
  scores,
}: {
  active: "local" | "saas" | "enterprise";
  account: string;
  market: string;
  scores: { label: string; value: number }[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {DASHBOARDS.map((d) => {
          const Icon = icons[d.slug];
          const on = d.slug === active;
          return (
            <Link
              key={d.slug}
              href={`/dashboards/${d.slug}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                on
                  ? "border-accent-500 bg-transparent text-accent-700 ring-1 ring-accent-500"
                  : "border-[var(--border)] bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {d.name}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-soft">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{account}</h1>
          <p className="mt-1 text-sm text-slate-500">{market}</p>
        </div>
        <div className="flex flex-wrap gap-6">
          {scores.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <ScoreRing value={s.value} size={64} />
              <span className="mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
