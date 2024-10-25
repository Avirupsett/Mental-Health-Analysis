/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'workoscdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
