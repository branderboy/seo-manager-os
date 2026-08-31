import type { Metadata } from "next";
import { GrowthNav } from "@/components/local-growth/growth-nav";

export const metadata: Metadata = {
  title: {
    default: "Local Growth OS",
    template: "%s · Local Growth OS",
  },
};

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <GrowthNav />
      {children}
    </div>
  );
}
