import type { NextConfig } from "next";
import createMDX from "@next/mdx";

function buildSecurityHeaders() {
  const isDev = process.env.NODE_ENV === "development";

  const headers = [
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
  ];

  if (!isDev) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
    headers.push({
      key: "Content-Security-Policy",
      value:
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
    });
  }

  return headers;
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Enable standalone output for Docker builds
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(),
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
