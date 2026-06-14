import Link from "next/link";
import { queryLeads } from "@/services/leads";
import { parseFilters, parseSort } from "@/lib/filters";
import { LeadFilters } from "@/components/LeadFilters";
import { SaveListButton } from "@/components/SaveListButton";
import { EnrichEmailsButton } from "@/components/EnrichEmailsButton";
import { scoreColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function toParams(sp: SearchParams): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") p.set(k, v);
  }
  return p;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = toParams(searchParams);
  const filters = parseFilters(params);
  const sort = parseSort(params);
  const page = Number(params.get("page") ?? "1") || 1;

  const { rows, total, pageSize } = await queryLeads(filters, { page, sort });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const exportQuery = params.toString();
  const pageLink = (n: number) => {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(n));
    return `/leads?${p.toString()}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500">
            {total.toLocaleString()} {total === 1 ? "site" : "sites"}
            {filters.qualifiedOnly ? " · WordPress + contractor only" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EnrichEmailsButton />
          <SaveListButton />
          <a className="btn-secondary" href={`/api/export?${exportQuery}`}>
            Export CSV
          </a>
        </div>
      </div>

      <LeadFilters />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">WordPress</th>
              <th className="px-4 py-3 font-medium">Contractor</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Stack</th>
              <th className="px-4 py-3 font-medium">Suggested</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              rows.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/leads/${lead.domain}`}
                      className="font-medium text-slate-900 hover:text-brand-700"
                    >
                      {lead.companyName ?? lead.domain}
                    </Link>
                    <div className="text-xs text-slate-400">{lead.domain}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        lead.wordpressDetected
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {lead.wordpressDetected ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        lead.contractor
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {lead.contractor ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {lead.industry ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {lead.location ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {lead.elementor && <span className="badge bg-purple-100 text-purple-700">Elementor</span>}
                      {lead.woocommerce && <span className="badge bg-indigo-100 text-indigo-700">Woo</span>}
                      {lead.wpforms && <span className="badge bg-sky-100 text-sky-700">WPForms</span>}
                      {lead.contactForm7 && <span className="badge bg-slate-100 text-slate-600">CF7</span>}
                      {lead.gravityForms && <span className="badge bg-amber-100 text-amber-700">Gravity</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lead.suggestedProduct ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`badge ${scoreColor(lead.opportunityScore)}`}>
                      {lead.opportunityScore}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link className="btn-secondary" href={pageLink(page - 1)}>
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link className="btn-secondary" href={pageLink(page + 1)}>
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
