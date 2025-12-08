const createMDX = require('@next/mdx');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimization
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Experimental features
  experimental: {
    mdxRs: true,
    optimizePackageImports: ['d3', 'framer-motion', 'lucide-react'],
  },

  // MDX and content
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-analytics.com",
          },
        ],
      },
    ];
  },

  // Redirect old paths if any
  async redirects() {
    return [];
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },

  // TypeScript strict mode (enforced by project)
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false,
  },

  // ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Swc minification (default, but explicit for clarity)
  swcMinify: true,

  // Internationalization (prepared for future use)
  i18n: null,

  // Trailing slashes
  trailingSlash: false,

  // Stale while revalidate for ISR
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = withMDX(nextConfig);
