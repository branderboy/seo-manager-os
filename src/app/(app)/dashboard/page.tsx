import Link from "next/link";
import { getDashboardStats } from "@/services/scanner";
import { queryLeads } from "@/services/leads";
import { scoreColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, top] = await Promise.all([
    getDashboardStats(),
    queryLeads({ minScore: 70 }, { page: 1, pageSize: 8, sort: "score" }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Live intelligence across every WordPress site you&apos;ve discovered.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="WordPress Sites" value={stats.totalWordPressSites.toLocaleString()} />
        <StatCard label="Classified Businesses" value={stats.totalContractors.toLocaleString()} />
        <StatCard
          label="Opportunities"
          value={stats.totalOpportunities.toLocaleString()}
          hint="Score ≥ 70"
        />
        <StatCard label="Avg Opportunity" value={stats.averageOpportunityScore} />
        <StatCard
          label="New (7 days)"
          value={stats.newSitesFound.toLocaleString()}
          hint="Recently found"
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Hottest Opportunities</h2>
          <Link href="/leads?minScore=70" className="text-sm font-medium text-brand-600">
            View all →
          </Link>
        </div>
        {top.rows.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No leads yet. Head to{" "}
            <Link href="/scan" className="font-medium text-brand-600">
              Discover
            </Link>{" "}
            to scan your first batch of domains.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {top.rows.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/leads/${lead.domain}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {lead.companyName ?? lead.domain}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {lead.industry ?? "Unclassified"}
                      {lead.location ? ` · ${lead.location}` : ""}
                    </p>
                  </div>
                  <span className={`badge ${scoreColor(lead.opportunityScore)}`}>
                    {lead.opportunityScore}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
