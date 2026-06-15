import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
