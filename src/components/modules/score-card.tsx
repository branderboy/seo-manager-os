import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ScoreCard({
  label,
  value,
  delta,
  blurb,
}: {
  label: string;
  value: number;
  delta?: number;
  blurb?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {typeof delta === "number" && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              up ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {up ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-3">
        <Progress value={value} />
      </div>
      {blurb && <p className="mt-2.5 text-xs leading-relaxed text-slate-500">{blurb}</p>}
    </Card>
  );
}
