import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDashboard } from "@/components/local-growth/campaign-dashboard";
import { demoCampaigns } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return demoCampaigns.map((campaign) => ({ id: campaign.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = demoCampaigns.find((campaign) => campaign.id === id);
  return { title: match ? match.clientName : "Campaign" };
}

export default async function CampaignDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!demoCampaigns.some((campaign) => campaign.id === id)) notFound();
  return <CampaignDashboard campaignId={id} />;
}
