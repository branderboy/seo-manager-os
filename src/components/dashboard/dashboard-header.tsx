import { MapPin, Cloud, Building2 } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";

const TAG = {
  local: { label: "Local SEO", icon: MapPin },
  saas: { label: "SaaS SEO", icon: Cloud },
  enterprise: { label: "Enterprise SEO", icon: Building2 },
} as const;

/**
 * A client dashboard is a single company in a single SEO category. It shows that
 * company with its own category tag only — no cross-category switcher.
 */
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
  const tag = TAG[active];
  const Icon = tag.icon;

  return (
    <div className="reveal">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-soft">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent-500 px-3 py-1 text-xs font-semibold text-accent-700 ring-1 ring-accent-500">
            <Icon className="h-3.5 w-3.5" />
            {tag.label}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{account}</h1>
          <p className="mt-1 text-sm text-slate-700">{market}</p>
        </div>
        <div className="flex flex-wrap gap-6">
          {scores.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <ScoreRing value={s.value} size={64} />
              <span className="mt-1.5 font-mono text-xs font-medium uppercase tracking-wide text-slate-600">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
