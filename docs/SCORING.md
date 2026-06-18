# Scoring Model (Local SEO)

> Grounded scores — every number traces to its inputs. No invented values.
> Implemented in `src/lib/scoring.ts`. This doc is the rationale + worked example.

The model has four parts:

```
Results     — how the business is performing now, vs its own baseline AND the market
Opportunity — winnable upside (demand × the click gap at current vs. target rank)
Difficulty  — effort/competitiveness to close it
Priority    ≈ (Opportunity ÷ Difficulty), weighted by the Results trend
```

All component scores normalize to **0–100** (higher = better, except **Difficulty** where
higher = harder). Every function returns a `Traceable` carrying its inputs and the
intermediate terms, so any score can be audited back to source numbers.

---

## Results

Current performance, normalized vs. the client's own baseline and the local market.

| Component | Weight | How |
|---|---|---|
| Rank vs. market | 40% | `rankToScore(avgRank)` (rank 1 = 100, 5 pts/position) × market factor (`marketAvgRank ÷ avgRank`, capped ±50%) |
| Local-pack share | 25% | % of tracked local-pack appearances (0–100) |
| GBP actions | 20% | `50 × trend(gbpActions vs baseline)` — 50 = flat |
| Leads | 15% | `50 × trend(leads vs baseline)` |

Trends are period-over-period multipliers centred on 1.0, capped at ±50% so one noisy
metric can't dominate.

## Opportunity

`demand × (CTR at target rank − CTR at current rank)` = winnable monthly clicks, normalized
on a log scale (≈1,000 winnable clicks/mo → 100). CTR uses an approximate local/organic
position curve (rank 1 ≈ 32%, rank 3 ≈ 11%, rank 6 ≈ 4.5%, page-1 tail ≈ 1%). Default target
is **top-3** (the realistic local ceiling).

## Difficulty

How hard the opportunity is to close. Higher = harder. Floored at 1 so it stays valid as a
divisor.

| Component | Weight |
|---|---|
| Competitor strength (market median authority/trust) | 40% |
| Review gap (competitor reviews ÷ ours; 5× = maxed) | 25% |
| Content needed (pages/assets, capped at 20) | 20% |
| Links needed (referring domains, capped at 50) | 15% |

## Priority

`(Opportunity ÷ Difficulty)` passed through a saturating curve `r/(r+1)` so it lands in
0–100 without blowing up when difficulty is small, then weighted by **urgency = 2 − Results
trend** (declining results raise priority; improving results lower it).

---

## Worked example — Northwind Heating & Air

Inputs and outputs as produced by `scoring.ts`'s exported `example`:

| Score | Inputs | Result |
|---|---|---|
| **Results** | avgRank 14.2 (market 9), pack 38%, GBP 410↓500, leads 142↓173 | **≈ 32** (poor; behind market and trending down) |
| **Opportunity** | "ac repair austin", 4,400/mo, rank 6 → target 3 | **≈ 82** (286 winnable clicks/mo) |
| **Difficulty** | comp 66, 3× review gap, 6 pages, 20 links | **≈ 53** |
| **Priority** | opp 82 ÷ diff 53, results trend 0.82 | **≈ 72** (high — big upside, moderate effort, declining results add urgency) |

Every figure above is reproducible from the inputs — that is the point. When real data
replaces the demo numbers, the same functions produce the live scores, and the UI's
score cards (`coreScores` in `src/lib/data.ts`) get wired to these outputs.
