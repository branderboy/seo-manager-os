"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { STAGES } from "@/lib/stages";

/** Top bar shown on stage pages: breadcrumb + prev/next stage navigation. */
export function StageBar() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1];
  const idx = STAGES.findIndex((s) => s.slug === slug);

  const current = idx >= 0 ? STAGES[idx] : null;
  const prev = idx > 0 ? STAGES[idx - 1] : null;
  const next = idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1] : null;

  return (
    <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">SEO Manager OS</span>
          {current && (
            <>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-800">
                Stage {current.n} · {current.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {prev ? (
            <Link
              href={`/${prev.slug}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{prev.short}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/${next.slug}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 text-[13px] font-medium text-white hover:bg-slate-800"
            >
              <span className="hidden sm:inline">{next.short}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
