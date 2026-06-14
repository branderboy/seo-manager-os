import { desc } from "drizzle-orm";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { CampaignForm } from "@/components/CampaignForm";
import { CampaignRow } from "@/components/CampaignRow";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const rows = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-sm text-slate-500">
            Save trades + cities once. Active campaigns run automatically on
            schedule — discover, confirm WordPress, score, and find emails — so new
            leads keep flowing in with no clicks.
          </p>
        </div>
        <CampaignForm />
      </div>

      {rows.length === 0 ? (
        <div className="card p-12 text-center text-sm text-slate-500">
          No campaigns yet. Create one to put lead discovery on autopilot.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((c) => (
            <CampaignRow
              key={c.id}
              campaign={{
                id: c.id,
                name: c.name,
                industries: c.industries,
                locations: c.locations,
                frequency: c.frequency,
                perRunLimit: c.perRunLimit,
                enabled: c.enabled,
                lastRunAt: c.lastRunAt ? new Date(c.lastRunAt).toISOString() : null,
                lastRunSummary: c.lastRunSummary,
              }}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Automatic runs require the cron job (configured in vercel.json) and a
        CRON_SECRET. You can always press “Run now” regardless.
      </p>
    </div>
  );
}
