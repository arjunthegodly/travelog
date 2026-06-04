'use client'

import dynamic from 'next/dynamic'

// mapbox-gl must not run on the server
const ExploreMap = dynamic(
  () => import('./explore-map').then((m) => m.ExploreMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
)

interface MapEntry {
  id: string
  title: string
  lat: number
  lng: number
  color: string
}

export function ExploreMapWrapper({ entries }: { entries: MapEntry[] }) {
  return <ExploreMap entries={entries} />
}
