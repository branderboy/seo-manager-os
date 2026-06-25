import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Server, Mic, MapPin, Target, FileText, StickyNote, Users, FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { clients, clientById, peopleForClient, investigationsForClient, money } from "@/lib/model";
import { clientProfiles } from "@/lib/client-profiles";
import { riskForClient, riskTone, riskBadge } from "@/lib/risk";

export function generateStaticParams() {
  return clients.map((c) => ({ id: c.id }));
}

export const metadata: Metadata = { title: "Client" };

export default function ClientRecordPage({ params }: { params: { id: string } }) {
  const client = clientById(params.id);
  const profile = clientProfiles[params.id];
  if (!client || !profile) notFound();

  const people = peopleForClient(params.id);
  const records = investigationsForClient(params.id);
  const risk = riskForClient(client);

  return (
    <>
      <PageHeader title={client.name} description={`${client.industry} · ${client.location}`}>
        <Badge variant="accent">{client.model} SEO</Badge>
        <Badge variant={riskBadge(risk.level)}>{risk.level} risk · {risk.overall}</Badge>
      </PageHeader>

      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> All clients
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Business profile */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <Row icon={Globe} label="Website" value={profile.website} />
              <Row icon={Server} label="CMS" value={profile.cms} />
              <Row icon={Server} label="Hosting" value={profile.hosting} />
              <Row icon={Users} label="Owner" value={client.owner} />
              <div className="sm:col-span-2">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Mic className="h-3.5 w-3.5" /> Brand voice
                </div>
                <p className="text-sm text-slate-700">{profile.brandVoice}</p>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Search health */}
        <Card>
          <CardHeader><CardTitle>Search health</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              <Score label="Visibility" value={client.scores.visibility} />
              <Score label="Authority" value={client.scores.authority} />
              <Score label="Trust" value={client.scores.trust} />
              <Score label="AI" value={client.scores.ai} />
            </div>
            <div className="mt-4 border-t border-[var(--border)] pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Overall risk</span>
                <span className="font-semibold text-slate-800">{risk.overall}</span>
              </div>
              <div className="mt-1.5"><Progress value={risk.overall} tone={riskTone(risk.overall)} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals / Priorities / Locations / Competitors */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Chips icon={Target} title="Goals" items={profile.goals} />
        <Chips icon={Target} title="Priorities" items={profile.priorities} />
        <Chips icon={MapPin} title="Locations" items={profile.locations} />
        <Chips icon={Users} title="Competitors" items={profile.competitors} />
      </div>

      {/* Contacts + Records */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500" /> Contacts</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {people.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${p.color}`}>{p.initials}</span>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{p.name} · <span className="font-normal text-slate-600">{p.title}</span></div>
                    <div className="truncate text-sm text-slate-600">{p.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-500" /> Engagements</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {records.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{r.name}</div>
                    <div className="text-sm text-slate-600">{r.stageLabel} · {r.progress}%</div>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-slate-700">{money(r.value)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Documents + Notes */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-slate-500" /> Documents</CardTitle></CardHeader>
          <CardContent>
            {profile.documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {profile.documents.map((d) => (
                  <li key={d.name} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="truncate text-sm text-slate-700">{d.name}</span>
                    </span>
                    <span className="shrink-0 text-sm text-slate-600">{d.kind} · {d.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><StickyNote className="h-4 w-4 text-slate-500" /> Notes</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profile.notes.map((n) => (
                <li key={n.text} className="text-sm">
                  <p className="text-slate-700">{n.text}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{n.by} · {n.when}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-sm font-medium text-slate-700">{value}</div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function Chips({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-slate-500" /> {title}
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i} className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">
            {i}
          </li>
        ))}
      </ul>
    </Card>
  );
}
