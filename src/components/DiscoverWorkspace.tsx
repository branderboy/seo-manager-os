"use client";

import { useState } from "react";
import { DiscoverForm } from "./DiscoverForm";
import { ScanForm } from "./ScanForm";

const TABS = [
  { key: "discover", label: "Run campaign" },
  { key: "scan", label: "Scan domains" },
] as const;

export function DiscoverWorkspace() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("discover");

  return (
    <div className="space-y-5">
      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "discover" ? <DiscoverForm /> : <ScanForm />}
    </div>
  );
}
