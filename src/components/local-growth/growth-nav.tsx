"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  Globe2,
  KeyRound,
  Link2,
  ListChecks,
  MapPinned,
  Megaphone,
  MessageSquareText,
  Plug,
  Search,
  Settings2,
  Star,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { demoCampaigns } from "@/lib/local-growth/demo-data";
import { cn } from "@/lib/utils";

const items = [
  { href: "/growth", label: "Overview", icon: Activity },
  { href: "/growth/campaigns", label: "Campaigns", icon: BriefcaseBusiness },
  { href: "/growth/tasks", label: "Tasks", icon: ListChecks },
  { href: "/growth/audits", label: "Audits", icon: ClipboardCheck },
  { href: "/growth/roadmap", label: "Strategy Roadmaps", icon: Target },
  { href: "/growth/gbp", label: "GBP", icon: MapPinned },
  { href: "/growth/rankings", label: "Rankings", icon: BarChart3 },
  { href: "/growth/keywords", label: "Keywords", icon: Search },
  { href: "/growth/citations", label: "Citations", icon: Globe2 },
  { href: "/growth/content", label: "Content", icon: FileText },
  { href: "/growth/reviews", label: "Reviews", icon: Star },
  { href: "/growth/competitors", label: "Competitors", icon: Users },
  { href: "/growth/technical", label: "Technical SEO", icon: Wrench },
  { href: "/growth/outreach", label: "Links & Outreach", icon: Link2 },
  { href: "/growth/leads", label: "Leads & Conversions", icon: Megaphone },
  { href: "/growth/reports", label: "Reports", icon: BookOpenCheck },
  { href: "/growth/requests", label: "Client Requests", icon: MessageSquareText },
  { href: "/growth/templates", label: "Templates", icon: FileText },
  { href: "/growth/integrations", label: "Integrations", icon: Plug },
  { href: "/growth/settings", label: "Settings", icon: Settings2 },
];

function isActive(pathname: string, href: string) {
  if (href === "/growth") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GrowthNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4 shadow-[var(--shadow-card)] lg:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                <MapPinned className="h-4 w-4" />
              </span>
              Local Growth OS
            </div>
            <p className="mt-1 text-xs text-slate-500">Local SEO campaign operations + client reporting portal</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {demoCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/growth/campaigns/${campaign.id}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {campaign.clientName}
              </Link>
            ))}
            <Link
              href="/growth/campaigns/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#15181e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#20242c]"
            >
              <KeyRound className="h-3.5 w-3.5" />
              New campaign
            </Link>
          </div>
        </div>
      </div>

      <nav aria-label="Local Growth OS modules" className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-card)]">
        <ul className="flex min-w-max gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-emerald-400" : "text-slate-400")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
