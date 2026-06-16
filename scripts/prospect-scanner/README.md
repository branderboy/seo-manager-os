# Agency Prospect & Job Scanner (local CLI)

Scans **Indeed + ZipRecruiter** (via the [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
aggregator API), scores each role against your skills, and splits results into:

- **Agency Prospect** — an agency is hiring → a potential buyer of your SEO dashboard
- **Job Lead** — an in-house role you could apply to

Zero dependencies. Requires **Node 18+** (uses built-in `fetch`).

## Try it now (no API key)

```bash
node scripts/prospect-scanner/scan.mjs --demo --pitch
```

### PowerShell wrapper (Windows)

```powershell
.\scripts\prospect-scanner\scan.ps1 -Demo -Pitch
.\scripts\prospect-scanner\scan.ps1 "SEO manager" "New York, NY" -Pages 2 -Pitch
.\scripts\prospect-scanner\scan.ps1 "SEO strategist" -Remote -Date week -MinFit 40 -Pitch
```

## Live data

1. Get a key and subscribe to JSearch (free tier) on RapidAPI.
2. Add it:
   ```bash
   cp scripts/prospect-scanner/.env.example scripts/prospect-scanner/.env
   # edit .env and paste your RAPIDAPI_KEY
   ```
   …or `export RAPIDAPI_KEY=xxxx`.
3. Run:
   ```bash
   node scripts/prospect-scanner/scan.mjs --q "SEO manager" --location "New York, NY" --pages 2
   node scripts/prospect-scanner/scan.mjs --q "SEO strategist" --remote --date week --min-fit 40
   node scripts/prospect-scanner/scan.mjs --q "SEO agency" --source ZipRecruiter
   ```

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--q` | `"SEO manager"` | search query |
| `--location` | _(any)_ | city/region, e.g. `"Austin, TX"` |
| `--remote` | off | remote roles only |
| `--date` | `month` | `today` \| `3days` \| `week` \| `month` |
| `--pages` | `1` | pages to fetch (~10 results each) |
| `--source` | _(all)_ | filter to a publisher, e.g. `Indeed`, `ZipRecruiter` |
| `--min-fit` | `0` | drop results below this fit % |
| `--out` | `./out` | output dir for CSV/JSON |
| `--demo` | off | run on bundled sample data |

## Output

- Prints grouped results to the console (sorted by fit %).
- Writes `out/leads-YYYY-MM-DD.json` and `out/leads-YYYY-MM-DD.csv` (open the CSV in
  Google Sheets to track outreach).

## Customize your skills

Edit `skills.json` — the fit score is the share of your skills that appear in each
role (with a bonus for title matches), and it reports the **gaps** too.

## Notes

- Don't scrape Indeed/ZipRecruiter directly — their APIs are gated and scraping
  breaks their ToS. JSearch resurfaces those listings legally via Google for Jobs.
- The data source is isolated in `fetchJSearch()` — swap in SerpApi or Adzuna there
  without touching the scoring or output.
