import { notFound } from "next/navigation";
import { ClientReportView } from "@/components/local-growth/module-screens";
import { reports } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export default function ClientReportPage({ params }: { params: { id: string } }) {
  if (!reports.some((report) => report.id === params.id)) notFound();
  return <ClientReportView reportId={params.id} />;
}
