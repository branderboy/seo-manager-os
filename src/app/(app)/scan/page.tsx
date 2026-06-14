import { DiscoverWorkspace } from "@/components/DiscoverWorkspace";

export default function ScanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-sm text-slate-500">
          Find local contractor websites by industry + city, or paste domains
          directly. Everything runs the WordPress → classify → score pipeline and
          lands in your Leads table.
        </p>
      </div>
      <DiscoverWorkspace />
    </div>
  );
}
