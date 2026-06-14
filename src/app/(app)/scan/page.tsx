import { ScanForm } from "@/components/ScanForm";

export default function ScanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-sm text-slate-500">
          Feed in domains to run the full discovery → classification → scoring
          pipeline. Results land in your Leads table automatically.
        </p>
      </div>
      <ScanForm />
    </div>
  );
}
