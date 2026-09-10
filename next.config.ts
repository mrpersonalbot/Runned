import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(process.env.GITHUB_PAGES === "1"
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        basePath: process.env.GITHUB_PAGES_BASE_PATH || "",
        assetPrefix: process.env.GITHUB_PAGES_BASE_PATH ? `${process.env.GITHUB_PAGES_BASE_PATH}/` : undefined,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
