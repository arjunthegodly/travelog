import { EntryCard } from '@/components/entries/entry-card'
import { ExploreMapWrapper } from '@/components/map/explore-map-wrapper'
import { getDB, entries, profiles, trips, pinCategories, eq } from '@/lib/db'
import type { EntryWithRelations } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Explore — Travelog' }

export default async function ExplorePage() {
  const db = getDB()

  const rows = await db
    .select()
    .from(entries)
    .leftJoin(profiles, eq(entries.userId, profiles.id))
    .leftJoin(trips, eq(entries.tripId, trips.id))
    .leftJoin(pinCategories, eq(entries.categoryId, pinCategories.id))
    .where(eq(entries.isPublic, true))
    .orderBy(entries.createdAt)
    .limit(50)

  const publicEntries = rows.map((r) => ({
    ...r.entries,
    profile: r.profiles,
    trip: r.trips,
    category: r.pin_categories,
  })) as EntryWithRelations[]

  const mapEntries = publicEntries.map((e) => ({
    id: e.id,
    title: e.title,
    lat: e.lat,
    lng: e.lng,
    color: e.category?.color ?? '#6366F1',
  }))

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="h-1/2 relative">
        <ExploreMapWrapper entries={mapEntries} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Recent public entries</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {publicEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  )
}
