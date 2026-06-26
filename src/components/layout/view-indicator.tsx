"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEngagement } from "@/components/engagement/store";
import { StatusDot } from "@/components/ui/badge";
import { clientById, type Client } from "@/lib/model";
import { cn } from "@/lib/utils";

// Each client-dashboard route belongs to a real client.
const DASHBOARD_CLIENT: Record<string, string> = {
  local: "northwind",
  saas: "flowdesk",
  enterprise: "vantage",
};

/**
 * Client ⇆ Main view switcher. The top-right is the context "key": it always
 * names the client whose data you're looking at (with its SEO model tag) when
 * you're inside a client profile or a client dashboard, and switches to the
 * agency-wide "Main view" otherwise.
 */
export function ViewIndicator() {
  const pathname = usePathname();
  const { engagement } = useEngagement();

  // Resolve the client the *current page* is about (profile or dashboard).
  let pageClient: Client | undefined;
  if (pathname.startsWith("/clients/")) {
    pageClient = clientById(pathname.split("/")[2] ?? "");
  } else if (pathname.startsWith("/dashboards/")) {
    pageClient = clientById(DASHBOARD_CLIENT[pathname.split("/")[2] ?? ""] ?? "");
  }
  const onClient = Boolean(pageClient);

  // On agency-wide pages, fall back to the pinned engagement client so the chip
  // still works as a one-click switch back into client context.
  const client = pageClient ?? (engagement.clientId ? clientById(engagement.clientId) : undefined);
  const name = client?.name ?? engagement.business;
  const model = client?.model ?? engagement.model;
  const color = client?.color ?? "bg-accent-500";
  const initials =
    client?.initials ??
    engagement.business.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const clientHref = client ? `/clients/${client.id}` : "/clients";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-3)] p-1 shadow-card">
      <Link
        href={clientHref}
        className={cn(
          "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-colors",
          onClient ? "bg-[var(--surface)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
        )}
      >
        <StatusDot tone="good" pulse />
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white", color)}>
          {initials}
        </span>
        <span className={cn("font-semibold", onClient ? "text-[var(--foreground)]" : "")}>{name}</span>
        <span className={cn(
          "rounded px-1.5 py-0.5 text-2xs font-bold uppercase tracking-[0.04em]",
          onClient ? "bg-[var(--accent-tint)] text-accent-700" : "bg-[var(--border)] text-[var(--muted)]"
        )}>
          {model} SEO
        </span>
      </Link>

      <Link
        href="/command"
        className={cn(
          "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          !onClient ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
        )}
      >
        Main view
      </Link>
    </div>
  );
}
