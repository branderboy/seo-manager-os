"use client";

import * as React from "react";
import {
  Upload,
  Check,
  FileSpreadsheet,
  Gauge,
  Search,
  BarChart3,
  Plug,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Mode = "upload" | "connect" | "both";

type Source = {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  mode: Mode;
  accept?: string;
  connectedByDefault?: boolean;
  account?: string;
};

const SOURCES: Source[] = [
  { id: "sf", name: "Screaming Frog crawl", desc: "Upload a crawl export to power the technical audits.", icon: FileSpreadsheet, mode: "upload", accept: ".csv,.xlsx,.xls" },
  { id: "speed", name: "Site Speed · Lighthouse / PSI", desc: "Connect PageSpeed Insights or upload a Lighthouse JSON.", icon: Gauge, mode: "both", accept: ".json" },
  { id: "gsc", name: "Google Search Console", desc: "Queries, clicks, impressions and indexation coverage.", icon: Search, mode: "connect", connectedByDefault: true, account: "sc-domain:northwindhvac.com" },
  { id: "ga4", name: "Google Analytics 4", desc: "Sessions, conversions and channel performance.", icon: BarChart3, mode: "connect", connectedByDefault: true, account: "GA4 · 312,480 sessions / 90d" },
];

type SourceState = {
  connected: boolean;
  account?: string;
  fileName?: string;
  rows?: number;
  pending?: boolean;
};

export function EvidencePanel() {
  const [state, setState] = React.useState<Record<string, SourceState>>(() =>
    Object.fromEntries(
      SOURCES.map((s) => [s.id, { connected: !!s.connectedByDefault, account: s.account }])
    )
  );
  const inputs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const onFile = (id: string, file?: File | null) => {
    if (!file) return;
    const rows = Math.max(120, Math.round(file.size / 38));
    setState((s) => ({ ...s, [id]: { ...s[id], fileName: file.name, rows } }));
  };

  const connect = (id: string) => {
    setState((s) => ({ ...s, [id]: { ...s[id], pending: true } }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        [id]: { ...s[id], pending: false, connected: true, account: s[id].account ?? "Connected just now" },
      }));
    }, 850);
  };

  const clearFile = (id: string) =>
    setState((s) => ({ ...s, [id]: { ...s[id], fileName: undefined, rows: undefined } }));

  const ready =
    SOURCES.filter((s) => state[s.id].connected || state[s.id].fileName).length;

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
            Evidence &amp; data sources
          </h3>
          <p className="text-sm text-slate-500">
            Upload exports or connect live sources — the audits run on whatever you provide.
          </p>
        </div>
        <Badge variant={ready >= 3 ? "good" : "warn"}>{ready}/{SOURCES.length} sources ready</Badge>
      </div>

      <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2">
        {SOURCES.map((src) => {
          const st = state[src.id];
          const Icon = src.icon;
          const hasData = st.connected || !!st.fileName;
          return (
            <div key={src.id} className="bg-white p-5">
              <div className="flex items-start gap-3">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", hasData ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{src.name}</h4>
                    {st.connected && (
                      <Badge variant="good"><Check className="h-3 w-3" /> Connected</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{src.desc}</p>

                  {/* Connected detail */}
                  {st.connected && st.account && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <RefreshCw className="h-3 w-3" />
                      {st.account}
                    </div>
                  )}

                  {/* Uploaded file */}
                  {st.fileName && (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5">
                      <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-600">
                        <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className="truncate">{st.fileName}</span>
                        <span className="shrink-0 text-slate-400">· {st.rows?.toLocaleString()} rows</span>
                      </span>
                      <button onClick={() => clearFile(src.id)} className="text-slate-400 hover:text-slate-700">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(src.mode === "connect" || src.mode === "both") && !st.connected && (
                      <Button size="sm" onClick={() => connect(src.id)} disabled={st.pending}>
                        {st.pending ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Connecting…</>
                        ) : (
                          <><Plug className="h-4 w-4" /> Connect</>
                        )}
                      </Button>
                    )}
                    {(src.mode === "upload" || src.mode === "both") && (
                      <>
                        <input
                          ref={(el) => {
                            inputs.current[src.id] = el;
                          }}
                          type="file"
                          accept={src.accept}
                          className="hidden"
                          onChange={(e) => onFile(src.id, e.target.files?.[0])}
                        />
                        <Button
                          size="sm"
                          variant={st.connected ? "ghost" : "secondary"}
                          onClick={() => inputs.current[src.id]?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          {st.fileName ? "Replace file" : "Upload"}
                        </Button>
                      </>
                    )}
                    {st.connected && (src.mode === "connect") && (
                      <Button size="sm" variant="ghost" onClick={() => setState((s) => ({ ...s, [src.id]: { ...s[src.id], connected: false } }))}>
                        Disconnect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
