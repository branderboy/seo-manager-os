import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TaskBoard } from "@/components/tasks/task-board";

export const metadata: Metadata = { title: "Daily Task Engine" };

export default function TasksPage() {
  return (
    <>
      <PageHeader
        stage={7}
        title="Daily Task Engine"
        badge="Stay on task"
        description="The plan, broken into a daily worklist. Automated email alerts keep every owner on task and on time — so the strategy actually ships."
      />
      <TaskBoard />
    </>
  );
}
