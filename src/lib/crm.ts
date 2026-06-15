// Workspace identity + client list for SEO Manager OS.
export type Model = "Local" | "SaaS" | "Enterprise";

export const currentUser = {
  name: "Josh Williamson",
  agency: "Boring SEO Agency",
  initials: "JW",
  trialDays: 14,
};

export type Client = {
  id: string;
  name: string;
  model: Model;
  industry: string;
  location: string;
  health: number;
  visibility: number;
  ai: number;
  status: "Active" | "Onboarding" | "Paused";
  owner: string;
  initials: string;
  color: string;
};

export const clients: Client[] = [
  { id: "northwind", name: "Northwind Heating & Air", model: "Local", industry: "HVAC / Home Services", location: "Austin, TX", health: 48, visibility: 48, ai: 29, status: "Active", owner: "Josh Williamson", initials: "NW", color: "bg-emerald-600" },
  { id: "acme", name: "Acme Corp", model: "SaaS", industry: "B2B Software", location: "San Francisco, CA", health: 62, visibility: 56, ai: 34, status: "Active", owner: "Josh Williamson", initials: "AC", color: "bg-blue-600" },
  { id: "vantage", name: "Vantage Retail", model: "Enterprise", industry: "E-commerce", location: "New York, NY", health: 53, visibility: 53, ai: 27, status: "Active", owner: "Priya Nair", initials: "VR", color: "bg-violet-600" },
  { id: "flowdesk", name: "Flowdesk", model: "SaaS", industry: "Workflow Automation", location: "Seattle, WA", health: 56, visibility: 56, ai: 34, status: "Onboarding", owner: "Jordan Reyes", initials: "FD", color: "bg-amber-600" },
  { id: "hillcountry", name: "Hill Country Dental", model: "Local", industry: "Dental", location: "Austin, TX", health: 67, visibility: 61, ai: 41, status: "Paused", owner: "Josh Williamson", initials: "HC", color: "bg-cyan-700" },
];

export const clientById = (id: string) => clients.find((c) => c.id === id);
