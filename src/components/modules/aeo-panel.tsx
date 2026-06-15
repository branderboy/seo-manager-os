import { Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { Progress } from "@/components/ui/progress";
import { aeo } from "@/lib/data";

/** AEO (Answer Engine Optimization) module — shown in every dashboard. */
export function AeoPanel() {
  return (
    <Card>
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4 lg:w-64 lg:flex-col lg:items-start">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
                AI Visibility (AEO)
              </h3>
              <Badge variant="bad">At risk</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Presence across AI Overviews, citations and assistants.
            </p>
          </div>
          <div className="ml-auto lg:ml-0 lg:mt-2">
            <ScoreRing value={aeo.score} label="AEO" />
          </div>
        </div>

        <div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {aeo.metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{m.label}</span>
                <span className="font-semibold text-slate-800">{m.value}</span>
              </div>
              <div className="mt-1.5">
                <Progress value={m.value} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
