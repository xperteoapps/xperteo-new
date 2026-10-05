import type { NextConfig } from "next";

/** NEXT_OUTPUT=export — statyczny eksport do podglądu (artifact); produkcja = Vercel bez eksportu. */
const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isExport ? { output: "export" as const, distDir: ".next-export" } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isExport,
  },
};

export default nextConfig;
