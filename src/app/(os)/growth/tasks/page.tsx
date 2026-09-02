import type { Metadata } from "next";
import { TasksView } from "@/components/local-growth/tasks-view";

export const metadata: Metadata = { title: "Tasks" };

export default function GrowthTasksPage() {
  return <TasksView />;
}
