import { Sidebar } from "@/components/layout/sidebar";
import { StageBar } from "@/components/layout/stage-bar";
import { EngagementProvider } from "@/components/engagement/store";
import { TaskStoreProvider } from "@/components/tasks/task-store";
import { HandoffProvider } from "@/components/flow/handoff-store";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <EngagementProvider>
      <TaskStoreProvider>
        <HandoffProvider>
        <div className="flex h-screen overflow-hidden bg-[var(--canvas)]">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <StageBar />
            <main className="flex-1 overflow-y-auto bg-[var(--canvas)] px-6 py-7 lg:px-9">
              <div className="mx-auto w-full max-w-[1400px] space-y-7 pb-20">{children}</div>
            </main>
          </div>
        </div>
        </HandoffProvider>
      </TaskStoreProvider>
    </EngagementProvider>
  );
}
