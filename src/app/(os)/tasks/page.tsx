import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskLifecycle } from "@/components/tasks/task-lifecycle";
import { TaskLifecycleBoard } from "@/components/tasks/task-lifecycle-board";

export const metadata: Metadata = { title: "Daily Task Engine" };

export default function TasksPage() {
  return (
    <>
      <PageHeader
        stage={8}
        title="Daily Task Engine"
        badge="Stay on task"
        description="The plan, broken into a daily worklist. Automated email alerts keep every owner on task and on time — so the strategy actually ships."
      />
      <TaskLifecycle />
      <TaskLifecycleBoard />
      <TaskBoard />
    </>
  );
}
