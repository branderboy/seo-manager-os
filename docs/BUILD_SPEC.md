# SEO Manager OS — Production Build Spec

> Status of the repo today: a complete **Next.js 14 / React 18 / TypeScript / Tailwind**
> front-end running entirely on mock data in `src/lib/*.ts`. No backend, auth, database,
> or live integrations. This document specifies the system that turns the prototype into a
> real product — the tech, the tool/service stack, the scraping subsystem, the multi-LLM
> mention tracker, and the AI prompts that power the generated stages.
>
> Design decisions locked in by the team:
> 1. **Scrape, don't pay for gated APIs** where the API is restrictive or expensive
>    (Google reviews, Yelp, local data, SERPs). Keep paid APIs only where they're clearly
>    cheaper/safer than scraping.
> 2. **LLM-mention tracking is a multi-LLM "searcher"** — one service fans a prompt set out
>    across the top assistants, captures each answer, and an LLM-judge extracts mentions,
>    citations, sentiment, and competitor share.

---

## 1. Architecture

```
                          ┌──────────────────────────────────────────┐
                          │  Next.js front-end (the existing app)      │
                          │  App Router · server components · Recharts │
                          └───────────────┬────────────────────────────┘
                                          │ tRPC / REST (typed)
                          ┌───────────────▼────────────────────────────┐
                          │  API layer (Next route handlers / Nest)      │
                          │  auth · multi-tenant · per-client scoping    │
                          └───┬───────────────┬───────────────┬─────────┘
                              │               │               │
                  ┌───────────▼──┐   ┌────────▼───────┐  ┌────▼─────────────┐
                  │ Postgres      │   │ Redis           │  │ Object store     │
                  │ (Prisma)      │   │ cache + queue   │  │ (S3/R2) raw HTML │
                  └───────────────┘   └────────┬────────┘  └──────────────────┘
                                               │ jobs
                          ┌────────────────────▼─────────────────────────┐
                          │  Worker fleet (BullMQ on Node, or Temporal)    │
                          │                                                │
                          │  • rank-scan workers   (scrape/SERP API)       │
                          │  • review/local scrapers (Playwright + proxy)  │
                          │  • crawl workers        (site audit)           │
                          │  • LLM-mention workers  (multi-LLM fan-out)    │
                          │  • AI-generation workers (diagnosis/strategy)  │
                          │  • integration sync     (GSC/GA4/GBP/CRM)      │
                          └────────────────────────────────────────────────┘
```

**Why this shape**
- The UI already defines the exact data each screen needs, so the backend is "fill the
  contracts." Replace each `src/lib/*.ts` export with a typed API endpoint backed by a table.
- Everything that touches the outside world (scraping, LLM calls, third-party syncs) is a
  **background job**, never an inline request — scans are slow, rate-limited, and retryable.
  This mirrors the prospect-scanner's isolated `fetchJSearch()` data-source function, scaled up.
- Multi-tenant from day one: every row is scoped to `client_id`; the app already has a
  client/engagement switcher (`src/components/engagement/store.tsx`).

### Recommended stack

| Layer | Choice | Notes |
|---|---|---|
| Front-end | **Keep as-is** (Next 14, React 18, TS, Tailwind, Recharts) | No rewrite; swap mock imports for data fetching. |
| API | **Next.js route handlers + tRPC** (or NestJS if the team prefers) | Typed end-to-end with the existing TS types in `lib/`. |
| DB | **Postgres + Prisma** | Time-series rank/mention data; `pgvector` optional for entity/embedding work. |
| Cache / queue | **Redis + BullMQ** | Job scheduling, rate-limit buckets, dedupe. |
| Workers | **Node workers** (same language as the app) | Or **Temporal** if you want durable multi-step workflows. |
| Auth | **Clerk** or **Auth.js (NextAuth)** | Multi-tenant orgs + roles (the app has owner/team roles already). |
| Object store | **S3 / Cloudflare R2** | Raw scraped HTML + LLM transcripts for audit/debug. |
| Scraping | **Playwright** + **residential proxies** (see §4) | Headless browser pool. |
| LLM | **Anthropic Claude** (see §6) | Diagnosis/strategy/task generation + the mention-judge. |
| Hosting | **Vercel** (front-end) + **Fly.io/Railway/Render** (workers) | Workers need long-running processes Vercel can't host. |
| Scheduler | **BullMQ repeatable jobs** or a cron service | Daily rank scans, weekly mention scans. |
| Observability | **Sentry** + **BetterStack/Logtail** | Scrapers fail constantly; you need alerting. |

