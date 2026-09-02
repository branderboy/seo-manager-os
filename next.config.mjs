/** @type {import('next').NextConfig} */

// GitHub Pages remains a zero-credential static demo. Normal local/Vercel
// builds stay in standard Next.js server mode so Supabase Auth, Server Actions,
// Route Handlers and secure connector callbacks can be wired without fighting
// a global `output: export` constraint.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "seo-manager-os";

const nextConfig = {
  ...(isPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {
        trailingSlash: false,
      }),
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,
  images: { unoptimized: isPages },
};

export default nextConfig;
