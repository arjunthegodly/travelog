import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EntryCard } from '@/components/entries/entry-card'

export const metadata = { title: 'Feed — Travelog' }

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get IDs of users this user follows
  const { data: following } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)

  const followingIds = following?.map((f) => f.following_id) ?? []

  let entries = []
  if (followingIds.length > 0) {
    const { data } = await supabase
      .from('entries')
      .select('*, profile:profiles(*), trip:trips(*), category:pin_categories(*), tags:entry_tags(tag:tags(*))')
      .in('user_id', followingIds)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(30)
    entries = data ?? []
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <Link href="/explore" className="text-sm text-indigo-600 hover:underline">Explore public entries →</Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium mb-2">Nothing here yet</p>
          <p className="text-sm mb-6">Follow other travelers to see their public entries here.</p>
          <Link href="/explore" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Discover travelers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry: any) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
