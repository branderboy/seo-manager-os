import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientReportView } from "@/components/local-growth/module-screens";
import { demoCampaigns, reports } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const match = reports.find((report) => report.id === params.id);
  const campaign = match && demoCampaigns.find((item) => item.id === match.campaignId);
  return {
    title: match ? `${campaign?.clientName ?? "Client"} report · ${match.period}` : "Client Report",
  };
}

export default function ClientReportPage({ params }: { params: { id: string } }) {
  if (!reports.some((report) => report.id === params.id)) notFound();
  return <ClientReportView reportId={params.id} />;
}
