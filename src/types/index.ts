import type { profiles, trips, pinCategories, entries, tags } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type Profile = InferSelectModel<typeof profiles>
export type Trip = InferSelectModel<typeof trips>
export type PinCategory = InferSelectModel<typeof pinCategories>
export type Entry = InferSelectModel<typeof entries>
export type Tag = InferSelectModel<typeof tags>

export type MapTheme = {
  baseStyle?: string
  pinColor?: string
  fillColor?: string
}

export type EntryWithRelations = Entry & {
  profile?: Profile | null
  trip?: Trip | null
  category?: PinCategory | null
  tags?: Array<{ tag: Tag | null }>
}

// Cloudflare Workers env bindings
export interface CloudflareEnv {
  DB: D1Database
}
