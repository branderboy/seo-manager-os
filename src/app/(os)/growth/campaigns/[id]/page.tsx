import { notFound } from "next/navigation";
import { CampaignDashboard } from "@/components/local-growth/campaign-dashboard";
import { demoCampaigns } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return demoCampaigns.map((campaign) => ({ id: campaign.id }));
}

export default function CampaignDashboardPage({ params }: { params: { id: string } }) {
  if (!demoCampaigns.some((campaign) => campaign.id === params.id)) notFound();
  return <CampaignDashboard campaignId={params.id} />;
}
