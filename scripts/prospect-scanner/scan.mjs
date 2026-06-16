#!/usr/bin/env node
/**
 * Agency Prospect & Job Scanner — local CLI
 *
 * Scans Indeed + ZipRecruiter (via the JSearch API on RapidAPI), scores each role
 * against your skills, and splits results into:
 *   - "Agency Prospect"  → an agency is hiring = a potential buyer of your dashboard
 *   - "Job Lead"         → an in-house role you could apply to
 *
 * Zero dependencies. Requires Node 18+ (global fetch).
 *
 * Usage:
 *   node scan.mjs --q "SEO manager" --location "New York, NY" --pages 2
 *   node scan.mjs --q "SEO strategist" --remote --date week --min-fit 40
 *   node scan.mjs --demo                      # runs on sample data, no API key
 *
 * Setup for live data:
 *   1. Get a key at https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 *   2. Subscribe to JSearch (free tier available)
 *   3. export RAPIDAPI_KEY=xxxx   (or put it in scripts/prospect-scanner/.env)
 *
 * Flags:
 *   --q <text>          search query (default "SEO manager")
 *   --location <text>   city/region (default "" = anywhere)
 *   --remote            only remote roles
 *   --date <when>       today | 3days | week | month (default month)
 *   --pages <n>         pages to fetch, ~10 results each (default 1)
 *   --source <name>     filter to a publisher, e.g. Indeed or ZipRecruiter
 *   --min-fit <n>       drop results below this fit % (default 0)
 *   --out <dir>         output dir for CSV/JSON (default ./out)
 *   --demo              use bundled sample data instead of the API
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── tiny arg parser ──────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true; // boolean flag
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

// ── load .env (RAPIDAPI_KEY) without a dependency ────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ── skills config ────────────────────────────────────────────────────────────
function loadSkills() {
  const { skills } = JSON.parse(readFileSync(join(__dirname, "skills.json"), "utf8"));
  return skills;
}

function loadProfile() {
  return JSON.parse(readFileSync(join(__dirname, "profile.json"), "utf8"));
}

// ── pitch / outreach generation (--pitch) ────────────────────────────────────
function skillPhrase(matched) {
  const s = matched.slice(0, 4);
  if (!s.length) return "technical SEO, local SEO and AEO";
  if (s.length === 1) return s[0];
  return `${s.slice(0, -1).join(", ")} and ${s[s.length - 1]}`;
}

function prospectPitch(job, p) {
  const subject = `Quick idea for ${job.company}'s SEO delivery`;
  const body =
`Hi ${job.company} team,

I saw you're hiring a ${job.title} — usually a sign SEO delivery is scaling on your side. I build and run ${p.product}, a diagnosis-first SEO system that turns an audit into a ranked root-cause diagnosis, a forecast of the projected lift, and role-routed daily tasks — with AEO/GEO (AI search) built in.

For your client work it could help most with ${skillPhrase(job.matched)}. Here's a 2-minute look: ${p.demoUrl}

Worth a 15-minute call? (I'm also open to ${job.title.toLowerCase()} / consulting work if you're staffing.)

Best,
${p.name} — ${p.title}
${p.email}`;
  return { subject, body };
}

function whyIFit(job, p) {
  return `Why I fit: my focus areas overlap directly — ${skillPhrase(job.matched)}. I run ${p.product}, a diagnosis-first workflow (root cause → forecast → daily tasks, AEO/GEO included). Demo: ${p.demoUrl}`;
}

function buildPitchDoc(scored, profile, stamp) {
  const prospects = scored.filter((j) => j.leadType === "Agency Prospect");
  const leads = scored.filter((j) => j.leadType === "Job Lead");
  const out = [`# Outreach — ${stamp}`, ""];

  out.push("## Agency Prospects (pitch the dashboard)", "");
  if (!prospects.length) out.push("_None in this run._", "");
  for (const j of prospects) {
    const { subject, body } = prospectPitch(j, profile);
    out.push(`### ${j.company} — ${j.title}  (${j.fit}% match)`);
    if (j.applyUrl) out.push(`Listing: ${j.applyUrl}`);
    out.push("", `**Subject:** ${subject}`, "", body, "", "---", "");
  }

  out.push("## Job Leads (apply — why I fit)", "");
  if (!leads.length) out.push("_None in this run._", "");
  for (const j of leads) {
    out.push(`### ${j.company} — ${j.title}  (${j.fit}% match)`);
    if (j.applyUrl) out.push(`Apply: ${j.applyUrl}`);
    out.push("", whyIFit(j, profile), "", "---", "");
  }
  return out.join("\n");
}

// ── classification + scoring ─────────────────────────────────────────────────
// Agency signal in the COMPANY NAME (generic words like "seo"/"marketing" are
// avoided — they appear in nearly every SEO job description).
const AGENCY_NAME_WORDS = [
  "agency", "agencies", "digital", "media", "creative", "studio", "studios",
  "consultancy", "consulting", "interactive", "labs", "collective", "advertising",
  "web design", "marketing", "partners", "seo",
];
// Strong agency phrases in the description (a brand hiring in-house won't say these).
const AGENCY_PHRASES = [
  "our clients", "client-facing", "multiple clients", "client accounts",
  "agency environment", "white label", "white-label", "for our clients",
  "portfolio of clients", "manage clients",
];

function classifyLead(job) {
  const name = (job.company || "").toLowerCase();
  const desc = (job.descriptionSnippet || "").toLowerCase();
  const nameHit = AGENCY_NAME_WORDS.some((w) => name.includes(w));
  const phraseHit = AGENCY_PHRASES.some((p) => desc.includes(p));
  return nameHit || phraseHit ? "Agency Prospect" : "Job Lead";
}

function scoreFit(job, skills) {
  const title = (job.title || "").toLowerCase();
  const desc = (job.descriptionSnippet || "").toLowerCase();
  const matched = [];
  for (const skill of skills) {
    const s = skill.toLowerCase();
    if (title.includes(s) || desc.includes(s)) matched.push(skill);
  }
  // % of your skills that show up, with a small bonus for title hits.
  const titleHits = matched.filter((m) => title.includes(m.toLowerCase())).length;
  const base = (matched.length / skills.length) * 100;
  const fit = Math.min(100, Math.round(base + titleHits * 4));
  const gaps = skills.filter((s) => !matched.includes(s));
  return { fit, matched, gaps };
}

// ── JSearch adapter (swap here for SerpApi / Adzuna later) ────────────────────
async function fetchJSearch({ q, location, remote, date, pages, key }) {
  const dateMap = { today: "today", "3days": "3days", week: "week", month: "month" };
  const query = location ? `${q} in ${location}` : q;
  const all = [];
  for (let page = 1; page <= pages; page++) {
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("num_pages", "1");
    url.searchParams.set("date_posted", dateMap[date] || "month");
    if (remote) url.searchParams.set("remote_jobs_only", "true");

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });
    if (res.status === 429) throw new Error("Rate limited by JSearch (429). Slow down or upgrade the plan.");
    if (!res.ok) throw new Error(`JSearch error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    if (json.status && json.status !== "OK") {
      throw new Error(`JSearch returned status "${json.status}": ${json.error?.message || JSON.stringify(json.error || json)}`);
    }
    all.push(...(json.data || []));
  }
  console.log(`  → API returned ${all.length} raw listing(s)`);
  return all.map(normalizeJSearch);
}

function normalizeJSearch(j) {
  const city = [j.job_city, j.job_state].filter(Boolean).join(", ");
  return {
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: j.job_is_remote ? "Remote" : city || j.job_country || "",
    remote: !!j.job_is_remote,
    source: j.job_publisher || "Unknown",
    postedAt: j.job_posted_at_datetime_utc || "",
    salaryMin: j.job_min_salary || null,
    salaryMax: j.job_max_salary || null,
    applyUrl: j.job_apply_link || "",
    descriptionSnippet: (j.job_description || "").slice(0, 600),
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────
function dedupe(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const k = `${(j.company || "").toLowerCase()}|${(j.title || "").toLowerCase()}|${(j.location || "").toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function salaryLabel(j) {
  if (!j.salaryMin && !j.salaryMax) return "";
  const f = (n) => (n ? `$${Math.round(n / 1000)}k` : "?");
  return `${f(j.salaryMin)}–${f(j.salaryMax)}`;
}

function toCsv(rows) {
  const cols = ["fit", "leadType", "title", "company", "location", "source", "salary", "matched", "postedAt", "applyUrl"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push([
      r.fit, r.leadType, r.title, r.company, r.location, r.source,
      salaryLabel(r), r.matched.join(" / "), r.postedAt, r.applyUrl,
    ].map(esc).join(","));
  }
  return lines.join("\n");
}

// ── sample data for --demo (no API key needed) ───────────────────────────────
const SAMPLE = [
  { id: "1", title: "SEO Strategist", company: "Directive", location: "Remote", remote: true, source: "ZipRecruiter", postedAt: "2026-06-14", salaryMin: 75000, salaryMax: 95000, applyUrl: "https://www.ziprecruiter.com/", descriptionSnippet: "Own technical SEO, on-page, content strategy and AEO. Agency environment, client-facing. Local SEO and analytics a plus." },
  { id: "2", title: "SEO Manager", company: "Northwind Home Services", location: "Austin, TX", remote: false, source: "Indeed", postedAt: "2026-06-13", salaryMin: 70000, salaryMax: 90000, applyUrl: "https://www.indeed.com/", descriptionSnippet: "In-house SEO manager for an HVAC brand. Local SEO, Google Business Profile, reviews, keyword research." },
  { id: "3", title: "Senior SEO Consultant", company: "EyeUniversal Digital Agency", location: "Remote", remote: true, source: "ZipRecruiter", postedAt: "2026-06-12", salaryMin: 90000, salaryMax: 120000, applyUrl: "https://www.ziprecruiter.com/", descriptionSnippet: "Lead SEO for multiple clients. Technical SEO, backlinks, structured data, programmatic SEO, GEO and AEO experience valued." },
  { id: "4", title: "Marketing Coordinator", company: "Acme Retail", location: "New York, NY", remote: false, source: "Indeed", postedAt: "2026-06-10", salaryMin: 55000, salaryMax: 65000, applyUrl: "https://www.indeed.com/", descriptionSnippet: "Support social, email and some SEO. Entry level. Analytics reporting." },
];

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnv();
  const skills = loadSkills();

  const opts = {
    q: typeof args.q === "string" ? args.q : "SEO manager",
    location: typeof args.location === "string" ? args.location : "",
    remote: !!args.remote,
    date: typeof args.date === "string" ? args.date : "month",
    pages: Math.max(1, parseInt(args.pages, 10) || 1),
    source: typeof args.source === "string" ? args.source : "",
    minFit: parseInt(args["min-fit"], 10) || 0,
    outDir: typeof args.out === "string" ? args.out : join(__dirname, "out"),
    demo: !!args.demo,
    pitch: !!args.pitch,
  };

  let raw;
  if (opts.demo) {
    console.log("● demo mode — using bundled sample data (no API call)\n");
    raw = SAMPLE;
  } else {
    const key = process.env.RAPIDAPI_KEY;
    if (!key) {
      console.error("✖ Missing RAPIDAPI_KEY. Set it in the environment or scripts/prospect-scanner/.env,\n  or run with --demo to try it on sample data.");
      process.exit(1);
    }
    console.log(`● scanning "${opts.q}"${opts.location ? ` in ${opts.location}` : ""} · ${opts.pages} page(s) · posted ${opts.date}\n`);
    raw = await fetchJSearch({ ...opts, key });
  }

  let jobs = dedupe(raw);
  if (opts.source) jobs = jobs.filter((j) => j.source.toLowerCase().includes(opts.source.toLowerCase()));

  const scored = jobs
    .map((j) => ({ ...j, leadType: classifyLead(j), ...scoreFit(j, skills) }))
    .filter((j) => j.fit >= opts.minFit)
    .sort((a, b) => b.fit - a.fit);

  // console table
  const prospects = scored.filter((j) => j.leadType === "Agency Prospect");
  const leads = scored.filter((j) => j.leadType === "Job Lead");

  const printGroup = (label, rows) => {
    console.log(`\n=== ${label} (${rows.length}) ===`);
    for (const r of rows) {
      const sal = salaryLabel(r);
      console.log(
        `  ${String(r.fit).padStart(3)}%  ${r.title} — ${r.company}` +
          `  [${r.source}${r.location ? " · " + r.location : ""}${sal ? " · " + sal : ""}]`
      );
      if (r.matched.length) console.log(`        skills: ${r.matched.join(", ")}`);
      if (r.applyUrl) console.log(`        ${r.applyUrl}`);
    }
  };

  printGroup("AGENCY PROSPECTS (potential buyers)", prospects);
  printGroup("JOB LEADS (roles to apply to)", leads);

  // write files
  mkdirSync(opts.outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const jsonPath = join(opts.outDir, `leads-${stamp}.json`);
  const csvPath = join(opts.outDir, `leads-${stamp}.csv`);
  writeFileSync(jsonPath, JSON.stringify(scored, null, 2));
  writeFileSync(csvPath, toCsv(scored));

  console.log(`\n✔ ${scored.length} results · ${prospects.length} prospects · ${leads.length} job leads`);
  console.log(`  saved ${jsonPath}`);
  console.log(`  saved ${csvPath}`);

  if (opts.pitch) {
    const profile = loadProfile();
    const pitchPath = join(opts.outDir, `pitches-${stamp}.md`);
    writeFileSync(pitchPath, buildPitchDoc(scored, profile, stamp));
    console.log(`  saved ${pitchPath}  (tailored outreach emails)`);
  }
}

main().catch((err) => {
  console.error("✖", err.message);
  process.exit(1);
});
