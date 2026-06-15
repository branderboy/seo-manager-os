"use client";

import { Sparkles, X, ArrowDown, ArrowRight } from "lucide-react";
import { useTour } from "@/components/layout/tour";

/**
 * One-time "Start here" coachmark, shown on the first stage until dismissed.
 * Orients a brand-new viewer to the guided walkthrough.
 */
export function StartHereCoach() {
  const { seen, dismiss } = useTour();
  if (seen) return null;

  return (
    <div className="animate-fade-up relative overflow-hidden rounded-2xl border-2 border-accent-200 bg-accent-50/60 p-6 shadow-border sm:p-7">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-200/40 blur-3xl" />
      <button
        onClick={dismiss}
        className="absolute right-4 top-4 rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-700"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-sm">
          <Sparkles className="h-7 w-7" />
        </span>
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Start here 👋</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            This is a guided walkthrough. Answer the interview below (or hit{" "}
            <span className="font-semibold text-slate-800">Prefill sample</span> to skip ahead), then use the{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-accent-700">
              guided tour bar <ArrowDown className="h-4 w-4" />
            </span>{" "}
            at the bottom to move through all 9 stages.
          </p>
        </div>

        <button
          onClick={dismiss}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
        >
          Begin The Walkthrough
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
