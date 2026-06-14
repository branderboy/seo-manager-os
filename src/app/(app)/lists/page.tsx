import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leadLists } from "@/db/schema";
import { filtersToQuery } from "@/lib/filters";
import { DeleteListButton } from "@/components/DeleteListButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ListsPage() {
  const lists = await db.select().from(leadLists).orderBy(desc(leadLists.createdAt));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Saved Lists</h1>
        <p className="text-sm text-slate-500">
          Reusable prospect segments defined by filters.
        </p>
      </div>

      {lists.length === 0 ? (
        <div className="card p-12 text-center text-sm text-slate-500">
          No saved lists yet. Build a filtered view on the{" "}
          <Link href="/leads" className="font-medium text-brand-600">
            Leads
          </Link>{" "}
          page and click “Save as list”.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {lists.map((list) => (
            <div key={list.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-900">{list.listName}</h3>
                <DeleteListButton id={list.id} />
              </div>
              {list.description && (
                <p className="mt-1 text-sm text-slate-500">{list.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(list.filters)
                  .filter(([, v]) => v !== undefined && v !== "" && v !== false)
                  .map(([k, v]) => (
                    <span key={k} className="badge bg-slate-100 text-slate-600">
                      {k}: {String(v)}
                    </span>
                  ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">
                  {list.totalResults.toLocaleString()} leads · {formatDate(list.createdAt)}
                </span>
                <Link
                  href={`/leads?${filtersToQuery(list.filters)}`}
                  className="text-sm font-medium text-brand-600"
                >
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
