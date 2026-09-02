/**
 * Navigation integrity.
 *
 * Every internal link the application renders must resolve to a page that exists in
 * src/app. This is the test that fails when a stage is renamed, a route is moved, or a
 * nav entry is added before its page — the class of defect that ships as a dead link.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const REPO = path.resolve(__dirname, "..", "..");
const SRC = path.join(REPO, "src");

/** Every route the App Router will serve, as a "/path" string. */
function collectRoutes(): string[] {
  const appDir = path.join(SRC, "app");
  const routes: string[] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      const next = path.join(dir, name);
      // (group) folders do not appear in the URL.
      const nextSegments = /^\(.+\)$/.test(name) ? segments : [...segments, name];
      if (fs.existsSync(path.join(next, "page.tsx"))) routes.push("/" + nextSegments.join("/"));
      walk(next, nextSegments);
    }
  };
  if (fs.existsSync(path.join(appDir, "page.tsx"))) routes.push("/");
  walk(appDir, []);
  return routes;
}

/** Literal internal hrefs written anywhere in src. Template literals are excluded. */
function collectLiteralHrefs(): { href: string; file: string }[] {
  const found: { href: string; file: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx|ts)$/.test(entry.name)) continue;
      const source = fs.readFileSync(full, "utf8");
      for (const match of source.matchAll(/href[=:]\s*"(\/[^"]*)"/g)) {
        found.push({ href: match[1], file: path.relative(REPO, full) });
      }
    }
  };
  walk(SRC);
  return found;
}

const routes = collectRoutes();

/** A dynamic route such as /clients/[id] matches any single segment in that position. */
function routeExists(href: string): boolean {
  const target = href.replace(/[?#].*$/, "").replace(/\/$/, "") || "/";
  const targetParts = target.split("/").filter(Boolean);
  return routes.some((route) => {
    const routeParts = route.split("/").filter(Boolean);
    if (routeParts.length !== targetParts.length) return false;
    return routeParts.every((part, i) => /^\[.+\]$/.test(part) || part === targetParts[i]);
  });
}

describe("app routes", () => {
  it("discovers the routes the app router will serve", () => {
    expect(routes).toContain("/");
    expect(routes).toContain("/command");
    expect(routes.length).toBeGreaterThan(15);
  });

  it("has no duplicate routes", () => {
    expect(new Set(routes).size).toBe(routes.length);
  });
});

describe("internal links", () => {
  const hrefs = collectLiteralHrefs();

  it("finds the links the app renders", () => {
    expect(hrefs.length).toBeGreaterThan(10);
  });

  it("every literal internal href resolves to a page", () => {
    const broken = hrefs.filter((h) => !routeExists(h.href));
    expect(broken, `broken links: ${JSON.stringify(broken, null, 2)}`).toEqual([]);
  });
});

describe("stage and dashboard definitions", () => {
  it("every stage slug has a page", async () => {
    const { STAGES, DASHBOARDS, stageHref } = await import("../../src/lib/stages");
    for (const stage of STAGES) {
      expect(routeExists(stageHref(stage.slug)), `stage ${stage.slug}`).toBe(true);
    }
    for (const dashboard of DASHBOARDS) {
      expect(routeExists(`/dashboards/${dashboard.slug}`), `dashboard ${dashboard.slug}`).toBe(true);
    }
  });

  it("stage numbers and slugs are unique and sequential", async () => {
    const { STAGES } = await import("../../src/lib/stages");
    expect(new Set(STAGES.map((s) => s.slug)).size).toBe(STAGES.length);
    expect(STAGES.map((s) => s.n)).toEqual(STAGES.map((_, i) => i + 1));
  });

  it("every stage declares outputs, because the next stage consumes them", async () => {
    const { STAGES } = await import("../../src/lib/stages");
    for (const stage of STAGES) {
      expect(stage.outputs.length, `stage ${stage.slug} outputs`).toBeGreaterThan(0);
      expect(stage.name.trim().length).toBeGreaterThan(0);
    }
  });
});
