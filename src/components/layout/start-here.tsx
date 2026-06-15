"use client";

import { Sparkles, X, ArrowDown } from "lucide-react";
import { useTour } from "@/components/layout/tour";

/**
 * One-time "Start here" coachmark, shown on the first stage until dismissed.
 * Orients a brand-new viewer to the guided walkthrough.
 */
export function StartHereCoach() {
  const { seen, dismiss } = useTour();
  if (seen) return null;

  return (
    <div className="animate-fade-up rounded-xl border border-accent-200 bg-accent-50/70 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Start here 👋</h3>
            <button
              onClick={dismiss}
              className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            This is a guided walkthrough. Answer the interview below (or hit{" "}
            <span className="font-medium text-slate-800">Prefill sample</span> to skip ahead),
            then use the{" "}
            <span className="inline-flex items-center gap-1 font-medium text-accent-700">
              guided tour bar <ArrowDown className="h-3.5 w-3.5" />
            </span>{" "}
            at the bottom to move through all 9 stages. We&apos;ll remember how far you get.
          </p>
          <button
            onClick={dismiss}
            className="mt-3 inline-flex h-8 items-center rounded-lg bg-slate-900 px-3 text-[13px] font-medium text-white hover:bg-slate-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
