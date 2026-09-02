import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Server,
  Mic,
  MapPin,
  Target,
  FileText,
  StickyNote,
  Users,
  FolderOpen,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { clients, clientById, peopleForClient, investigationsForClient, money } from "@/lib/model";
import { STAGES } from "@/lib/stages";
import { clientProfiles } from "@/lib/client-profiles";
import { riskForClient, riskTone, riskBadge } from "@/lib/risk";

export function generateStaticParams() {
  return clients.map((c) => ({ id: c.id }));
}

export const metadata: Metadata = { title: "Client" };

const NAV = [
  { id: "profile", label: "Overview" },
  { id: "health", label: "SEO Health" },
  { id: "strategy", label: "Goals" },
  { id: "pipeline", label: "Pipeline" },
  { id: "people", label: "Contacts" },
  { id: "files", label: "Files & Notes" },
];

export default async function ClientRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = clientById(id);
  const profile = clientProfiles[id];
  if (!client || !profile) notFound();

  const people = peopleForClient(id);
  const records = investigationsForClient(id);
  const risk = riskForClient(client);

  const scoreStats = [
    { label: "Visibility", value: client.scores.visibility },
    { label: "Authority", value: client.scores.authority },
    { label: "Trust", value: client.scores.trust },
    { label: "AI", value: client.scores.ai },
    { label: "Risk", value: risk.overall, isRisk: true },
  ];

  return (
    <>
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All clients
      </Link>

      {/* ── Workspace identity banner ──────────────────────────────────────── */}
      <Card className="reveal overflow-hidden">
        <div className="flex flex-wrap items-start gap-4 p-5">
          <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white", client.color)}>
            {client.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{client.name}</h1>
              <Badge variant="accent">{client.model} SEO</Badge>
              <Badge variant={riskBadge(risk.level)}>{risk.level} risk · {risk.overall}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
              <span>{client.industry}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{client.location}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{client.owner}</span>
              <a href={`https://${profile.website}`} className="inline-flex items-center gap-1 font-medium text-accent-600 hover:text-accent-700">
                <Globe className="h-3.5 w-3.5" />{profile.website}<ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        {/* Score strip */}
        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] border-t border-[var(--border)] sm:grid-cols-5 sm:divide-y-0">
          {scoreStats.map((s) => (
            <div key={s.label} className="px-4 py-3">
              <div className="text-2xs font-medium uppercase tracking-[0.05em] text-[var(--muted)]">{s.label}</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "tnum text-lg font-semibold",
                    s.isRisk
                      ? risk.overall >= 60
                        ? "text-[var(--danger)]"
                        : risk.overall >= 45
                        ? "text-[var(--warn)]"
                        : "text-[var(--ok)]"
                      : "text-[var(--foreground)]"
                  )}
                >
                  {s.value}
                </span>
                <div className="w-12">
                  <Progress value={s.value} tone={s.isRisk ? riskTone(risk.overall) : undefined} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Workspace section nav ──────────────────────────────────────────── */}
      <nav className="sticky top-[60px] z-10 -mx-1 flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--canvas)]/90 px-1 py-1.5 backdrop-blur">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
          >
            {n.label}
          </a>
        ))}
      </nav>

      {/* Business profile + Search health */}
      <div id="profile" className="grid scroll-mt-28 gap-5 lg:grid-cols-3">
        <Panel title="Business profile" className="lg:col-span-2">
          <div className="p-4">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <Row icon={Globe} label="Website" value={profile.website} />
              <Row icon={Server} label="CMS" value={profile.cms} />
              <Row icon={Server} label="Hosting" value={profile.hosting} />
              <Row icon={Users} label="Owner" value={client.owner} />
              <div className="sm:col-span-2">
                <dt className="mb-1 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.05em] text-[var(--faint)]">
                  <Mic className="h-3.5 w-3.5" /> Brand voice
                </dt>
                <dd className="m-0 text-sm leading-relaxed text-[var(--ink-soft)]">{profile.brandVoice}</dd>
              </div>
            </dl>
          </div>
        </Panel>

        <div id="health" className="scroll-mt-28">
          <Panel title="Search health">
            <div className="p-4">
              <div className="space-y-2.5">
                <Score label="Visibility" value={client.scores.visibility} />
                <Score label="Authority" value={client.scores.authority} />
                <Score label="Trust" value={client.scores.trust} />
                <Score label="AI visibility" value={client.scores.ai} />
              </div>
              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">Overall risk</span>
                  <span className="font-semibold tnum text-[var(--foreground)]">{risk.overall}</span>
                </div>
                <div className="mt-1.5"><Progress value={risk.overall} tone={riskTone(risk.overall)} /></div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Goals / Priorities / Locations / Competitors */}
      <div id="strategy" className="grid scroll-mt-28 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Chips icon={Target} title="Goals" items={profile.goals} />
        <Chips icon={Target} title="Priorities" items={profile.priorities} />
        <Chips icon={MapPin} title="Locations" items={profile.locations} />
        <Chips icon={Users} title="Competitors" items={profile.competitors} />
      </div>

      {/* Contacts + Engagements */}
      <div id="pipeline" className="grid scroll-mt-28 gap-5 lg:grid-cols-2">
        <div id="people" className="scroll-mt-28">
          <Panel title="Contacts" icon={Users}>
            <ul className="divide-y divide-[var(--border)]">
              {people.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${p.color}`}>{p.initials}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">
                      {p.name} <span className="font-normal text-[var(--muted)]">· {p.title}</span>
                    </div>
                    <div className="truncate text-xs text-[var(--muted)]">{p.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Engagements" icon={FileText}>
          <ul className="divide-y divide-[var(--border)]">
            {records.map((r) => {
              const stageSlug = STAGES[r.currentStage - 1]?.slug ?? "workflow";
              return (
                <li key={r.id}>
                  <Link href={`/${stageSlug}`} className="group block px-4 py-2.5 transition-colors hover:bg-[var(--surface-2)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-[var(--foreground)]">{r.name}</div>
                        <div className="text-xs text-[var(--muted)]">Stage {r.currentStage} · {r.stageLabel} · {r.progress}% complete</div>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="text-sm font-medium tnum text-[var(--ink-soft)]">{money(r.value)}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--faint)] transition-colors group-hover:text-accent-600" />
                      </span>
                    </div>
                    <div className="mt-2"><Progress value={r.progress} /></div>
                    <div className="mt-1.5 text-2xs font-medium text-accent-600 opacity-0 transition-opacity group-hover:opacity-100">Resume at {r.stageLabel} →</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Documents + Notes */}
      <div id="files" className="grid scroll-mt-28 gap-5 lg:grid-cols-2">
        <Panel title="Files" icon={FolderOpen}>
          {profile.documents.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--faint)]">No documents yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {profile.documents.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[var(--surface-2)]">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-[var(--faint)]" />
                    <span className="truncate text-sm text-[var(--ink-soft)]">{d.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">{d.kind} · {d.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Notes" icon={StickyNote}>
          <ul className="space-y-3 p-4">
            {profile.notes.map((n) => (
              <li key={n.text} className="border-l-2 border-[var(--border-strong)] pl-3 text-sm">
                <p className="leading-relaxed text-[var(--ink-soft)]">{n.text}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{n.by} · {n.when}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Panel({
  title,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        {Icon && <Icon className="h-4 w-4 text-[var(--muted)]" />}
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <dt className="mb-0.5 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.05em] text-[var(--faint)]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="m-0 text-sm font-medium text-[var(--ink-soft)]">{value}</dd>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-[var(--ink-soft)]">{label}</span>
        <span className="font-semibold tnum text-[var(--foreground)]">{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function Chips({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }) {
  return (
    <Card className="p-4">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
        <Icon className="h-4 w-4 text-[var(--muted)]" /> {title}
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i} className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-[var(--ink-soft)] ring-1 ring-inset ring-[var(--border)]">
            {i}
          </li>
        ))}
      </ul>
    </Card>
  );
}
