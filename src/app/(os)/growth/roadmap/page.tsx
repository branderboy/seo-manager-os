import type { Metadata } from "next";
import { RoadmapBoard } from "@/components/local-growth/roadmap-board";

export const metadata: Metadata = { title: "Roadmap" };

export default function RoadmapPage() {
  return <RoadmapBoard />;
}
