import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { STAGES } from "@/lib/stages";

/** Bold "what to do next" bar that advances the pipeline to the following stage. */
export function NextStep({ from, label, cta }: { from: number; label?: string; cta?: string }) {
  const next = STAGES.find((s) => s.n === from + 1);
  if (!next) return null;
  const Icon = next.icon;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-accent-200 bg-accent-50/60 p-4 sm:px-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white shadow-soft">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
            Next · Stage {next.n}
          </div>
          <div className="text-sm font-semibold text-slate-900">{label ?? next.name}</div>
        </div>
      </div>
      <ButtonLink href={`/${next.slug}`} size="lg">
        {cta ?? `Continue to ${next.short}`} <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    </div>
  );
}
