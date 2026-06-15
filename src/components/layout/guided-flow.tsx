"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Flag, SkipForward } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { useTour } from "@/components/layout/tour";
import { cn } from "@/lib/utils";

/**
 * Floating "guided tour" bar shown on the stage pages. Gives a new viewer
 * constant orientation (step N of 9) and one-click forward motion, so the
 * Discovery → … → Daily Tasks flow runs on rails. Remembers the furthest
 * stage reached and offers a Resume jump.
 */
export function GuidedFlow() {
  const pathname = usePathname();
  const { furthest, visit } = useTour();
  const slug = pathname.split("/")[1];
  const idx = STAGES.findIndex((s) => s.slug === slug);

  const current = idx >= 0 ? STAGES[idx] : null;

  // Record progress whenever a stage is viewed.
  React.useEffect(() => {
    if (current) visit(current.n);
  }, [current, visit]);

  if (idx === -1 || !current) return null; // only on stage pages

  const prev = idx > 0 ? STAGES[idx - 1] : null;
  const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : null;
  const resume = furthest > current.n ? STAGES[furthest - 1] : null;

  return (
    <div className="pointer-events-none sticky bottom-4 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-xl border border-[var(--border)] bg-white/95 px-3 py-2.5 shadow-lift backdrop-blur">
        {/* Label */}
        <div className="hidden shrink-0 pl-1 sm:block">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Guided tour
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Step {current.n} of {STAGES.length}
          </div>
        </div>

        {/* Stepper */}
        <div className="flex flex-1 items-center justify-center gap-1">
          {STAGES.map((s, i) => {
            const active = i === idx;
            // Done = passed this session OR reached on a previous visit.
            const done = !active && (i < idx || i + 1 <= furthest);
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                title={`Stage ${s.n} · ${s.name}`}
                className={cn(
                  "group relative flex items-center",
                  i < STAGES.length - 1 && "flex-1"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    active
                      ? "bg-orange-400 text-white ring-4 ring-orange-100"
                      : done
                        ? "bg-orange-400 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : s.n}
                </span>
                {i < STAGES.length - 1 && (
                  <span className={cn("mx-0.5 h-0.5 flex-1 rounded-full", i < idx || i + 1 < furthest ? "bg-orange-300" : "bg-slate-100")} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2">
          {resume && (
            <Link
              href={`/${resume.slug}`}
              className="hidden h-8 items-center gap-1.5 rounded-lg border border-accent-200 bg-accent-50 px-2.5 text-[13px] font-medium text-accent-700 hover:bg-accent-100 md:inline-flex"
              title={`Resume at ${resume.name}`}
            >
              <SkipForward className="h-3.5 w-3.5" />
              Resume
            </Link>
          )}
          {prev && (
            <Link
              href={`/${prev.slug}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-slate-600 hover:bg-slate-50"
              title={`Back: ${prev.short}`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          {next ? (
            <Link
              href={`/${next.slug}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[13px] font-medium text-white hover:bg-slate-800"
            >
              <span className="hidden sm:inline">Next:</span> {next.short}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href="/clients"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[13px] font-medium text-white hover:bg-emerald-700"
            >
              <Flag className="h-3.5 w-3.5" />
              Finish
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
