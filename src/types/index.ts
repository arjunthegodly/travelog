export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  default_entry_visibility: 'public' | 'private'
  map_theme: MapTheme
  created_at: string
}

export interface MapTheme {
  baseStyle?: string
  pinColor?: string
  fillColor?: string
}

export interface Trip {
  id: string
  user_id: string
  name: string
  description: string | null
  slug: string
  color: string
  is_public: boolean
  created_at: string
  profile?: Profile
  entry_count?: number
}

export interface PinCategory {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  created_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
}

export interface Entry {
  id: string
  user_id: string
  trip_id: string | null
  category_id: string | null
  title: string
  content: Json | null
  location_name: string | null
  lat: number
  lng: number
  country_code: string | null
  visit_date: string | null
  rating: number | null
  is_public: boolean
  display_order: number | null
  created_at: string
  updated_at: string
  profile?: Profile
  trip?: Trip
  category?: PinCategory
  tags?: Tag[]
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}

export interface TripRoute {
  id: string
  trip_id: string
  waypoints: Array<{ lat: number; lng: number }>
  color: string | null
  created_at: string
}

export type EntryWithRelations = Omit<Entry, 'profile' | 'trip' | 'category' | 'tags'> & {
  profile?: Profile | null
  trip?: Trip | null
  category?: PinCategory | null
  tags?: Array<{ tag: Tag | null }>
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      trips: {
        Row: Trip
        Insert: Omit<Trip, 'id' | 'created_at'>
        Update: Partial<Omit<Trip, 'id' | 'user_id' | 'created_at'>>
      }
      pin_categories: {
        Row: PinCategory
        Insert: Omit<PinCategory, 'id' | 'created_at'>
        Update: Partial<Omit<PinCategory, 'id' | 'user_id' | 'created_at'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id'>
        Update: Partial<Omit<Tag, 'id' | 'user_id'>>
      }
      entries: {
        Row: Entry
        Insert: Omit<Entry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Entry, 'id' | 'user_id' | 'created_at'>>
      }
      follows: {
        Row: Follow
        Insert: Follow
        Update: never
      }
    }
  }
}
