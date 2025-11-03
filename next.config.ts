import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita modo estrito do React para detectar problemas
  reactStrictMode: true,

  // Remove header "X-Powered-By: Next.js" por segurança
  poweredByHeader: false,

  // Habilita compressão gzip
  compress: true,

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
