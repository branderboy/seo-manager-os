# WP Prospector

Lead intelligence platform that **discovers WordPress websites at scale**,
classifies them by industry, detects their plugin/technology stack, scores the
sales opportunity, and generates ready-to-send outreach for every lead.

Instead of finding contractors first and checking whether they use WordPress,
WP Prospector starts from WordPress sites and classifies them into industries.

## Pipeline

Each domain runs through six steps (`src/services/scanner.ts`):

1. **Discover** — fetch the homepage (`site-fetcher.ts`).
2. **Extract** — company name, phone, email, location from the markup.
3. **Classify** — industry + sub-industry via OpenAI/Gemini, with a keyword
   fallback (`classification.ts`).
4. **Detect** — WordPress signatures (`/wp-content/`, `/wp-includes/`,
   `/wp-json/`) plus plugin/builder fingerprints (`wordpress-detection.ts`,
   `technology-detection.ts`).
5. **Score** — opportunity gap analysis; contact-form-only sites score 90+,
   sites already running booking/estimator/CRM score lower (`opportunity.ts`).
6. **Persist** — upsert into `websites`, `technology_detection`, and
   `opportunity_detection`.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Neon PostgreSQL** + **Drizzle ORM**
- **OpenAI or Gemini** for classification & sales copy (swap via `AI_PROVIDER`)
- **Tailwind CSS** UI
- Deployable to **Vercel**

## Getting Started

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, admin creds, AI keys
npm run db:push             # create tables in Neon
npm run db:seed             # optional: load sample leads
npm run dev                 # http://localhost:3000
```

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

> No AI key? Set `AI_PROVIDER="mock"` — classification falls back to the keyword
> engine and the sales assistant returns templated copy, so the whole app still
> runs end-to-end offline.

## App Structure

```
src/
  app/
    (app)/            authenticated UI: dashboard, leads, lists, scan
    api/              scan, websites, lead-lists, dashboard, export, assistant, auth
    login/
  components/         client UI (filters, forms, AI panel, sidebar)
  db/                 schema.ts, connection, seed
  lib/                auth, filters, csv, constants, utils
  services/           the six-step pipeline + AI provider abstraction
middleware.ts         route protection (JWT session cookie)
```

## API

| Method | Route                  | Purpose                                  |
| ------ | ---------------------- | ---------------------------------------- |
| POST   | `/api/scan`            | Run the pipeline for up to 50 domains    |
| GET    | `/api/websites`        | Filtered + paginated leads               |
| GET    | `/api/export`          | CSV export of the current filter set     |
| GET/POST | `/api/lead-lists`    | List / create saved segments             |
| DELETE | `/api/lead-lists/:id`  | Delete a saved list                      |
| GET    | `/api/dashboard/stats` | Top-line metrics                         |
| POST   | `/api/assistant`       | Generate cold email / SMS / call / Loom  |

## Roadmap (not yet built)

This repo is a production-shaped foundation. Natural next steps: a discovery
source (CommonCrawl / sitemap seeds / SERP ingestion) to feed the scanner,
background job queue for large crawls, Resend-powered send + sequencing,
multi-user auth with a real `users` table, and billing.
