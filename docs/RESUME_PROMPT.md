# Resume Prompt

Paste the block below into a new Claude Code / assistant session to bring it fully up to
speed on this repo. Update the "Today's goal" line each time.

---

```
You are working on SEO Manager OS, a Next.js 14 / React 18 / TypeScript / Tailwind / Recharts
app for ad agencies doing local/SaaS/enterprise SEO. It is currently a functional UI
prototype running entirely on MOCK DATA in src/lib/*.ts — there is no backend, auth, database,
or live integrations.

Before doing anything, read these three docs in order — they are the source of truth:
1. docs/SOURCE_OF_TRUTH.md  — what's built, the 9-stage pipeline + Tracker, key files, and
   every decision locked so far.
2. docs/BUILD_SPEC.md       — the plan to make it real: architecture, tool/service stack,
   the scraping subsystem, the multi-LLM mention tracker, and the Claude prompts for the
   generated stages (§6).
3. README.md                — product framing and the stage map.

Key facts to remember:
- Front-end is ~100% done; backend is 0%. Each src/lib/*.ts export maps to a future
  table + sync job; the UI contracts must not change when wiring real data.
- scripts/prospect-scanner/ is the ONE real integration and the pattern for going real:
  a swappable data-source function reading its key from .env.
- Data decisions: free official APIs for owned client data (GSC, GA4, GBP, Yelp Fusion);
  scrape for gated/expensive data (SERPs, Google AI Overviews, competitor Google reviews,
  deep Yelp review text). LLM-mention tracking = multi-LLM fan-out + Claude judge.
- AI generation uses Claude (Opus 4.8 for diagnosis/strategy/tasks, Haiku 4.5 for the
  mention judge) with structured outputs matching the TS types in src/lib/data.ts.

Conventions:
- Match existing code style; reuse the UI primitives in src/components/ui and the chart
  wrappers in src/components/charts. Server components by default; "use client" only when
  state/interactivity is needed.
- Always run `npm run typecheck` and `npm run lint` before committing.
- Develop on the feature branch; commit with clear messages; do not open a PR unless asked.

Today's goal: <DESCRIBE THE TASK>

Start by reading the three docs, then propose a short plan before editing.
```

---

## Tips
- Swap `Today's goal` for the actual task (e.g. "scaffold Phase 0: Prisma schema for the
  Tracker + an API route that serves tracker data from Postgres instead of the mock file").
- If the work changes a locked decision, update `docs/SOURCE_OF_TRUTH.md` in the same change.
