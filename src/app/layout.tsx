import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WP Prospector",
  description:
    "Discover WordPress websites at scale, classify them by industry, score opportunities, and build prospect lists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
