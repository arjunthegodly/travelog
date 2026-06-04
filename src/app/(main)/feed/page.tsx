import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EntryCard } from '@/components/entries/entry-card'
import { getDB, entries, follows, profiles, pinCategories, trips, eq, inArray } from '@/lib/db'
import type { EntryWithRelations } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Feed — Travelog' }

export default async function FeedPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const db = getDB()

  const following = await db
    .select({ followingId: follows.followingId })
    .from(follows)
    .where(eq(follows.followerId, userId))

  const followingIds = following.map((f) => f.followingId)

  let feedEntries: EntryWithRelations[] = []
  if (followingIds.length > 0) {
    const rows = await db
      .select()
      .from(entries)
      .leftJoin(profiles, eq(entries.userId, profiles.id))
      .leftJoin(trips, eq(entries.tripId, trips.id))
      .leftJoin(pinCategories, eq(entries.categoryId, pinCategories.id))
      .where(inArray(entries.userId, followingIds))
      .orderBy(entries.createdAt)
      .limit(30)

    feedEntries = rows.map((r) => ({
      ...r.entries,
      profile: r.profiles,
      trip: r.trips,
      category: r.pin_categories,
    })) as EntryWithRelations[]
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <Link href="/explore" className="text-sm text-indigo-600 hover:underline">Explore public entries →</Link>
      </div>

      {feedEntries.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium mb-2">Nothing here yet</p>
          <p className="text-sm mb-6">Follow other travelers to see their public entries here.</p>
          <Link href="/explore" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Discover travelers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {feedEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
