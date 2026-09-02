"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Cloud, Building2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { type Client } from "@/lib/model";
import { riskForClient, riskTone, riskBadge } from "@/lib/risk";
import { engagementFromClient, useEngagement } from "@/components/engagement/store";

const modelIcon = { Local: MapPin, SaaS: Cloud, Enterprise: Building2 } as const;
const statusVariant = { Active: "good", Onboarding: "accent", Paused: "warn" } as const;

export function ClientRow({ client: c }: { client: Client }) {
  const { setEngagement } = useEngagement();
  const router = useRouter();
  const Icon = modelIcon[c.model];
  const risk = riskForClient(c);

  // Selecting a client makes it the active engagement, then opens its record.
  const open = () => {
    setEngagement(engagementFromClient(c));
    router.push(`/clients/${c.id}`);
  };

  return (
    // The row is a mouse convenience. The client name is the real link, so the record is
    // reachable by keyboard and by screen reader, and can be opened in a new tab.
    <tr onClick={open} className="group cursor-pointer transition-colors hover:bg-[var(--surface-2)]">
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white", c.color)}>
            {c.initials}
          </span>
          <span className="min-w-0">
            <Link
              href={`/clients/${c.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setEngagement(engagementFromClient(c));
              }}
              className="block truncate text-sm font-medium text-[var(--foreground)] group-hover:text-accent-600"
            >
              {c.name}
            </Link>
            <span className="block truncate text-xs text-[var(--muted)]">
              {c.industry} · {c.location}
            </span>
          </span>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
          <Icon className="h-4 w-4 text-[var(--muted)]" />
          {c.model}
        </span>
      </td>
      <td className="px-3 py-3 text-sm text-[var(--ink-soft)]">{c.owner}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16">
            <Progress value={risk.overall} tone={riskTone(risk.overall)} />
          </div>
          <Badge variant={riskBadge(risk.level)}>{risk.overall}</Badge>
        </div>
      </td>
      <td className="px-3 py-3 text-right text-sm font-medium tnum text-[var(--ink-soft)]">{c.scores.ai}</td>
      <td className="px-3 py-3">
        <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
      </td>
      <td className="py-3 pl-3 pr-4 text-right">
        <ChevronRight className="ml-auto h-4 w-4 text-[var(--faint)] transition-colors group-hover:text-accent-600" />
      </td>
    </tr>
  );
}
