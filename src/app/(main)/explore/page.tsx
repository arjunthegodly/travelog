import { createClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entries/entry-card'
import { ExploreMapWrapper } from '@/components/map/explore-map-wrapper'
import type { EntryWithRelations } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Explore — Travelog' }

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('entries')
    .select('*, profile:profiles(*), trip:trips(*), category:pin_categories(*), tags:entry_tags(tag:tags(*))')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)

  const entries = (data ?? []) as EntryWithRelations[]

  const mapEntries = entries.map((e) => ({
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
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  )
}
