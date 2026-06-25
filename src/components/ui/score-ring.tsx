import type { CSSProperties } from "react";
import { scoreTone } from "@/lib/utils";

const toneStroke: Record<string, string> = {
  good: "#10b981",
  warn: "#f59e0b",
  bad: "#f43f5e",
};

export function ScoreRing({
  value,
  size = 72,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const color = toneStroke[scoreTone(pct)];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={stroke}
        />
        <circle
          className="ring-draw"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ ["--ring-c" as string]: c, ["--ring-offset" as string]: offset } as CSSProperties}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-lg font-semibold text-slate-900">{pct}</span>
        {label && (
          <span className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-600">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
