"use client";

import { useEngagement } from "@/components/engagement/store";
import { clientById } from "@/lib/model";
import { cn } from "@/lib/utils";

/**
 * Active-client context. Always tells you which client the data you're looking
 * at is linked to, and its SEO model — e.g. "Client: Pro Wash Detail (Local SEO)".
 * Reads the active engagement, which updates whenever you open a client.
 */
export function ViewIndicator() {
  const { engagement } = useEngagement();
  const client = engagement.clientId ? clientById(engagement.clientId) : undefined;
  const initials =
    client?.initials ??
    engagement.business.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-[var(--accent-tint)] px-3 py-1.5 text-sm shadow-card">
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white", client?.color ?? "bg-accent-500")}>
        {initials}
      </span>
      <span className="text-[var(--muted)]">Client:</span>
      <span className="font-semibold text-[var(--accent-ink)]">{engagement.business}</span>
      <span className="text-[var(--muted)]">({engagement.model} SEO)</span>
    </div>
  );
}
