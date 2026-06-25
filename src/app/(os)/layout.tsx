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
        <div className="flex h-screen overflow-hidden bg-panel">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <StageBar />
            <main className="flex-1 overflow-y-auto bg-panel px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-6xl space-y-6 pb-16">{children}</div>
            </main>
          </div>
        </div>
        </HandoffProvider>
      </TaskStoreProvider>
    </EngagementProvider>
  );
}
