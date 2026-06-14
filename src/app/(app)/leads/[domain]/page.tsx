import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadByDomain } from "@/services/leads";
import { AssistantPanel } from "@/components/AssistantPanel";
import { LeadOutreach } from "@/components/LeadOutreach";
import { scoreColor, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TECH_LABELS: { key: string; label: string }[] = [
  { key: "elementor", label: "Elementor" },
  { key: "wpforms", label: "WPForms" },
  { key: "gravityForms", label: "Gravity Forms" },
  { key: "contactForm7", label: "Contact Form 7" },
  { key: "woocommerce", label: "WooCommerce" },
  { key: "rankMath", label: "Rank Math" },
  { key: "yoast", label: "Yoast" },
  { key: "bookingSystem", label: "Booking System" },
  { key: "quoteSystem", label: "Quote System" },
];

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const lead = await getLeadByDomain(domain);
  if (!lead) notFound();

  const { website, technology, missingFeatures } = lead;
  const tech = technology as Record<string, unknown> | null;

  return (
    <div className="space-y-6">
      <Link href="/leads" className="text-sm text-brand-600">
        ← Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {website.companyName ?? website.domain}
            </h1>
            {website.wordpressDetected && (
              <span className="badge bg-blue-100 text-blue-700">WordPress</span>
            )}
          </div>
          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-600 hover:underline"
          >
            {website.domain} ↗
          </a>
        </div>
        <div className="text-right">
          <span
            className={`badge text-base ${scoreColor(website.opportunityScore)}`}
          >
            Opportunity {website.opportunityScore}
          </span>
          <p className="mt-1 text-xs text-slate-400">
            Scanned {formatDate(website.lastScannedAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Business Profile</h2>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Industry" value={website.industry} />
              <Field label="Sub-Industry" value={website.subIndustry} />
              <Field label="Location" value={website.location} />
              <Field label="Contact" value={website.contactName} />
              <Field label="Phone" value={website.phone} />
              <Field
                label="Email"
                value={
                  website.email ? (
                    <a className="text-brand-600" href={`mailto:${website.email}`}>
                      {website.email}
                    </a>
                  ) : null
                }
              />
              <Field
                label="Confidence"
                value={
                  website.classificationConfidence != null
                    ? `${Math.round(website.classificationConfidence * 100)}%`
                    : null
                }
              />
            </dl>
            {website.metaDescription && (
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                {website.metaDescription}
              </p>
            )}
          </div>

          <AssistantPanel domain={website.domain} />

          <LeadOutreach domain={website.domain} hasEmail={Boolean(website.email)} />
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {tech &&
                TECH_LABELS.filter((t) => Boolean(tech[t.key])).map((t) => (
                  <span key={t.key} className="badge bg-slate-100 text-slate-700">
                    {t.label}
                  </span>
                ))}
              {(!tech || TECH_LABELS.every((t) => !tech[t.key])) && (
                <span className="text-sm text-slate-400">None detected</span>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Missing Features</h2>
            {missingFeatures.length === 0 ? (
              <p className="text-sm text-slate-400">Fully equipped</p>
            ) : (
              <ul className="space-y-1.5">
                {missingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-red-400">✕</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card border-brand-200 bg-brand-50 p-5">
            <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-700">
              Suggested Product To Sell
            </h2>
            <p className="text-lg font-semibold text-brand-900">
              {website.suggestedProduct ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
