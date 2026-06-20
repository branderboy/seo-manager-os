import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaTrend, BarMini } from "@/components/charts/charts";
import {
  rankedKeywords,
  positionBuckets,
  visibilityTrend,
  rankMovers,
  type RankedKeyword,
} from "@/lib/tracker";

export function RankingsView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visibility Index</CardTitle>
            <CardDescription>Volume-weighted share of the SERP across all tracked keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrend data={visibilityTrend} dataKey="visibility" height={220} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Position Distribution</CardTitle>
            <CardDescription>Where the tracked set ranks today.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarMini data={positionBuckets} dataKey="value" labelKey="label" height={220} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tracked Keywords</CardTitle>
            <CardDescription>Daily rank scans · desktop + mobile, localized to each market.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 font-medium">Keyword</th>
                    <th className="py-2 font-medium">Pos.</th>
                    <th className="py-2 font-medium">Change</th>
                    <th className="py-2 font-medium">Best</th>
                    <th className="py-2 font-medium">Volume</th>
                    <th className="py-2 font-medium">SERP</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedKeywords.map((k) => (
                    <KeywordRow key={k.keyword} k={k} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biggest Movers</CardTitle>
            <CardDescription>Since the last scan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {rankMovers.map((m) => {
                const up = m.trend === "up";
                return (
                  <li key={m.keyword} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="truncate text-sm text-slate-700">{m.keyword}</span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 text-xs font-semibold ${
                        up ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                      {m.from} → {m.to}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KeywordRow({ k }: { k: RankedKeyword }) {
  const ranking = k.position > 0;
  const change = ranking && k.previous > 0 ? k.previous - k.position : 0;
  return (
    <tr className="border-t border-[var(--border)] align-top">
      <td className="py-2.5 pr-3">
        <div className="font-medium text-slate-800">{k.keyword}</div>
        <div className="mt-0.5 font-mono text-xs text-slate-400">{k.url}</div>
      </td>
      <td className="py-2.5">
        {ranking ? (
          <span className="font-semibold text-slate-900">{k.position}</span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="py-2.5">
        <ChangeCell change={change} ranking={ranking} />
      </td>
      <td className="py-2.5 text-slate-600">{k.best > 0 ? k.best : "—"}</td>
      <td className="py-2.5 text-slate-600">{k.volume.toLocaleString()}</td>
      <td className="py-2.5">
        <div className="flex flex-wrap gap-1">
          {k.features.length === 0 ? (
            <span className="text-xs text-slate-400">—</span>
          ) : (
            k.features.map((f) => (
              <Badge key={f} variant={f === "AI Overview" ? "accent" : "outline"}>
                {f}
              </Badge>
            ))
          )}
        </div>
      </td>
    </tr>
  );
}

function ChangeCell({ change, ranking }: { change: number; ranking: boolean }) {
  if (!ranking) return <Badge variant="bad">New gap</Badge>;
  if (change === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-400">
        <Minus className="h-3.5 w-3.5" />0
      </span>
    );
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        up ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {Math.abs(change)}
    </span>
  );
}
