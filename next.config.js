/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment (production only)
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),

  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,

  // Compiler options for optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Turbopack configuration (empty to silence warnings)
  turbopack: {},

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react',
      'recharts',
      'react-hot-toast',
      'date-fns',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'zod',
    ],
  },

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    loader: 'default',
    disableStaticImages: false,
  },

  // Security headers for production
  async headers() {
    const headers = [];
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      });
    }
    return headers;
  },
};

module.exports = nextConfig;