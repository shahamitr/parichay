/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression

  // Compiler options for optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
    ],
  },

  // SWC minification (faster than Terser)
  swcMinify: true,

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve server-only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bcrypt: false,
        ioredis: false,
        redis: false,
        'ioredis-mock': false,
      };

      // Advanced code splitting for client bundles
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for animations
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'animations',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Vendor chunk for charts
            charts: {
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
              name: 'charts',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Vendor chunk for forms
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              name: 'forms',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Vendor chunk for icons
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
              name: 'icons',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Default vendor chunk for other node_modules
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk for shared code
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              name: 'common',
            },
          },
        },
      };
    }

    // Externalize ioredis for server-side
    if (isServer) {
      config.externals = [...(config.externals || []), 'ioredis'];
    }



    return config;
  },

  // Image optimization configuration
  images: {
    // Use modern formats for better compression
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,

    // Enable image optimization
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Allowed remote image patterns
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
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'source.boringavatars.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],

    // Loader configuration for custom image optimization
    loader: 'default',

    // Disable static image imports if using custom loader
    disableStaticImages: false,
  },

  // Enforce HTTPS in production
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

  // Redirect HTTP to HTTPS in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://:host/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
