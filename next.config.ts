import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Enable standalone output for Docker builds
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