---

## 2. Tool & service shopping list

Grouped by subsystem. "Build" = we run it; "Buy" = SaaS; "Either" = decide by volume.

### Search-ranking tracker
| Need | Tool | Build/Buy | Notes |
|---|---|---|---|
| SERP position scraping | **Playwright + residential proxies** (Bright Data / Oxylabs / Smartproxy) | Build | Cheapest at scale; fragile, needs maintenance. |
| SERP data (fallback / reliability) | **DataForSEO** or **SerpApi** | Buy | Pay-per-call; far more reliable than DIY scraping. Use for high-value daily terms, scrape the long tail. |
| Keyword volume / difficulty | **DataForSEO Labs** or scrape Google Keyword Planner | Either | Volume is hard to scrape accurately — buy it. |
| Local pack / geo-grid ranks | Playwright with geolocation override + proxy per ZIP | Build | Replaces Local Falcon; one scan per grid point. |

### LLM-mention tracker (see §5 for the design)
| Need | Tool | Build/Buy | Notes |
|---|---|---|---|
| ChatGPT answers | **OpenAI API** (`gpt-4o`) | Buy (API) | Official, cheap, reliable. |
| Claude answers | **Anthropic API** | Buy (API) | Official. |
| Gemini answers | **Google Gemini API** | Buy (API) | Official. |
| Perplexity answers | **Perplexity API** (`sonar`) | Buy (API) | Official; returns citations. |
| **Google AI Overviews** | **Playwright + proxy** (scrape) | Build | **No official API** — must scrape the live SERP's AI Overview block. |
| Mention extraction / sentiment | **Claude** (LLM-as-judge) | Build | One prompt per captured answer (see §6). |
| Off-the-shelf alternative | **Profound / Peec AI / Otterly / Scrunch** | Buy | If you'd rather not build the fan-out + judge yourself. Build gives you control + margin. |

### Owned-data integrations (official APIs — keep these)
| Need | Tool |
|---|---|
| Search Console | Google Search Console API (free) |
| Analytics | GA4 Data API (free) |
| Business Profile / Google reviews | Google Business Profile API (free, owner-authed) |
| CRM / leads / revenue | HubSpot / Salesforce APIs |
| Call tracking | CallRail API |
| Site crawl | **Build** a crawler (Playwright/Cheerio) or self-host; Screaming Frog is desktop-only |

### Scraped data (gated/expensive APIs we're skipping)
| Need | Approach |
|---|---|
| Yelp reviews & ratings | Scrape (Yelp API is heavily restricted) |
| Competitor reviews (Google/Yelp) | Scrape — you don't own the profile, so no API access |
| Third-party citations / directories | Scrape directory listings for NAP consistency |
| SERP features (PAA, snippets, local pack) | Scrape from the same SERP fetch as rank tracking |

### Cross-cutting
- **Proxies:** residential/rotating (Bright Data, Oxylabs, Smartproxy, or IPRoyal for budget).
- **CAPTCHA solving:** 2Captcha / CapSolver for when Google challenges the scraper.
- **Secrets:** Doppler / Vercel env / AWS Secrets Manager — never commit keys (the
  prospect-scanner already models `.env` + `.env.example`).
- **Email/alerts:** Resend (already referenced in the mock integrations) + Slack webhooks.

---

## 3. Data-model mapping (mock → real)

Each mock export becomes a table + a sync job. The UI contracts don't change.

