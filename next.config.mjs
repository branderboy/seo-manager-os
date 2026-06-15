/** @type {import('next').NextConfig} */

// When building for GitHub Pages the site is served from /<repo>, so we set a
// basePath. Local dev (and other hosts) serve from root, so it's left empty.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "seo-manager-os";

const nextConfig = {
  output: "export", // static HTML export -> out/
  trailingSlash: true, // GitHub Pages serves folder/index.html
  reactStrictMode: true,
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : "",
};

export default nextConfig;
