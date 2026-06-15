import { Sidebar } from "@/components/layout/sidebar";
import { StageBar } from "@/components/layout/stage-bar";
import { EngagementProvider } from "@/components/engagement/store";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <EngagementProvider>
      <div className="flex min-h-screen bg-[var(--surface-2)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <StageBar />
          <main className="flex-1 px-5 py-8 sm:px-8">
            <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </EngagementProvider>
  );
}
