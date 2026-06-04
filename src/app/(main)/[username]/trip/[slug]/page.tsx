import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Trip, Profile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function TripPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>
}) {
  const { username, slug } = await params
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  const profile = profileData as Pick<Profile, 'id'> | null
  if (!profile) notFound()

  const { data: tripData } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', profile.id)
    .eq('slug', slug)
    .single()

  const trip = tripData as Trip | null
  if (!trip) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{trip.name}</h1>
      {trip.description && <p className="text-gray-600 mb-6">{trip.description}</p>}
      <p className="text-gray-400 text-center py-16">Trip map and entries coming soon.</p>
    </div>
  )
}
