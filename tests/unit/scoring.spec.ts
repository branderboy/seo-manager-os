/**
 * The grounded scoring model (docs/SCORING.md).
 *
 * The product decision behind src/lib/scoring.ts is "no invented numbers": every score is
 * bounded, traceable to its inputs, and moves in the direction the model claims. These
 * tests fail if a weight, a bound, or a direction is changed without the doc changing too.
 */
import { describe, it, expect } from "vitest";
import {
  rankToScore,
  trendFactor,
  ctrAt,
  resultsScore,
  opportunityScore,
  difficultyScore,
  priorityScore,
  example,
} from "../../src/lib/scoring";

const inRange = (n: number, lo: number, hi: number) => n >= lo && n <= hi;

describe("rankToScore", () => {
  it("maps rank 1 to 100 and loses 5 points per position", () => {
    expect(rankToScore(1)).toBe(100);
    expect(rankToScore(2)).toBe(95);
    expect(rankToScore(11)).toBe(50);
  });

  it("floors at 0 from rank 21 and treats 'not ranking' as 0", () => {
    expect(rankToScore(21)).toBe(0);
    expect(rankToScore(60)).toBe(0);
    expect(rankToScore(0)).toBe(0);
  });

  it("never leaves 0 to 100", () => {
    for (let rank = 0; rank <= 100; rank++) expect(inRange(rankToScore(rank), 0, 100)).toBe(true);
  });
});

describe("trendFactor", () => {
  it("is 1.0 when flat and moves with the metric", () => {
    expect(trendFactor(100, 100)).toBe(1);
    expect(trendFactor(120, 100)).toBe(1.2);
    expect(trendFactor(80, 100)).toBe(0.8);
  });

  it("inverts when lower is better, so beating the market scores above 1", () => {
    expect(trendFactor(8, 10, true)).toBe(1.25);
    expect(trendFactor(12, 10, true)).toBeLessThan(1);
  });

  it("caps influence at plus or minus 50 percent", () => {
    expect(trendFactor(1000, 100)).toBe(1.5);
    expect(trendFactor(1, 100)).toBe(0.5);
  });

  it("returns 1 rather than dividing by a missing baseline", () => {
    expect(trendFactor(50, 0)).toBe(1);
    expect(trendFactor(50, -10)).toBe(1);
  });
});

describe("ctrAt", () => {
  it("declines monotonically down page one", () => {
    for (let rank = 1; rank < 10; rank++) expect(ctrAt(rank)).toBeGreaterThan(ctrAt(rank + 1));
  });

  it("is a flat tail past page one and zero when not ranking", () => {
    expect(ctrAt(11)).toBe(0.01);
    expect(ctrAt(80)).toBe(0.01);
    expect(ctrAt(0)).toBe(0);
  });
});

describe("resultsScore", () => {
  const base = {
    avgRank: 10,
    marketAvgRank: 10,
    localPackShare: 50,
    gbpActions: 500,
    baselineGbpActions: 500,
    leads: 100,
    baselineLeads: 100,
  };

  it("stays within 0 to 100 and exposes its breakdown", () => {
    const r = resultsScore(base);
    expect(inRange(r.score, 0, 100)).toBe(true);
    expect(r.inputs).toEqual(base);
    expect(Object.keys(r.breakdown)).toEqual(
      expect.arrayContaining(["rank", "marketFactor", "rankVsMarket", "pack", "gbp", "leads"]),
    );
  });

  it("rises when the business ranks better than the market", () => {
    const behind = resultsScore({ ...base, avgRank: 16 }).score;
    const ahead = resultsScore({ ...base, avgRank: 4 }).score;
    expect(ahead).toBeGreaterThan(behind);
  });

  it("rises with local pack share and with a lead trend above baseline", () => {
    expect(resultsScore({ ...base, localPackShare: 90 }).score).toBeGreaterThan(
      resultsScore({ ...base, localPackShare: 10 }).score,
    );
    expect(resultsScore({ ...base, leads: 150 }).score).toBeGreaterThan(
      resultsScore({ ...base, leads: 60 }).score,
    );
  });
});

describe("opportunityScore", () => {
  it("is zero when the current rank already beats the target", () => {
    expect(opportunityScore({ monthlyDemand: 5000, currentRank: 1, targetRank: 3 }).score).toBe(0);
  });

  it("grows with demand and with the size of the click gap", () => {
    const small = opportunityScore({ monthlyDemand: 100, currentRank: 8, targetRank: 3 }).score;
    const large = opportunityScore({ monthlyDemand: 10000, currentRank: 8, targetRank: 3 }).score;
    expect(large).toBeGreaterThan(small);
  });

  it("defaults the target to top three and reports winnable clicks", () => {
    const r = opportunityScore({ monthlyDemand: 4400, currentRank: 6 });
    expect(r.breakdown.target).toBe(3);
    expect(r.breakdown.winnableClicks).toBeGreaterThan(0);
    expect(inRange(r.score, 0, 100)).toBe(true);
  });
});

describe("difficultyScore", () => {
  it("never returns a zero divisor", () => {
    const easiest = difficultyScore({
      competitorStrength: 0,
      reviewGap: 0,
      contentNeeded: 0,
      linksNeeded: 0,
    });
    expect(easiest.score).toBeGreaterThanOrEqual(1);
  });

  it("saturates rather than exploding on extreme inputs", () => {
    const maxed = difficultyScore({
      competitorStrength: 100,
      reviewGap: 50,
      contentNeeded: 500,
      linksNeeded: 5000,
    });
    expect(maxed.score).toBe(100);
  });

  it("rises with competitor strength", () => {
    const weak = difficultyScore({ competitorStrength: 10, reviewGap: 1, contentNeeded: 2, linksNeeded: 5 });
    const strong = difficultyScore({ competitorStrength: 90, reviewGap: 1, contentNeeded: 2, linksNeeded: 5 });
    expect(strong.score).toBeGreaterThan(weak.score);
  });
});

describe("priorityScore", () => {
  it("rises with opportunity and falls with difficulty", () => {
    const a = priorityScore({ opportunity: 80, difficulty: 20, resultsTrend: 1 }).score;
    const b = priorityScore({ opportunity: 20, difficulty: 20, resultsTrend: 1 }).score;
    const c = priorityScore({ opportunity: 80, difficulty: 90, resultsTrend: 1 }).score;
    expect(a).toBeGreaterThan(b);
    expect(a).toBeGreaterThan(c);
  });

  it("treats declining results as more urgent than improving ones", () => {
    const declining = priorityScore({ opportunity: 60, difficulty: 40, resultsTrend: 0.8 }).score;
    const improving = priorityScore({ opportunity: 60, difficulty: 40, resultsTrend: 1.2 }).score;
    expect(declining).toBeGreaterThan(improving);
  });

  it("stays within 0 to 100 even when difficulty is near zero", () => {
    const r = priorityScore({ opportunity: 100, difficulty: 0, resultsTrend: 0.5 });
    expect(inRange(r.score, 0, 100)).toBe(true);
  });
});

describe("the worked example in docs/SCORING.md", () => {
  it("produces traceable, in-range scores for every component", () => {
    for (const [name, part] of Object.entries(example)) {
      expect(inRange(part.score, 0, 100), `${name} score ${part.score}`).toBe(true);
      expect(part.inputs, `${name} inputs`).toBeTruthy();
      expect(Object.keys(part.breakdown).length, `${name} breakdown`).toBeGreaterThan(0);
    }
  });

  it("reflects the account's declining leads as raised priority urgency", () => {
    expect(example.priority.breakdown.urgency).toBeGreaterThan(1);
  });
});
