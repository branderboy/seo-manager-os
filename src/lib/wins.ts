// ──────────────────────────────────────────────────────────────────────────
// Wins Feed + Morning Briefing data.
// Every morning, show momentum: what moved, indexed, ranked, passed, shipped.
// ──────────────────────────────────────────────────────────────────────────

export type WinKind = "Index" | "Rank" | "Technical" | "Content" | "Review" | "Deploy" | "Traffic";

export type WinItem = {
  id: string;
  text: string;
  client: string;
  kind: WinKind;
  when: string;
  group: "This morning" | "Yesterday" | "This week";
};

export const winsFeed: WinItem[] = [
  { id: "1", text: "Google indexed 12 new collection pages", client: "Acme Corp", kind: "Index", when: "6:10 AM", group: "This morning" },
  { id: "2", text: "Moved to #2 for 'emergency plumber'", client: "Vantage Retail", kind: "Rank", when: "5:40 AM", group: "This morning" },
  { id: "3", text: "Core Web Vitals passed on 9 templates", client: "Hill Country Dental", kind: "Technical", when: "4:20 AM", group: "This morning" },
  { id: "4", text: "Organic traffic +18% week-over-week", client: "Hill Country Dental", kind: "Traffic", when: "Overnight", group: "This morning" },
  { id: "5", text: "Client approved 6 content briefs", client: "Flowdesk", kind: "Content", when: "Yesterday, 5:02 PM", group: "Yesterday" },
  { id: "6", text: "Schema validated on all service pages", client: "Northwind Heating & Air", kind: "Technical", when: "Yesterday, 3:15 PM", group: "Yesterday" },
  { id: "7", text: "Developer deployed title-tag fixes (12 pages)", client: "Hill Country Dental", kind: "Deploy", when: "Yesterday, 1:40 PM", group: "Yesterday" },
  { id: "8", text: "3 new 5-star Google reviews", client: "Northwind Heating & Air", kind: "Review", when: "Yesterday", group: "Yesterday" },
  { id: "9", text: "Recovered rankings on 2 outer ZIPs", client: "Northwind Heating & Air", kind: "Rank", when: "Mon", group: "This week" },
  { id: "10", text: "Migration batch 1 verified — 0 broken redirects", client: "Acme Corp", kind: "Deploy", when: "Mon", group: "This week" },
];

export const winGroups: { group: WinItem["group"]; items: WinItem[] }[] = [
  { group: "This morning", items: winsFeed.filter((w) => w.group === "This morning") },
  { group: "Yesterday", items: winsFeed.filter((w) => w.group === "Yesterday") },
  { group: "This week", items: winsFeed.filter((w) => w.group === "This week") },
];

// ── Morning Briefing — the daily narrative for the Command Center ────────────
export const morningBriefing = {
  headline: "5 wins overnight, 9 tasks due today, 3 blockers.",
  focus: [
    "Northwind Heating & Air is the top-risk account — traffic down and review velocity stalled. Approve the 6 location-page briefs to unblock content.",
    "Hill Country Dental's schema deploy has been waiting on the developer for 3 days — nudge or escalate.",
    "Vantage Retail jumped to #2 for 'emergency plumber' overnight — worth a quick client note.",
  ],
  overnight: [
    "12 pages indexed (Acme Corp)",
    "CWV passed on 9 templates (Hill Country Dental)",
    "Traffic +18% WoW (Hill Country)",
  ],
};
