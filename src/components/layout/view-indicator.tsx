"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEngagement } from "@/components/engagement/store";
import { clientById } from "@/lib/model";
import { cn } from "@/lib/utils";

/**
 * Client ⇆ Main view switcher. Always shows which client the data is linked to
 * (with its SEO model tag) on one side, and the agency-wide "Main view" on the
 * other — highlighting whichever you're currently in.
 */
export function ViewIndicator() {
  const pathname = usePathname();
  const { engagement } = useEngagement();
  const client = engagement.clientId ? clientById(engagement.clientId) : undefined;
  const initials =
    client?.initials ??
    engagement.business.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const clientHref = client ? `/clients/${client.id}` : "/clients";
  const onClient = pathname.startsWith("/clients/");

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-3)] p-1 shadow-card">
      <Link
        href={clientHref}
        className={cn(
          "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-colors",
          onClient ? "bg-[var(--surface)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
        )}
      >
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white", client?.color ?? "bg-accent-500")}>
          {initials}
        </span>
        <span className={cn("font-semibold", onClient ? "text-[var(--foreground)]" : "")}>{engagement.business}</span>
        <span className={cn(
          "rounded px-1.5 py-0.5 text-2xs font-bold uppercase tracking-[0.04em]",
          onClient ? "bg-[var(--accent-tint)] text-accent-700" : "bg-[var(--border)] text-[var(--muted)]"
        )}>
          {engagement.model} SEO
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