| Mock (`src/lib/`) | Real source | Job cadence |
|---|---|---|
| `tracker.ts` → `rankedKeywords`, `positionBuckets`, `visibilityTrend` | SERP scrape / DataForSEO | Daily |
| `tracker.ts` → `aiAssistants`, `aiPrompts`, `aiShareOfVoice` | Multi-LLM fan-out + judge (§5) | Weekly (or daily for priority prompts) |
| `data.ts` → `coreScores`, `trend` | Computed from GSC + ranks + reviews + mentions | Nightly rollup |
| `data.ts` → `diagnosis`, `strategy` | **Claude generation** (§6) from collected evidence | On demand / weekly |
| `data.ts` → `playbooks`, `executionPlans`, `dailyTasks` | **Claude generation** from diagnosis | On strategy approval |
| `dashboards.ts` → reviews, geo-grid, GBP | GBP API (owned) + scrape (competitors) | Daily |
| `integrations.ts` connection states | OAuth tokens per client in DB | On connect |

---

## 4. Scraping subsystem

A single Playwright-based service handles SERPs, AI Overviews, reviews, and local data.
Same architecture as the prospect-scanner's swappable data source, but browser-driven.

**Components**
1. **Browser pool** — Playwright (Chromium) with stealth plugins, one context per proxy
   identity. Headless, fingerprint-randomized.
2. **Proxy rotation** — residential pool; pin a proxy's geo to the target market for local
   results (geo-grid scans rotate proxy + `geolocation` per grid point).
3. **Fetch → parse → store** — save raw HTML to object storage (audit/debug/re-parse), parse
   into typed rows, write to Postgres.
4. **Politeness + retry** — per-domain rate-limit buckets in Redis, exponential backoff,
   CAPTCHA-solver fallback, dead-letter queue for repeated failures.

**What it scrapes**
- **SERP rank + features:** organic positions, local pack, PAA, featured snippets, and the
  **AI Overview** block (the only way to track Google AI presence — no API exists).
- **Reviews (Google/Yelp):** rating, count, velocity, recent review text → sentiment via the
  judge prompt. Works for the client *and* competitors (no profile ownership needed).
- **Local/geo-grid:** run the local-pack scrape from N proxy locations across the service
  radius to rebuild the geo-grid heatmap.
- **Citations/NAP:** directory listings for name/address/phone consistency.

