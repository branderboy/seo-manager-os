import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBriefDetail } from "@/components/local-growth/module-screens";
import { contentItems } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return contentItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = contentItems.find((item) => item.id === id);
  return { title: match ? match.title : "Content Brief" };
}

export default async function ContentBriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!contentItems.some((item) => item.id === id)) notFound();
  return <ContentBriefDetail itemId={id} />;
}
