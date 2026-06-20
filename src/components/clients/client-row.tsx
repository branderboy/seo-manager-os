"use client";

import { useRouter } from "next/navigation";
import { MapPin, Cloud, Building2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { clientHealth, type Client } from "@/lib/model";
import { engagementFromClient, useEngagement } from "@/components/engagement/store";

const modelIcon = { Local: MapPin, SaaS: Cloud, Enterprise: Building2 } as const;
// Local-only OS — every client opens the Local SEO dashboard.
const dashHref = { Local: "/dashboards/local", SaaS: "/dashboards/local", Enterprise: "/dashboards/local" } as const;
const statusVariant = { Active: "good", Onboarding: "accent", Paused: "warn" } as const;

export function ClientRow({ client: c }: { client: Client }) {
  const { setEngagement } = useEngagement();
  const router = useRouter();
  const Icon = modelIcon[c.model];
  const health = clientHealth(c);

  // Selecting a client makes it the active engagement, then opens its dashboard.
  const open = () => {
    setEngagement(engagementFromClient(c));
    router.push(dashHref[c.model]);
  };

  return (
    <tr
      onClick={open}
      className="group cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-slate-50/60"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white", c.color)}>
            {c.initials}
          </span>
          <span>
            <span className="block font-medium text-slate-800 group-hover:text-accent-600">{c.name}</span>
            <span className="block text-xs text-slate-500">{c.industry} · {c.location}</span>
          </span>
        </div>
      </td>
      <td className="px-3 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <Icon className="h-4 w-4 text-slate-500" />
          {c.model}
        </span>
      </td>
      <td className="px-3 py-3.5 text-slate-600">{c.owner}</td>
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16">
            <Progress value={health} />
          </div>
          <span className="text-xs font-medium text-slate-600">{health}</span>
        </div>
      </td>
      <td className="px-3 py-3.5 text-slate-600">{c.scores.ai}</td>
      <td className="px-3 py-3.5">
        <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
      </td>
      <td className="px-5 py-3.5 text-right">
        <ChevronRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-accent-500" />
      </td>
    </tr>
  );
}
