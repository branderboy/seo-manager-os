import { ArrowDownRight, ArrowUpRight, Link2, Quote, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendChart, DonutChart } from "@/components/charts/charts";
import {
  aiAssistants,
  aiShareOfVoice,
  aiMentionTrend,
  aiPrompts,
  type AiAssistant,
  type AiPromptResult,
} from "@/lib/tracker";

export function MentionsView() {
  return (
    <div className="space-y-5">
      {/* Per-assistant mention rates */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {aiAssistants.map((a) => (
          <AssistantCard key={a.id} a={a} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mention Rate vs. Competitor</CardTitle>
            <CardDescription>Share of tracked prompts citing the brand vs. the leading rival.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={aiMentionTrend}
              keys={[
                { key: "brand", label: "Northwind", color: "#635bff" },
                { key: "competitor", label: "Leading rival", color: "#94a3b8" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Share of Voice</CardTitle>
            <CardDescription>Brand vs. tracked competitors in AI answers.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={aiShareOfVoice} height={220} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Prompts</CardTitle>
          <CardDescription>
            Sample of the prompts run against each engine — whether the brand is cited, mentioned or absent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-600">
                  <th className="py-2 font-medium">Prompt</th>
                  <th className="py-2 font-medium">Engine</th>
                  <th className="py-2 font-medium">Result</th>
                  <th className="py-2 font-medium">Competitor cited</th>
                </tr>
              </thead>
              <tbody>
                {aiPrompts.map((p) => (
                  <PromptRow key={p.prompt} p={p} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AssistantCard({ a }: { a: AiAssistant }) {
  const up = a.delta >= 0;
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${a.color}`}>
          {a.initials}
        </span>
        <span className="truncate text-[13px] font-medium text-slate-700">{a.name}</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight text-slate-900">{a.mentionRate}%</span>
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {up ? "+" : ""}
          {a.delta}
        </span>
      </div>
      <div className="mt-2">
        <Progress value={a.mentionRate} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant={a.cited ? "good" : "outline"}>
          <Link2 className="h-3 w-3" />
          {a.cited ? "Cited" : "No link"}
        </Badge>
        <Badge variant={a.sentiment === "Positive" ? "good" : a.sentiment === "Negative" ? "bad" : "default"}>
          {a.sentiment}
        </Badge>
      </div>
    </Card>
  );
}

function PromptRow({ p }: { p: AiPromptResult }) {
  return (
    <tr className="border-t border-[var(--border)]">
      <td className="py-2.5 pr-3 text-slate-700">{p.prompt}</td>
      <td className="py-2.5 text-slate-700">{p.engine}</td>
      <td className="py-2.5">
        {p.status === "Cited" ? (
          <Badge variant="good">
            <Link2 className="h-3 w-3" />
            Cited
          </Badge>
        ) : p.status === "Mentioned" ? (
          <Badge variant="warn">
            <Quote className="h-3 w-3" />
            Mentioned
          </Badge>
        ) : (
          <Badge variant="bad">
            <X className="h-3 w-3" />
            Absent
          </Badge>
        )}
      </td>
      <td className="py-2.5 text-slate-700">
        {p.competitorCited ?? <span className="text-slate-500">—</span>}
      </td>
    </tr>
  );
}
