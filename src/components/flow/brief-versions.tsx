"use client";

import { useState } from "react";
import { History, Plus, Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnnounce } from "@/components/layout/announcer";

type Version = { version: string; note: string; author: string; at: string };

const SEED: Version[] = [
  { version: "v3", note: "Forecast updated after diagnosis re-run", author: "Kawani Ali", at: "Jun 16, 2026 · 2:14 PM" },
  { version: "v2", note: "Added GEO/AEO playbooks and risks", author: "Kawani Ali", at: "Jun 12, 2026 · 10:02 AM" },
  { version: "v1", note: "Initial brief generated from diagnosis", author: "SEO Manager OS", at: "Jun 9, 2026 · 4:48 PM" },
];

function nowLabel() {
  const d = new Date();
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

export function BriefVersions() {
  const [versions, setVersions] = useState<Version[]>(SEED);
  const announce = useAnnounce();
  const [currentVer, setCurrentVer] = useState("v3");
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");

  const current = versions.find((v) => v.version === currentVer) ?? versions[0];
  const nextNum = Math.max(...versions.map((v) => parseInt(v.version.slice(1), 10))) + 1;

  const save = () => {
    const v: Version = {
      version: `v${nextNum}`,
      note: note.trim() || "Updated the brief",
      author: "Kawani Ali",
      at: nowLabel(),
    };
    setVersions((vs) => [v, ...vs]);
    setCurrentVer(v.version);
    announce(`Saved ${v.version} of the project brief`);
    setNote("");
    setAdding(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-slate-900">
            <History className="h-4 w-4 text-slate-600" /> Version History
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Current: <span className="font-semibold text-slate-800">{current.version}</span>
            <span className="text-slate-500"> · </span>
            <span className="font-mono text-slate-600">{current.at}</span>
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0C6BA1] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" /> Save new version
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-600">
            What changed in {`v${nextNum}`}?
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            aria-label={`What changed in v${nextNum}?`}
            autoFocus
            placeholder="e.g. Reprioritized roadmap after client feedback"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#1DA1F2]"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" /> Save {`v${nextNum}`}
            </button>
            <button
              onClick={() => { setAdding(false); setNote(""); }}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="mt-4 divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)]">
        {versions.map((v) => {
          const isCurrent = v.version === currentVer;
          return (
            <li key={v.version} className={cn("flex items-center justify-between gap-3 px-4 py-3", isCurrent && "bg-emerald-50/40")}>
              <div className="flex min-w-0 items-center gap-3">
                <span className={cn("inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-bold", isCurrent ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200" : "bg-slate-100 text-slate-700")}>
                  {v.version}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm text-slate-700">{v.note}</div>
                  <div className="text-xs text-slate-500">{v.author}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden font-mono text-xs text-slate-600 sm:inline">{v.at}</span>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-3.5 w-3.5" /> Current
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentVer(v.version)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1DA1F2] hover:text-[#1DA1F2]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
