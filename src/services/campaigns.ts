import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, type Campaign } from "@/db/schema";
import { discoverContractors } from "./discovery/discover";

export type CampaignRunResult = {
  campaignId: number;
  name: string;
  summary: Record<string, number>;
};

/** Is a campaign due to run now, based on its frequency and last run time? */
export function isDue(c: Campaign, now = new Date()): boolean {
  if (!c.enabled || c.frequency === "manual") return false;
  if (!c.lastRunAt) return true;
  const hours = (now.getTime() - new Date(c.lastRunAt).getTime()) / 3_600_000;
  // Subtract a small slack so a daily cron at a fixed time always qualifies.
  const threshold = c.frequency === "weekly" ? 24 * 7 - 2 : 24 - 2;
  return hours >= threshold;
}

/** Run one campaign end-to-end and persist its run summary. */
export async function runCampaign(campaign: Campaign): Promise<CampaignRunResult> {
  const result = await discoverContractors({
    industries: campaign.industries,
    locations: campaign.locations,
    limit: campaign.perRunLimit,
  });

  const summary: Record<string, number> = {
    candidatesFound: result.candidatesFound,
    scanned: result.scanned,
    wordpressSites: result.wordpressSites,
    contractorSites: result.contractorSites,
    emailsFound: result.emailsFound,
    newSites: result.newSites,
  };

  await db
    .update(campaigns)
    .set({ lastRunAt: new Date(), lastRunSummary: summary, updatedAt: new Date() })
    .where(eq(campaigns.id, campaign.id));

  return { campaignId: campaign.id, name: campaign.name, summary };
}

export async function runCampaignById(id: number): Promise<CampaignRunResult | null> {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
  if (!campaign) return null;
  return runCampaign(campaign);
}

/**
 * Run every campaign that's due. Bounded per invocation so a single cron tick
 * never blows the serverless time limit; the rest run on the next tick.
 */
export async function runDueCampaigns(maxPerTick = 5): Promise<{
  ran: CampaignRunResult[];
  due: number;
}> {
  const all = await db.select().from(campaigns).orderBy(desc(campaigns.lastRunAt));
  const due = all.filter((c) => isDue(c));
  const batch = due.slice(0, maxPerTick);

  const ran: CampaignRunResult[] = [];
  for (const campaign of batch) {
    try {
      ran.push(await runCampaign(campaign));
    } catch (err) {
      console.error(`[campaigns] run failed for #${campaign.id}:`, err);
    }
  }
  return { ran, due: due.length };
}
