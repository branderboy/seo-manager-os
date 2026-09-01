import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, ShieldAlert, UsersRound } from "lucide-react";
import { clientRequests, demoCampaigns, tasks } from "@/lib/local-growth/demo-data";
import { statusLabel } from "@/lib/local-growth/types";

const team = [
  { name: "Jordan Reyes", role: "Lead SEO", active: 5, capacity: 8 },
  { name: "Priya Nair", role: "SEO Strategist", active: 7, capacity: 8 },
  { name: "Sam Cole", role: "Content / Outreach", active: 5, capacity: 8 },
  { name: "Marcus Lee", role: "Technical SEO", active: 4, capacity: 5 },
];

export function GrowthOverview() {
  const overdue = tasks.filter((task) => task.status !== "completed" && task.dueDate < "2026-08-30").length;
  const blocked = tasks.filter((task) => task.status === "blocked").length;
  const waiting = tasks.filter((task) => task.status === "waiting_on_client").length;
  const openRequests = clientRequests.filter((request) => request.status === "open" || request.status === "overdue").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Agency operations</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Local campaign command center</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Three home-service campaigns in demo mode. Priorities, blockers, client dependencies and deliverables are shown from one operating layer.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span className="font-semibold">Demo data is active.</span> Live connectors can replace each source without changing the campaign model.
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Active campaigns" value="3" detail="Target range: 7–10" icon={<UsersRound className="h-4 w-4" />} />
        <Metric label="Blocked work" value={String(blocked)} detail="Needs agency or access fix" tone="red" icon={<ShieldAlert className="h-4 w-4" />} />
        <Metric label="Waiting on client" value={String(waiting)} detail="Dependency queue" tone="amber" icon={<Clock3 className="h-4 w-4" />} />
        <Metric label="Open client requests" value={String(openRequests)} detail="Portal actions" tone="blue" icon={<AlertTriangle className="h-4 w-4" />} />
        <Metric label="Overdue tasks" value={String(overdue)} detail="Demo clock: Aug 30, 2026" tone={overdue ? "red" : "green"} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Campaigns</h2>
            <p className="text-sm text-slate-500">Health, visibility and dependency load at a glance.</p>
          </div>
          <Link href="/growth/campaigns" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Open campaign list <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {demoCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/growth/campaigns/${campaign.id}`}
              className="group rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{campaign.industry}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950">{campaign.clientName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{campaign.market}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{campaign.status}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Mini label="Campaign health" value={`${campaign.healthScore}%`} />
                <Mini label="Ranking visibility" value={`${campaign.visibilityScore}%`} />
                <Mini label="Client actions" value={String(campaign.clientActionCount)} tone={campaign.clientActionCount ? "amber" : undefined} />
                <Mini label="Blockers" value={String(campaign.blockerCount)} tone={campaign.blockerCount ? "red" : undefined} />
              </div>

              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Highest-priority services</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {campaign.services.slice(0, 3).map((service) => (
                    <span key={service.name} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Team workload</h2>
              <p className="text-sm text-slate-500">Active SEO production work vs. operating capacity.</p>
            </div>
            <Link href="/growth/tasks" className="text-sm font-semibold text-emerald-700">View tasks</Link>
          </div>
          <div className="mt-5 space-y-4">
            {team.map((member) => {
              const pct = Math.min(100, Math.round((member.active / member.capacity) * 100));
              return (
                <div key={member.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{member.name}</span>
                      <span className="ml-2 text-slate-500">{member.role}</span>
                    </div>
                    <span className={pct >= 90 ? "font-semibold text-amber-700" : "text-slate-600"}>{member.active}/{member.capacity}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={pct >= 90 ? "h-full rounded-full bg-amber-500" : "h-full rounded-full bg-emerald-500"} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Dependency queue</h2>
              <p className="text-sm text-slate-500">Work that cannot move without a handoff.</p>
            </div>
            <Link href="/growth/requests" className="text-sm font-semibold text-emerald-700">Client portal</Link>
          </div>
          <div className="mt-4 space-y-3">
            {tasks.filter((task) => task.status === "blocked" || task.status === "waiting_on_client").slice(0, 5).map((task) => {
              const campaign = demoCampaigns.find((item) => item.id === task.campaignId);
              return (
                <div key={task.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{task.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{campaign?.clientName} · {task.owner}</div>
                    </div>
                    <span className={task.status === "blocked" ? "rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700" : "rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700"}>
                      {statusLabel[task.status]}
                    </span>
                  </div>
                  {task.dependency && <p className="mt-2 text-xs leading-5 text-slate-600">{task.dependency}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, icon, tone = "slate" }: { label: string; value: string; detail: string; icon: React.ReactNode; tone?: "slate" | "red" | "amber" | "blue" | "green" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)]">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "amber" | "red" }) {
  return (
    <div className="rounded-xl bg-[var(--surface-2)] p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${tone === "red" ? "text-red-700" : tone === "amber" ? "text-amber-700" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}
