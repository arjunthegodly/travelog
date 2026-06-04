// Augment the global CloudflareEnv interface (declared empty in @cloudflare/next-on-pages)
// with our D1 database binding so getRequestContext().env is typed correctly.
declare global {
  interface CloudflareEnv {
    DB: D1Database
  }
}

export {}
