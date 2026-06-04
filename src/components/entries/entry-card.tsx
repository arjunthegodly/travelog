'use client'

import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import type { EntryWithRelations } from '@/types'

interface Props {
  entry: EntryWithRelations
}

export function EntryCard({ entry }: Props) {
  const tags = entry.tags?.map((t) => t.tag?.name).filter((n): n is string => Boolean(n)) ?? []

  return (
    <Link href={`/entry/${entry.id}`} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {entry.profile && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {entry.profile.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">
                <Link href={`/@${entry.profile.username}`} className="hover:underline font-medium text-gray-700" onClick={(e) => e.stopPropagation()}>
                  {entry.profile.username}
                </Link>
              </span>
            </div>
          )}
          <h3 className="font-semibold text-gray-900 truncate">{entry.title}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{entry.location_name ?? `${entry.lat.toFixed(2)}, ${entry.lng.toFixed(2)}`}</span>
          </div>
        </div>
        {entry.rating && (
          <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{entry.rating}</span>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {entry.trip && (
        <div className="mt-3 text-xs text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.trip.color }} />
          {entry.trip.name}
        </div>
      )}
    </Link>
  )
}
