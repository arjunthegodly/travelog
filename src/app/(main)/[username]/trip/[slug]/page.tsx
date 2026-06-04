import { notFound } from 'next/navigation'
import { getDB, profiles, trips, eq, and } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function TripPage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params
  const db = getDB()

  const profile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .get()

  if (!profile) notFound()

  const trip = await db
    .select()
    .from(trips)
    .where(and(eq(trips.userId, profile.id), eq(trips.slug, slug)))
    .get()

  if (!trip) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{trip.name}</h1>
      {trip.description && <p className="text-gray-600 mb-6">{trip.description}</p>}
      <p className="text-gray-400 text-center py-16">Trip map and entries coming soon.</p>
    </div>
  )
}
