import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Map /@username → /username so profile URLs show with @ prefix
      {
        source: '/@:username',
        destination: '/:username',
      },
      {
        source: '/@:username/trip/:slug',
        destination: '/:username/trip/:slug',
      },
    ]
  },
}

export default nextConfig
