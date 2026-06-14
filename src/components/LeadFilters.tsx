"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { INDUSTRIES, US_STATES } from "@/lib/constants";

const PLUGIN_TOGGLES: { key: string; label: string }[] = [
  { key: "elementor", label: "Elementor" },
  { key: "wpforms", label: "WPForms" },
  { key: "contactForm7", label: "Contact Form 7" },
  { key: "gravityForms", label: "Gravity Forms" },
  { key: "woocommerce", label: "WooCommerce" },
  { key: "missingQuoteTool", label: "No Quote Tool" },
  { key: "missingBookingTool", label: "No Booking" },
  { key: "wordpressOnly", label: "WordPress Only" },
];

export function LeadFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page"); // reset pagination on filter change
      router.push(`/leads?${next.toString()}`);
    },
    [params, router],
  );

  const toggle = (key: string) =>
    update({ [key]: params.get(key) === "true" ? null : "true" });

  return (
    <div className="card space-y-4 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <label className="label">Search</label>
          <input
            className="input"
            placeholder="domain or company"
            defaultValue={params.get("search") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                update({ search: (e.target as HTMLInputElement).value || null });
            }}
          />
        </div>
        <div>
          <label className="label">Industry</label>
          <select
            className="input"
            value={params.get("industry") ?? ""}
            onChange={(e) => update({ industry: e.target.value || null })}
          >
            <option value="">All industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">State</label>
          <select
            className="input"
            value={params.get("state") ?? ""}
            onChange={(e) => update({ state: e.target.value || null })}
          >
            <option value="">All states</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Min Opportunity Score</label>
          <select
            className="input"
            value={params.get("minScore") ?? ""}
            onChange={(e) => update({ minScore: e.target.value || null })}
          >
            <option value="">Any</option>
            <option value="50">50+</option>
            <option value="70">70+</option>
            <option value="80">80+</option>
            <option value="90">90+</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() =>
            update({
              qualifiedOnly: params.get("qualifiedOnly") === "false" ? null : "false",
            })
          }
          className={`badge border ${
            params.get("qualifiedOnly") !== "false"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          }`}
          title="WordPress = Yes AND Local contractor = Yes"
        >
          {params.get("qualifiedOnly") !== "false" ? "✓ " : ""}Qualified only (WordPress + Contractor)
        </button>
        <span className="mx-1 h-4 w-px bg-slate-200" />
        {PLUGIN_TOGGLES.map((t) => {
          const active = params.get(t.key) === "true";
          return (
            <button
              key={t.key}
              onClick={() => toggle(t.key)}
              className={`badge border ${
                active
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          );
        })}
        {Array.from(params.keys()).some((k) => k !== "page" && k !== "sort") && (
          <button
            onClick={() => router.push("/leads")}
            className="badge text-slate-400 hover:text-slate-600"
          >
            Clear all ✕
          </button>
        )}
      </div>
    </div>
  );
}
