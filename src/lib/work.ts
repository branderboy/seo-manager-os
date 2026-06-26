// ──────────────────────────────────────────────────────────────────────────
// Work model · the task lifecycle and the project command-center board.
// Every recommendation becomes work that moves through a lifecycle:
//   Fix → Assign → Complete → QA → Deploy → Verify → Close
// The Tracker groups the same tasks into operational lanes.
// ──────────────────────────────────────────────────────────────────────────

export const lifecycle = ["Fix", "Assign", "Complete", "QA", "Deploy", "Verify", "Close"] as const;
export type Step = (typeof lifecycle)[number];

export type Lane =
  | "Active"
  | "QA & Deploy"
  | "Waiting on Client"
  | "Waiting on Developer"
  | "Waiting on Content"
  | "Waiting on Google"
  | "Done";

export type Priority = "High" | "Medium" | "Low";

export type WorkTask = {
  id: string;
  title: string;
  client: string;
  owner: string;
  due: string;
  priority: Priority;
  step: Step;
  lane: Lane;
};

export const workTasks: WorkTask[] = [
  { id: "w1", title: "Fix title tags on 12 service pages", client: "Hill Country Dental", owner: "Priya", due: "Today", priority: "High", step: "Verify", lane: "QA & Deploy" },
  { id: "w2", title: "Publish 'AC Repair Austin' service page", client: "Northwind Heating & Air", owner: "Jordan", due: "Today", priority: "High", step: "Complete", lane: "Active" },
  { id: "w3", title: "Approve 6 location-page briefs", client: "Northwind Heating & Air", owner: "Client", due: "Today", priority: "High", step: "Assign", lane: "Waiting on Client" },
  { id: "w4", title: "Deploy FAQ schema to 8 pages", client: "Northwind Heating & Air", owner: "Dev team", due: "Tomorrow", priority: "Medium", step: "Deploy", lane: "Waiting on Developer" },
  { id: "w5", title: "Write 3 collection descriptions", client: "Acme Corp", owner: "Sam", due: "Thu", priority: "Medium", step: "Complete", lane: "Active" },
  { id: "w6", title: "Index new collection pages", client: "Acme Corp", owner: "Google", due: "Pending", priority: "Medium", step: "Verify", lane: "Waiting on Google" },
  { id: "w7", title: "Build internal-link plan", client: "Vantage Retail", owner: "Marcus", due: "Fri", priority: "Low", step: "Fix", lane: "Active" },
  { id: "w8", title: "QA homepage meta + H1 changes", client: "Vantage Retail", owner: "Priya", due: "Today", priority: "Medium", step: "QA", lane: "QA & Deploy" },
  { id: "w9", title: "Client to supply 4 project photos", client: "Flowdesk", owner: "Client", due: "Wed", priority: "Low", step: "Assign", lane: "Waiting on Client" },
  { id: "w10", title: "Approve hero copy rewrite", client: "Hill Country Dental", owner: "Sam", due: "Wed", priority: "Medium", step: "QA", lane: "Waiting on Content" },
  { id: "w11", title: "Redirect map · migration batch 2", client: "Acme Corp", owner: "Dev team", due: "Fri", priority: "High", step: "Deploy", lane: "Waiting on Developer" },
  { id: "w12", title: "Fix NAP across 9 citations", client: "Northwind Heating & Air", owner: "Priya", due: "Today", priority: "Medium", step: "Complete", lane: "Active" },
  { id: "w13", title: "Schema validated on service pages", client: "Northwind Heating & Air", owner: "Priya", due: "Done", priority: "Medium", step: "Close", lane: "Done" },
  { id: "w14", title: "CWV pass on 9 templates", client: "Hill Country Dental", owner: "Dev team", due: "Done", priority: "Medium", step: "Close", lane: "Done" },
];

export const laneOrder: Lane[] = [
  "Active",
  "QA & Deploy",
  "Waiting on Client",
  "Waiting on Developer",
  "Waiting on Content",
  "Waiting on Google",
  "Done",
];

export function tasksByLane(): { lane: Lane; tasks: WorkTask[] }[] {
  return laneOrder
    .map((lane) => ({ lane, tasks: workTasks.filter((t) => t.lane === lane) }))
    .filter((g) => g.tasks.length > 0);
}

export function countByStep(): { step: Step; count: number }[] {
  return lifecycle.map((step) => ({ step, count: workTasks.filter((t) => t.step === step).length }));
}

/** Upcoming deadlines (named days only), highest priority first. */
export const deadlines = workTasks
  .filter((t) => !["Done", "Pending"].includes(t.due))
  .slice(0, 6);
