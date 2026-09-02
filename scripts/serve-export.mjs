#!/usr/bin/env node
/**
 * Serves the static export in out/ the way GitHub Pages does.
 *
 * A GITHUB_PAGES=true build sets `output: "export"` plus a basePath, and `next start`
 * refuses to run against an exported build. This is the local equivalent: trailing-slash
 * directory resolution, out/404.html for anything that does not exist, an optional base
 * path so the Pages URLs resolve, and no dependencies to install.
 *
 * A normal build stays in Next.js server mode, and `npm run start` (next start) is the
 * right command for that one. This script is only for the Pages artifact.
 *
 * Usage: node scripts/serve-export.mjs [--port 3000] [--dir out] [--base-path /seo-manager-os]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const readArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const port = Number(readArg("--port", process.env.PORT ?? 3000));
const root = path.resolve(readArg("--dir", "out"));
// Matches next.config.mjs when GITHUB_PAGES=true. Empty for an export built without it.
const basePath = readArg("--base-path", process.env.EXPORT_BASE_PATH ?? "").replace(/\/$/, "");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

if (!fs.existsSync(root)) {
  console.error(`No export found at ${root}. Run \`npm run build\` first.`);
  process.exit(1);
}

/** Resolve a request path to a file inside root, or null. Never escapes root. */
function resolveFile(urlPath) {
  let decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  if (basePath) {
    if (decoded === basePath) decoded = "/";
    else if (decoded.startsWith(`${basePath}/`)) decoded = decoded.slice(basePath.length);
    else return null; // outside the base path, same as Pages
  }
  const candidate = path.resolve(root, `.${path.posix.normalize(decoded)}`);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) return null;

  if (fs.existsSync(candidate)) {
    if (fs.statSync(candidate).isDirectory()) {
      const index = path.join(candidate, "index.html");
      return fs.existsSync(index) ? index : null;
    }
    return candidate;
  }
  // trailingSlash: false requests still resolve, e.g. /diagnosis -> /diagnosis/index.html
  const asHtml = `${candidate}.html`;
  if (fs.existsSync(asHtml)) return asHtml;
  const asDirIndex = path.join(candidate, "index.html");
  return fs.existsSync(asDirIndex) ? asDirIndex : null;
}

const server = http.createServer((req, res) => {
  try {
    const file = resolveFile(req.url ?? "/");
    if (!file) {
      const notFound = path.join(root, "404.html");
      const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404 Not Found";
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
      return;
    }
    res.writeHead(200, {
      "content-type": CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(fs.readFileSync(file));
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`500 ${error instanceof Error ? error.message : String(error)}`);
  }
});

server.listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}${basePath}`);
});
