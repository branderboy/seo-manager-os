import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Map a 0 to 100 score to a semantic tone. */
export function scoreTone(score: number): "good" | "warn" | "bad" {
  if (score >= 75) return "good";
  if (score >= 50) return "warn";
  return "bad";
}

export function scoreToneClasses(score: number): string {
  const tone = scoreTone(score);
  if (tone === "good") return "text-emerald-700 bg-emerald-50 ring-emerald-600/20";
  if (tone === "warn") return "text-amber-700 bg-amber-50 ring-amber-600/20";
  return "text-rose-700 bg-rose-50 ring-rose-600/20";
}

export function scoreBar(score: number): string {
  const tone = scoreTone(score);
  if (tone === "good") return "bg-emerald-500";
  if (tone === "warn") return "bg-amber-500";
  return "bg-rose-500";
}
