"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHandoff } from "@/components/flow/handoff-store";

export function CarriedFromDiagnosis() {
  const { strategyInputs } = useHandoff();
  if (strategyInputs.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-accent-200 bg-accent-50/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-700">
          Carried from Diagnosis
        </span>
        <Link href="/diagnosis" className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Change selection
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {strategyInputs.map((c) => (
          <span key={c} className="rounded-md bg-white px-2.5 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-accent-200">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
