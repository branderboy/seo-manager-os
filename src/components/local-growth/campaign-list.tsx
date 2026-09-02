import Link from "next/link";
import { ArrowRight, CircleAlert, Clock3, Plus, Search } from "lucide-react";
import { demoCampaigns } from "@/lib/local-growth/demo-data";

export function CampaignList() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Campaign portfolio</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Clients & campaigns</h1>
          <p className="mt-2 text-sm text-slate-600">The operating view for active local SEO accounts, ownership, health and dependencies.</p>
        </div>
        <Link href="/growth/campaigns/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> New campaign
        </Link>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" placeholder="Search clients, markets or trades" />
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg border border-[var(--border)] px-3 py-2 text-slate-600">Status: Active</span>
            <span className="rounded-lg border border-[var(--border)] px-3 py-2 text-slate-600">Owner: All</span>
            <span className="rounded-lg border border-[var(--border)] px-3 py-2 text-slate-600">Trade: All</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Market</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Health</th>
                <th className="px-4 py-3 font-semibold">Visibility</th>
                <th className="px-4 py-3 font-semibold">Client action</th>
                <th className="px-4 py-3 font-semibold">Blockers</th>
                <th className="px-4 py-3 font-semibold">Report</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {demoCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{campaign.clientName}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{campaign.industry} · {campaign.website}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{campaign.market}</td>
                  <td className="px-4 py-4 text-slate-700">{campaign.strategist}</td>
                  <td className="px-4 py-4"><Score value={campaign.healthScore} /></td>
                  <td className="px-4 py-4"><Score value={campaign.visibilityScore} /></td>
                  <td className="px-4 py-4">
                    <span className={campaign.clientActionCount ? "inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700" : "text-slate-500"}>
                      {campaign.clientActionCount ? <Clock3 className="h-3.5 w-3.5" /> : null}{campaign.clientActionCount}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={campaign.blockerCount ? "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700" : "text-slate-500"}>
                      {campaign.blockerCount ? <CircleAlert className="h-3.5 w-3.5" /> : null}{campaign.blockerCount}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={campaign.latestReportStatus === "published" ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700" : campaign.latestReportStatus === "review" ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"}>
                      {campaign.latestReportStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/growth/campaigns/${campaign.id}`} className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800">
                      Open <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className={value >= 75 ? "h-full bg-emerald-500" : value >= 60 ? "h-full bg-blue-500" : "h-full bg-amber-500"} style={{ width: `${value}%` }} /></div>
      <span className="font-semibold tabular-nums text-slate-800">{value}</span>
    </div>
  );
}
