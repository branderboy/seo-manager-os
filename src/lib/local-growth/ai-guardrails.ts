export type AiDraftKind =
  | "audit_summary"
  | "strategy_roadmap"
  | "keyword_clustering"
  | "title_meta"
  | "content_brief"
  | "faq_ideas"
  | "schema_jsonld"
  | "monthly_report"
  | "review_response"
  | "competitor_gap"
  | "slack_status"
  | "client_asset_request";

export type AiDraftRequest = {
  kind: AiDraftKind;
  campaignId: string;
  sourceData: Record<string, unknown>;
  requestedBy: string;
};

export type AiDraft = {
  id: string;
  kind: AiDraftKind;
  campaignId: string;
  sourceData: Record<string, unknown>;
  output: string;
  assumptions: string[];
  warnings: string[];
  status: "draft" | "human_approved" | "rejected";
  requestedBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
};

export const AI_SYSTEM_GUARDRAILS = `
You are a draft-generation assistant inside Local Growth OS.

NON-NEGOTIABLE RULES:
- Use only supplied campaign data. Never fabricate business credentials, service areas, pricing, project details, reviews, rankings, citations, results, revenue, or Google policy claims.
- Clearly label assumptions. If required source data is absent, say the data is insufficient rather than filling the gap.
- Never recommend keyword-stuffed Google Business Profile names, fake locations, virtual-office abuse, duplicate profiles, fake reviews, review gating, deceptive doorway pages, or other manipulative local-search tactics.
- Revenue may appear only when an explicit source field supplies it.
- Schema must describe visible page content; never promise rich-result eligibility.
- Drafts are internal until a human strategist approves them.
- Preserve a source-data record with every draft so reviewers can trace each claim.
` as const;

export function sourceDataIsSufficient(request: AiDraftRequest): { ok: boolean; missing: string[] } {
  const keys = Object.keys(request.sourceData).filter((key) => request.sourceData[key] != null && request.sourceData[key] !== "");
  const minimumByKind: Partial<Record<AiDraftKind, number>> = {
    audit_summary: 2,
    strategy_roadmap: 3,
    keyword_clustering: 2,
    content_brief: 4,
    faq_ideas: 2,
    schema_jsonld: 3,
    monthly_report: 4,
    competitor_gap: 3,
    client_asset_request: 2,
  };
  const minimum = minimumByKind[request.kind] ?? 1;
  return {
    ok: keys.length >= minimum,
    missing: keys.length >= minimum ? [] : [`Need at least ${minimum} grounded source fields; received ${keys.length}.`],
  };
}

export function canPublishAiDraft(draft: AiDraft) {
  return draft.status === "human_approved" && draft.warnings.length === 0;
}

export function buildAiPrompt(request: AiDraftRequest) {
  const sufficiency = sourceDataIsSufficient(request);
  return [
    AI_SYSTEM_GUARDRAILS.trim(),
    `\nDRAFT TYPE: ${request.kind}`,
    `CAMPAIGN ID: ${request.campaignId}`,
    `SOURCE DATA:\n${JSON.stringify(request.sourceData, null, 2)}`,
    sufficiency.ok
      ? "Return an editable internal draft and a short list of assumptions."
      : `INSUFFICIENT DATA WARNING: ${sufficiency.missing.join(" ")} Do not invent the missing facts.`,
  ].join("\n");
}
