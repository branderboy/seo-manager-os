// ──────────────────────────────────────────────────────────────────────────
// Workflow dependencies — how a piece of work flows through the system.
// Managers need to see work moving, and where it's stuck.
// ──────────────────────────────────────────────────────────────────────────

export type NodeStatus = "flowing" | "waiting" | "done";

export type FlowNode = {
  stage: string;
  count: number; // items currently at this stage
  status: NodeStatus;
  note?: string; // why it's waiting, if it is
};

export const contentFlow: FlowNode[] = [
  { stage: "Keyword Research", count: 0, status: "done" },
  { stage: "Intent Mapping", count: 0, status: "done" },
  { stage: "Content Brief", count: 6, status: "waiting", note: "client approval" },
  { stage: "Written", count: 3, status: "flowing" },
  { stage: "Review", count: 2, status: "flowing" },
  { stage: "Approval", count: 4, status: "waiting", note: "client" },
  { stage: "Published", count: 5, status: "flowing" },
  { stage: "Indexed", count: 8, status: "waiting", note: "Google" },
  { stage: "Ranking", count: 12, status: "flowing" },
  { stage: "Optimization", count: 7, status: "flowing" },
  { stage: "Refresh", count: 0, status: "done" },
];

export const flowSummary = {
  inFlight: contentFlow.reduce((s, n) => s + n.count, 0),
  bottleneck: contentFlow
    .filter((n) => n.status === "waiting")
    .sort((a, b) => b.count - a.count)[0],
};
