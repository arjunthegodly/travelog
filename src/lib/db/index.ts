import { drizzle } from 'drizzle-orm/d1'
import { getRequestContext } from '@cloudflare/next-on-pages'
import * as schema from './schema'

export function getDB() {
  const { env } = getRequestContext()
  return drizzle(env.DB, { schema })
}

export * from './schema'
export { eq, and, or, desc, asc, inArray } from 'drizzle-orm'
