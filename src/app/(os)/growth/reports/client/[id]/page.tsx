import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientReportView } from "@/components/local-growth/module-screens";
import { demoCampaigns, reports } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = reports.find((report) => report.id === id);
  const campaign = match && demoCampaigns.find((item) => item.id === match.campaignId);
  return {
    title: match ? `${campaign?.clientName ?? "Client"} report · ${match.period}` : "Client Report",
  };
}

export default async function ClientReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!reports.some((report) => report.id === id)) notFound();
  return <ClientReportView reportId={id} />;
}
