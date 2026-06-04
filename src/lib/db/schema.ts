import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core'

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(), // Clerk user ID
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  defaultEntryVisibility: text('default_entry_visibility')
    .$type<'public' | 'private'>()
    .default('private')
    .notNull(),
  mapTheme: text('map_theme', { mode: 'json' })
    .$type<{ baseStyle?: string; pinColor?: string; fillColor?: string }>()
    .$defaultFn(() => ({}))
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
}, (t) => [uniqueIndex('profiles_username_idx').on(t.username)])

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull(),
  color: text('color').default('#3B82F6').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
}, (t) => [uniqueIndex('trips_user_slug_idx').on(t.userId, t.slug)])

export const pinCategories = sqliteTable('pin_categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  icon: text('icon').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  tripId: text('trip_id').references(() => trips.id, { onDelete: 'set null' }),
  categoryId: text('category_id').references(() => pinCategories.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content', { mode: 'json' }),
  locationName: text('location_name'),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  countryCode: text('country_code'),
  visitDate: text('visit_date'), // ISO date string YYYY-MM-DD
  rating: integer('rating'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
  displayOrder: integer('display_order'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => [
  index('entries_user_id_idx').on(t.userId),
  index('entries_trip_id_idx').on(t.tripId),
  index('entries_is_public_idx').on(t.isPublic),
])

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
}, (t) => [uniqueIndex('tags_user_name_idx').on(t.userId, t.name)])

export const entryTags = sqliteTable('entry_tags', {
  entryId: text('entry_id').notNull().references(() => entries.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [uniqueIndex('entry_tags_pk').on(t.entryId, t.tagId)])

export const follows = sqliteTable('follows', {
  followerId: text('follower_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  followingId: text('following_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
}, (t) => [
  uniqueIndex('follows_pk').on(t.followerId, t.followingId),
  index('follows_following_id_idx').on(t.followingId),
])
