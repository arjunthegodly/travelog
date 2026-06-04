import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Profile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const profile = data as Profile | null
  if (!profile) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.display_name ?? profile.username}</h1>
          <p className="text-gray-500">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-gray-700">{profile.bio}</p>}
        </div>
      </div>
      <p className="text-gray-400 text-center py-16">Map and entries coming soon.</p>
    </div>
  )
}
