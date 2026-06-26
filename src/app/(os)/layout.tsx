import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ViewIndicator } from "@/components/layout/view-indicator";
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
            {/* Top bar · view indicator (and the mobile menu trigger below lg) */}
            <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:px-8">
              <div className="flex items-center gap-2 lg:hidden">
                <MobileNav />
                <span className="text-sm font-bold tracking-tight">SEO Manager OS</span>
              </div>
              <div className="hidden lg:block" />
              <ViewIndicator />
            </div>
            <main className="flex-1 overflow-y-auto bg-[var(--canvas)] px-5 py-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-[1440px] space-y-6 pb-20">{children}</div>
            </main>
          </div>
        </div>
        </HandoffProvider>
      </TaskStoreProvider>
    </EngagementProvider>
  );
}
