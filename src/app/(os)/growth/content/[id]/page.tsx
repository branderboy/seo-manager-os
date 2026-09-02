import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBriefDetail } from "@/components/local-growth/module-screens";
import { contentItems } from "@/lib/local-growth/demo-data";

export function generateStaticParams() {
  return contentItems.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const match = contentItems.find((item) => item.id === params.id);
  return { title: match ? match.title : "Content Brief" };
}

export default function ContentBriefPage({ params }: { params: { id: string } }) {
  if (!contentItems.some((item) => item.id === params.id)) notFound();
  return <ContentBriefDetail itemId={params.id} />;
}
