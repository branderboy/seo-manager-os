import { DiscoverWorkspace } from "@/components/DiscoverWorkspace";

export default function ScanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-sm text-slate-500">
          Pick trades + cities and hit <strong>Run campaign</strong> — it finds
          contractor sites, confirms WordPress, scores the opportunity, and finds
          emails, all in one click. Leads land in your Leads table. You never log
          into Hunter; it&apos;s called via API behind the scenes.
        </p>
      </div>
      <DiscoverWorkspace />
    </div>
  );
}
