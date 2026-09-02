"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { TableShell, THead, TH, TBody } from "@/components/ui/data-table";
import { ClientRow } from "@/components/clients/client-row";
import { riskForClient } from "@/lib/risk";
import type { Client } from "@/lib/model";

/**
 * The client list and its search.
 *
 * The search box used to be a decorative input wired to nothing. It filters now, and it
 * announces the result count politely so a screen reader user learns that the list
 * changed rather than only seeing it.
 */
export function ClientTable({ clients }: { clients: Client[] }) {
  const [query, setQuery] = React.useState("");

  const sorted = React.useMemo(
    () => [...clients].sort((a, b) => riskForClient(b).overall - riskForClient(a).overall),
    [clients],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((c) =>
      [c.name, c.industry, c.location, c.owner, c.model, c.status]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [sorted, query]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search clients"
            placeholder="Search clients…"
            className="h-9 w-72 rounded-md border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm shadow-card outline-none placeholder:text-[var(--faint)] focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
          />
        </div>
        <span className="text-xs text-[var(--muted)]">
          Sorted by <span className="font-medium text-[var(--ink-soft)]">risk, descending</span>
        </span>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {query.trim()
          ? `${visible.length} of ${sorted.length} clients match ${query.trim()}`
          : `${sorted.length} clients`}
      </p>

      <TableShell className="min-w-full">
        <THead>
          <TH>Client</TH>
          <TH>Model</TH>
          <TH>Owner</TH>
          <TH sortable sortDir="desc">Risk</TH>
          <TH align="right">AI visibility</TH>
          <TH>Status</TH>
          <TH />
        </THead>
        <TBody>
          {visible.map((c) => (
            <ClientRow key={c.id} client={c} />
          ))}
        </TBody>
      </TableShell>

      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--border-strong)] p-8 text-center text-sm text-[var(--muted)]">
          No client matches “{query.trim()}”.
        </p>
      )}
    </>
  );
}
