"use client";

import * as React from "react";
import { dailyTasks } from "@/lib/data";
import type { DailyTask, TaskRole, Playbook } from "@/lib/data";

/** Which team role a generated playbook task is routed to. */
const ROLE_FOR_PLAYBOOK: Record<string, TaskRole> = {
  traffic: "Content (On-Page)",
  ctr: "Content (On-Page)",
  lead: "Content (On-Page)",
  revenue: "Content (On-Page)",
  local: "Local / GBP",
  geo: "Tech SEO",
  aeo: "Tech SEO",
};

type TaskStore = {
  tasks: DailyTask[];
  toggle: (id: string) => void;
  addedPlaybooks: string[];
  addPlaybook: (pb: Playbook) => void;
};

const Ctx = React.createContext<TaskStore | null>(null);

export function TaskStoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<DailyTask[]>(dailyTasks);
  const [addedPlaybooks, setAdded] = React.useState<string[]>([]);

  const toggle = React.useCallback(
    (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    []
  );

  const addPlaybook = React.useCallback((pb: Playbook) => {
    const prefix = `pb-${pb.key}-`;
    setAdded((prev) => (prev.includes(pb.key) ? prev : [...prev, pb.key]));
    setTasks((prev) => {
      if (prev.some((t) => t.id.startsWith(prefix))) return prev; // already generated
      const role = ROLE_FOR_PLAYBOOK[pb.key] ?? "Content (On-Page)";
      const generated: DailyTask[] = pb.plays.map((play, i) => ({
        id: `${prefix}${i}`,
        name: play,
        owner: "SEO Lead",
        role,
        priority: "Medium",
        due: "This week",
        source: `Playbook · ${pb.name}`,
        done: false,
        group: "This week",
      }));
      return [...prev, ...generated];
    });
  }, []);

  const value = React.useMemo(
    () => ({ tasks, toggle, addedPlaybooks, addPlaybook }),
    [tasks, addedPlaybooks, toggle, addPlaybook]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTaskStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTaskStore must be used within TaskStoreProvider");
  return ctx;
}

/** True for tasks generated from a playbook (vs. the seeded daily tasks). */
export const isGenerated = (id: string) => id.startsWith("pb-");
