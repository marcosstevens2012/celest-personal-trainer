/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/types"],
  experimental: {
    optimizePackageImports: ["@repo/ui"],
    outputFileTracingRoot: require("path").join(__dirname, "../../"),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
