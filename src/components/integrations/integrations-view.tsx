"use client";

import * as React from "react";
import { Check, Loader2, Plug, RefreshCw, Search, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { integrations as seed, integrationCategories } from "@/lib/integrations";
import type { Integration } from "@/lib/integrations";

export function IntegrationsView() {
  const [items, setItems] = React.useState<Integration[]>(seed);
  const [pending, setPending] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  const connect = (id: string) => {
    setPending(id);
    // Simulate an OAuth / handshake round-trip so it feels real.
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                connected: true,
                account: i.account ?? "Connected account",
                synced: "Just now",
                metric: i.metric ?? "Syncing…",
              }
            : i
        )
      );
      setPending(null);
    }, 900);
  };

  const disconnect = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false } : i)));

  const connectedCount = items.filter((i) => i.connected).length;
  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.blurb.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Summary + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {connectedCount} connected
          </span>
          <span>{items.length - connectedCount} available</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrations…"
            className="h-9 w-64 rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
          />
        </div>
      </div>

      {integrationCategories.map((cat) => {
        const group = filtered.filter((i) => i.category === cat);
        if (!group.length) return null;
        return (
          <section key={cat}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {cat}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((i) => (
                <IntegrationCard
                  key={i.id}
                  i={i}
                  pending={pending === i.id}
                  onConnect={() => connect(i.id)}
                  onDisconnect={() => disconnect(i.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function IntegrationCard({
  i,
  pending,
  onConnect,
  onDisconnect,
}: {
  i: Integration;
  pending: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <Card className={cn("flex flex-col p-5", i.connected && "ring-1 ring-emerald-100")}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
            i.color
          )}
        >
          {i.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">{i.name}</h3>
            {i.connected && (
              <Badge variant="good">
                <Check className="h-3 w-3" /> Connected
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{i.blurb}</p>
        </div>
      </div>

      {i.connected ? (
        <div className="mt-4 space-y-2 rounded-lg bg-[var(--surface-2)] p-3 text-xs">
          <Row label="Account" value={i.account ?? "—"} />
          <Row label="Last sync" value={i.synced ?? "—"} icon={<RefreshCw className="h-3 w-3" />} />
          {i.metric && <Row label="Status" value={i.metric} />}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] p-3 text-xs text-slate-400">
          Not connected — link your account to start syncing data.
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {i.connected ? (
          <>
            <Button variant="secondary" size="sm" className="flex-1">
              <Settings2 className="h-4 w-4" />
              Configure
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" className="flex-1" onClick={onConnect} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Plug className="h-4 w-4" />
                Connect
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-1 truncate font-medium text-slate-700">
        {icon}
        {value}
      </span>
    </div>
  );
}
