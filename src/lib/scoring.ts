// ──────────────────────────────────────────────────────────────────────────
// SEO Manager OS — Scoring model (Local SEO)
//
// Grounded scores: every number traces to its inputs — NO invented values.
//   Results     = current performance vs. the client's own baseline AND the market
//   Opportunity = winnable upside (demand × the click gap at current vs. target rank)
//   Difficulty  = effort/competitiveness to close it
//   Priority    ≈ (Opportunity ÷ Difficulty), weighted by the Results trend
//
// All component scores normalize to 0–100 (higher = better, except Difficulty where
// higher = harder). Each function returns a `Traceable` carrying the inputs and the
// intermediate terms, so any score can be audited back to its source numbers.
// See docs/SCORING.md for the rationale and worked example.
// ──────────────────────────────────────────────────────────────────────────

export type Score = number; // normalized 0–100

/** A score plus the inputs and intermediate terms that produced it. */
export type Traceable<I> = {
  score: Score;
  inputs: I;
  breakdown: Record<string, number>;
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = (n: number, dp = 2) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

/** Average SERP/local rank → 0–100 (rank 1 = 100, rank 21+ ≈ 0). 5 pts per position. */
export function rankToScore(avgRank: number): Score {
  if (avgRank <= 0) return 0; // 0 = not ranking
  return clamp(round(100 - (avgRank - 1) * 5));
}

/**
 * Period-over-period trend as a multiplier centred on 1.0 (improvement > 1, decline < 1).
 * Influence is capped at ±50% so one noisy metric can't dominate.
 */
export function trendFactor(current: number, baseline: number, lowerIsBetter = false): number {
  if (baseline <= 0) return 1;
  const raw = lowerIsBetter ? baseline / current : current / baseline;
  return clamp(round(raw), 0.5, 1.5);
}

/** Approximate local/organic click-through rate by position (page-1 tail ≈ 1%). */
const CTR_BY_RANK: Record<number, number> = {
  1: 0.32, 2: 0.17, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.045, 7: 0.035, 8: 0.03, 9: 0.025, 10: 0.022,
};
export function ctrAt(rank: number): number {
  if (rank <= 0) return 0; // not ranking → no clicks
  if (rank >= 11) return 0.01;
  return CTR_BY_RANK[rank] ?? 0.01;
}

// ── Results ─────────────────────────────────────────────────────────────────
export type ResultsInputs = {
  avgRank: number; // current avg rank across tracked terms (lower is better)
  marketAvgRank: number; // median competitor rank in the market
  localPackShare: number; // 0–100, share of tracked local-pack appearances
  gbpActions: number; // calls + directions + website clicks this period
  baselineGbpActions: number;
  leads: number;
  baselineLeads: number;
};

/**
 * Results: how the business is actually performing now, normalized vs. its own baseline
 * and the local market. Blend — rank-vs-market 40%, local-pack share 25%, GBP actions 20%,
 * leads 15% — with GBP/leads expressed through their period-over-period trend.
 */
export function resultsScore(i: ResultsInputs): Traceable<ResultsInputs> {
  const rank = rankToScore(i.avgRank);
  const marketFactor = trendFactor(i.avgRank, i.marketAvgRank, true); // >1 when we beat market
  const rankVsMarket = clamp(round(rank * marketFactor));

  const pack = clamp(i.localPackShare);
  const gbpTrend = trendFactor(i.gbpActions, i.baselineGbpActions);
  const leadsTrend = trendFactor(i.leads, i.baselineLeads);
  const gbp = clamp(round(50 * gbpTrend)); // 50 = flat vs. baseline, scaled by trend
  const leads = clamp(round(50 * leadsTrend));

  const score = clamp(round(rankVsMarket * 0.4 + pack * 0.25 + gbp * 0.2 + leads * 0.15));
  return {
    score,
    inputs: i,
    breakdown: { rank, marketFactor, rankVsMarket, pack, gbpTrend, gbp, leadsTrend, leads },
  };
}

// ── Opportunity ───────────────────────────────────────────────────────────────
export type OpportunityInputs = {
  monthlyDemand: number; // search volume for the term/cluster
  currentRank: number; // 0 = not ranking
  targetRank?: number; // realistic reachable rank (default: top-3 for local)
};

/**
 * Opportunity = demand × the click gap between current and a reachable target rank,
 * expressed as winnable monthly clicks and normalized to 0–100 on a log scale
 * (≈1,000 winnable clicks/mo → 100).
 */
export function opportunityScore(i: OpportunityInputs): Traceable<OpportunityInputs> {
  const target = i.targetRank ?? 3;
  const ctrCurrent = ctrAt(i.currentRank);
  const ctrTarget = ctrAt(target);
  const winnableClicks = Math.max(0, i.monthlyDemand * (ctrTarget - ctrCurrent));
  const score = clamp(round((Math.log10(winnableClicks + 1) / Math.log10(1001)) * 100));
  return {
    score,
    inputs: i,
    breakdown: { target, ctrCurrent, ctrTarget, winnableClicks: round(winnableClicks, 0) },
  };
}

// ── Difficulty ────────────────────────────────────────────────────────────────
export type DifficultyInputs = {
  competitorStrength: number; // 0–100, median competitor authority/trust in market
  reviewGap: number; // competitor reviews ÷ our reviews (≥1; 5× = maxed)
  contentNeeded: number; // pages/assets to build (capped at 20)
  linksNeeded: number; // referring domains to close the gap (capped at 50)
};

/**
 * Difficulty: how hard the opportunity is to close. Blend — competitor strength 40%,
 * review gap 25%, content needed 20%, links needed 15%. Floored at 1 to stay valid as a
 * divisor. Higher = harder.
 */
export function difficultyScore(i: DifficultyInputs): Traceable<DifficultyInputs> {
  const comp = clamp(i.competitorStrength);
  const review = clamp((Math.min(i.reviewGap, 5) / 5) * 100);
  const content = clamp((Math.min(i.contentNeeded, 20) / 20) * 100);
  const links = clamp((Math.min(i.linksNeeded, 50) / 50) * 100);
  const score = clamp(round(comp * 0.4 + review * 0.25 + content * 0.2 + links * 0.15), 1);
  return { score, inputs: i, breakdown: { comp, review, content, links } };
}

// ── Priority ──────────────────────────────────────────────────────────────────
export type PriorityInputs = {
  opportunity: Score; // 0–100
  difficulty: Score; // 1–100
  resultsTrend: number; // results trend multiplier (~0.5–1.5); decline raises urgency
};

/**
 * Priority ≈ (Opportunity ÷ Difficulty), weighted by the Results trend, mapped to 0–100.
 * The ratio is passed through a saturating curve r/(r+1) so it lands in 0–100 without
 * blowing up when difficulty is small. Declining results raise urgency: a trend of 0.8
 * weights ×1.2, a trend of 1.2 weights ×0.8 (urgency = 2 − trend).
 */
export function priorityScore(i: PriorityInputs): Traceable<PriorityInputs> {
  const diff = Math.max(i.difficulty, 5);
  const ratio = i.opportunity / diff;
  const base = (ratio / (ratio + 1)) * 100;
  const urgency = clamp(round(2 - i.resultsTrend), 0.5, 1.5);
  const score = clamp(round(base * urgency));
  return { score, inputs: i, breakdown: { ratio: round(ratio), base: round(base), urgency } };
}

// ── Worked example (Northwind Heating & Air) ───────────────────────────────────
// Demonstrates traceability end-to-end on the demo account's numbers.
export const example = (() => {
  const results = resultsScore({
    avgRank: 14.2,
    marketAvgRank: 9,
    localPackShare: 38,
    gbpActions: 410,
    baselineGbpActions: 500,
    leads: 142,
    baselineLeads: 173,
  });

  // Opportunity: "ac repair austin" type term — 4,400/mo, currently rank 6, target top-3.
  const opportunity = opportunityScore({ monthlyDemand: 4400, currentRank: 6, targetRank: 3 });

  // Difficulty: strong rivals, 3× review gap, ~6 pages + ~20 links to close.
  const difficulty = difficultyScore({
    competitorStrength: 66,
    reviewGap: 3,
    contentNeeded: 6,
    linksNeeded: 20,
  });

  const resultsTrend = trendFactor(142, 173); // leads declining → urgency up
  const priority = priorityScore({
    opportunity: opportunity.score,
    difficulty: difficulty.score,
    resultsTrend,
  });

  return { results, opportunity, difficulty, priority };
})();
