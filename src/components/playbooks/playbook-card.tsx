"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  MousePointerClick,
  Magnet,
  DollarSign,
  MapPin,
  Globe,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTaskStore } from "@/components/tasks/task-store";
import type { Playbook } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  traffic: TrendingUp,
  ctr: MousePointerClick,
  lead: Magnet,
  revenue: DollarSign,
  local: MapPin,
  geo: Globe,
  aeo: Bot,
};

export function PlaybookCard({ pb }: { pb: Playbook }) {
  const { addPlaybook, addedPlaybooks } = useTaskStore();
  const added = addedPlaybooks.includes(pb.key);
  const Icon = ICONS[pb.key] ?? TrendingUp;

  return (
    <Card className="flex flex-col p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-border-hover">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{pb.name}</h3>
          <p className="text-sm text-slate-700">{pb.goal}</p>
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-600">{pb.plays.length} plays</span>
      </div>

      {/* The plays inside this playbook */}
      <ul className="mt-4 flex flex-1 flex-wrap gap-1.5">
        {pb.plays.map((play) => (
          <li
            key={play}
            className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]"
          >
            {play}
          </li>
        ))}
      </ul>

      {/* Action · turns the plays into Daily Tasks */}
      <div className="mt-4 border-t border-[var(--border)] pt-4">
        {added ? (
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <Check className="h-4 w-4" /> {pb.plays.length} tasks added · view in Daily Tasks
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            onClick={() => addPlaybook(pb)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            <Sparkles className="h-4 w-4" /> Generate {pb.plays.length} tasks
          </button>
        )}
      </div>
    </Card>
  );
}
