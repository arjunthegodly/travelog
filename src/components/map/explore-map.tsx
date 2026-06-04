'use client'

import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRouter } from 'next/navigation'

interface MapEntry {
  id: string
  title: string
  lat: number
  lng: number
  color: string
}

export function ExploreMap({ entries }: { entries: MapEntry[] }) {
  const router = useRouter()

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ longitude: 0, latitude: 20, zoom: 1.5 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      <NavigationControl position="top-right" />
      {entries.map((entry) => (
        <Marker
          key={entry.id}
          longitude={entry.lng}
          latitude={entry.lat}
          onClick={() => router.push(`/entry/${entry.id}`)}
        >
          <button
            className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform"
            style={{ backgroundColor: entry.color }}
            title={entry.title}
          />
        </Marker>
      ))}
    </Map>
  )
}
