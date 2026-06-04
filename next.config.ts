import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/@:username', destination: '/:username' },
      { source: '/@:username/trip/:slug', destination: '/:username/trip/:slug' },
    ]
  },
}

// Wire up Cloudflare bindings (D1, etc.) for `next dev`
// Must be called without top-level await — fire and forget
if (process.env.NODE_ENV === 'development') {
  import('@cloudflare/next-on-pages/next-dev')
    .then(({ setupDevPlatform }) => setupDevPlatform())
    .catch(() => { /* wrangler.toml not found or platform already set up */ })
}

export default nextConfig