> ⚠️ **Compliance note (say it once, then it's the team's call):** scraping Google/Yelp is
> against their ToS and can get IPs/accounts blocked; results can break when markup changes.
> Mitigations: residential proxies, low request rates, raw-HTML caching so a parser change
> doesn't force a re-scrape, and DataForSEO/SerpApi as a paid fallback for high-value terms.
> Owned data (the client's own GBP/GSC/GA4) should always go through official APIs — it's
> free, stable, and consented.

---

## 5. LLM-mention tracker ("search across top LLMs")

One service answers: *for our tracked prompts, where does the brand show up across AI
assistants, how is it framed, and who's winning instead of us?*

```
prompt set (per client)  ─┐
                          ├─► fan-out runner ──► per-engine adapters
competitor list ─────────┘                        ├─ OpenAI (gpt-4o)      [API]
                                                   ├─ Anthropic Claude     [API]
                                                   ├─ Google Gemini        [API]
                                                   ├─ Perplexity (sonar)   [API, has citations]
                                                   └─ Google AI Overviews  [SCRAPE — no API]
                                                          │
                                                   raw answers + citations
                                                          │
                                                   ┌──────▼───────┐
                                                   │  LLM judge    │  (Claude, §6)
                                                   │  per answer   │
                                                   └──────┬───────┘
                                                          │
                       status (Cited / Mentioned / Absent), sentiment,
                       competitor cited, source links  ──►  Postgres  ──►  Tracker UI
```

**Pipeline**
1. **Prompt set** — per client, the realistic buyer questions ("best HVAC company in
   Austin", "who repairs AC same day near me"). Seed from keywords + Discovery; let the user
   edit. Tag each with intent + the competitor set.
2. **Fan-out runner** — a job per (prompt × engine). API engines call the provider SDK;
   AI Overviews runs through the scraper (§4). Capture full text + any citation URLs. Store
   raw transcripts in object storage.
3. **Judge** — for each captured answer, one Claude call returns structured JSON: is the
   brand cited (linked) / mentioned (named, unlinked) / absent; sentiment; which competitors
   appear; the cited source domains. (Prompt in §6.4.)
4. **Aggregate** — roll judged rows into the Tracker's `aiAssistants` (mention rate per
   engine), `aiShareOfVoice` (brand vs competitors), and `aiPrompts` (the per-prompt table).
5. **Schedule** — weekly for the full set, daily for priority prompts. Diff vs last run to
   produce the deltas the Tracker already displays.

**Buy-vs-build:** Profound, Peec AI, Otterly, and Scrunch do this as a product. Building it
keeps the data, the margin, and full control of the prompt set — and it's ~one runner + one
judge prompt. Recommend build, with a provider adapter interface so engines are swappable
(exactly like `fetchJSearch()` is swappable for SerpApi/Adzuna in the scanner).

---

## 6. AI generation layer + prompts

The "intelligence" stages (Diagnosis, Strategy, Playbooks, Daily Tasks) and the
mention-judge are **Claude** calls. Default model **Claude Opus 4.8** (`claude-opus-4-8`) for
the reasoning-heavy generation; **Claude Haiku 4.5** (`claude-haiku-4-5`) for the
high-volume, cheap judge calls. Use the official `@anthropic-ai/sdk`, adaptive thinking
(`thinking: {type: "adaptive"}`), and **structured outputs** (`output_config.format` with a
JSON schema) so every response is machine-parseable. Never prefill the assistant turn.

> Implementation note: these models use adaptive thinking only (no `budget_tokens`, no
> `temperature`/`top_p`). Stream responses when `max_tokens` is large. See the team's
> Claude API reference for SDK specifics.

The prompts below are the system prompts. Feed collected evidence as a JSON `user` message;
constrain the reply with a JSON schema matching the existing TS types in `src/lib/data.ts`.

### 6.1 Discovery classification (Local / SaaS / Enterprise)
```
You are a senior SEO strategist classifying a new engagement. Given the intake answers,
decide whether this business is best served by a LOCAL, SAAS, or ENTERPRISE SEO model.

Output JSON: { "model": "Local|SaaS|Enterprise", "confidence": 0-100,
  "reasoning": "one paragraph", "signals": ["the 3-5 intake facts that drove this"] }

Rules:
- LOCAL: physical service area, maps/GBP relevance, "near me" demand, lead/call goals.
- SAAS: product sold online, comparison/alternative/BOFU demand, signup/demo goals.
- ENTERPRISE: large site (>10k URLs), template/crawl/indexation concerns, scale goals.
Weigh business model and goals over industry. Do not invent facts not in the intake.
```

### 6.2 Diagnosis engine (root cause from evidence)
```
You are a Senior SEO Diagnostician. You are given EVIDENCE collected from the client's own
data and the SERP/AI landscape: rankings, geo-grid, reviews, GBP completeness, crawl/index
stats, backlinks, and AI-mention results. Your job is to explain WHY this business is not
winning in search — resolve symptoms to ranked root causes.

For each root cause: cite the specific evidence items (with their source), assign a
confidence (0-100) and an impact (High/Medium/Low). Be skeptical: do not assert a cause the
evidence does not support; lower confidence when evidence is thin or conflicting.

Output JSON matching this shape:
{ "summary": "...",
  "primary":   { "title","confidence","impact","evidence":[{"text","source"}] },
  "secondary": { "title","confidence","impact","evidence":[{"text","source"}] },
  "possible":  [ {"title","confidence","impact"} ] }

Sources must be one of the evidence sources actually provided. Order causes by
impact × confidence. The summary is the one-paragraph read a busy owner would act on.
```

### 6.3 Strategy brief + playbooks + tasks
```
You are an Agency Director writing an executive-ready strategy brief from a completed
diagnosis. The audience is the business owner. Be concrete and outcome-oriented; tie every
recommendation to a diagnosed root cause and an expected metric movement.

Given: the diagnosis JSON, the business goals, the model (Local/SaaS/Enterprise), budget and
team constraints. Produce:
{ "executiveSummary": "...",
  "currentState": ["..."], "keyFindings": ["..."], "rootCauses": ["..."],
  "opportunities": ["..."], "risks": ["..."],
  "expectedOutcomes": [ {"metric","from","to"} ],
  "playbooks": [ {"key","name","goal","plays":["..."]} ],
  "executionPlans": [ {"horizon":"30-Day|90-Day|180-Day",
       "items":[ {"name","priority","impact","effort","confidence","owner"} ] } ] }

Constraints: sequence work by impact-vs-effort; respect the stated budget/team size; every
expectedOutcome "from" must be a real current number from the inputs. No vanity tasks.
```

### 6.4 LLM-mention judge (the tracker's extractor)
```
You are evaluating one AI assistant's answer to a user prompt, to measure a brand's AI
visibility. You are given: the PROMPT, the BRAND name + domain, the COMPETITOR list, and the
assistant's full ANSWER (plus any citation URLs).

Decide, strictly from the answer text and citations:
{ "status": "Cited" | "Mentioned" | "Absent",
  "sentiment": "Positive" | "Neutral" | "Negative",   // brand sentiment; Neutral if Absent
  "brand_citation_urls": ["..."],                       // brand domain links present, if any
  "competitors_cited": ["...names from the list that appear"],
  "evidence_quote": "the sentence that mentions the brand, or null" }

Definitions:
- "Cited": the brand appears AND is backed by a link/citation to its domain.
- "Mentioned": the brand is named in the text but not linked/cited.
- "Absent": the brand does not appear at all.
Only count competitors from the provided list. Do not infer mentions that aren't in the text.
```

### 6.5 Daily task generation (feeds the Task Engine)
```
You turn an approved execution plan into today's concrete worklist. Given the plan items,
team roles, and what was completed yesterday, output 5-9 specific, single-sitting tasks for
today, each routed to a role.

Output JSON: [ { "name","owner","role","priority":"High|Medium|Low","due","source" } ]
"source" must trace back to a plan item (e.g. "30-Day · Review automation"). Tasks must be
doable in one day; split anything larger. Front-load High priority. No duplicates of
yesterday's completed work.
```

---

## 7. Phased roadmap

| Phase | Scope | Outcome |
|---|---|---|
| **0 — Foundation** | Auth + multi-tenant Postgres + job queue; replace mock imports with API reads (data still seeded). | App runs on a real DB; nothing visible changes. |
| **1 — Owned data** | GSC, GA4, GBP, CRM OAuth + sync jobs. | Reports/dashboards show the client's real numbers. |
| **2 — Rank tracker** | SERP scraper + DataForSEO fallback; geo-grid; daily scans. | Tracker "Search Rankings" tab is live. |
| **3 — AI-mention tracker** | Multi-LLM fan-out + AI Overview scrape + judge; weekly scans. | Tracker "AI Mentions" tab is live. |
| **4 — Generation** | Claude-powered Diagnosis → Strategy → Playbooks → Tasks. | The pipeline stages produce real, client-specific output. |
| **5 — Scale/competitors** | Competitor review/SERP scraping, citations/NAP, alerting, scheduling polish. | Full competitive intelligence + automation. |

The biggest single line of effort is the scraping + worker infrastructure (Phases 2–3 and 5);
the generation layer (Phase 4) is comparatively small because the prompts and output shapes
are already defined by the existing UI types.

---

## 8. Cost drivers (plan for these)

- **Proxies** — usually the largest variable cost; scales with keywords × markets × daily.
- **SERP API fallback** — pay-per-call; reserve for high-value terms, scrape the tail.
- **LLM API** — fan-out (5 engines × prompts) + one judge call each; weekly cadence keeps it
  modest. Use Haiku for the judge, Opus for generation.
- **Keyword volume data** — buy it (DataForSEO); accurate volume is not reliably scrapable.
- **Infra** — workers need always-on hosts (Fly/Railway/Render); Vercel hosts only the UI.
```
