# Travelog — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-06-03  
**Status:** Draft

---

## 1. Product Overview

Travelog is a social travel journaling web app where users pin rich-text journal entries to an interactive world map, organize them into trips, and share their stories with followers. Each user builds a personal travel map they own — public entries flow into a follower feed and a global explore page; private entries stay invisible to everyone else.

**Core value proposition:** _Your travels, mapped and told — privately or with the world._

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Users log their travels consistently | Avg. entries per active user per month ≥ 4 |
| Social layer drives retention | 30-day retention for users with ≥ 1 follower > 2× solo users |
| Map is the hero feature | ≥ 70% of sessions include a map interaction |
| Personalization drives identity | ≥ 50% of users customize a pin category or map theme within first week |

---

## 3. Users & Personas

### 3.1 The Solo Traveler (primary)
Keeps a private digital travel diary. Wants to remember where they went, what they thought, and how they rated each place. Not necessarily social, but might selectively share standout trips.

### 3.2 The Travel Creator (primary)
Shares their travel stories publicly. Cares about how their profile map looks to followers. Follows other travelers for inspiration. Uses trip collections to tell cohesive stories.

### 3.3 The Casual Viewer
Discovers the app through a shared profile link or the explore page. May sign up after browsing others' maps.

---

## 4. Platform & Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router, TypeScript) | SSR for SEO on public profiles/entries; strong ecosystem |
| Styling | Tailwind CSS | Rapid responsive UI development |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) | Managed Postgres, Row Level Security for privacy, built-in auth |
| Map | Mapbox GL JS + react-map-gl | Best-in-class styling, custom themes, generous free tier |
| Rich Text | Tiptap | Headless, highly extensible, good React integration |
| Source Control | GitHub | PRs, branch protection, Vercel integration |
| Deployment | Vercel | Zero-config Next.js deploys, auto-deploy on push to main, preview URLs per PR |
| State Management | Zustand + React Query (TanStack) | Local UI state + server state caching |

---

## 5. Feature Specifications

### 5.1 Authentication & Profiles

**Auth flows:**
- Email/password sign-up with email verification
- OAuth: Google sign-in
- Password reset

**Profile page (`/@username`):**
- Avatar, display name, username, bio (280 chars)
- Stat bar: countries visited · trips · total entries · followers · following
- Personal map (see §5.2) as the hero element — only public entries shown to non-owners
- Trip list below the map, each linkable
- Follow / Unfollow button (hidden on own profile)
- Settings: edit profile, privacy defaults, map theme, account management

**Privacy default:** new entries default to the user's chosen default (public or private, set in settings).

---

### 5.2 Interactive Map (Mapbox GL JS)

The map is the central UI surface — present on the home feed, profile pages, and trip pages.

**Map modes:**

| Mode | Description |
|------|-------------|
| **Pin mode** | Location-specific entries rendered as pins. Click → entry preview card → full entry. |
| **Route mode** | User can draw a polyline between pins within a trip to show travel paths. |
| **Countries fill** | Countries the user has visited (derived from entry locations) are shaded. Hoverable tooltip shows country name + entry count. |

**Map controls:**
- Search bar to jump to any location (Mapbox Geocoding API)
- Toggle between pin / route / countries-fill layers
- Filter by trip (dropdown)
- Zoom to fit all pins for a selected trip
- "Add entry here" on right-click or long-press

**Map theming (per user):**
- Base map style: choose from Mapbox preset styles (Streets, Outdoors, Satellite, Dark, Light) + any user-saved custom style URL
- Pin accent color: user-defined hex color applied to all default pins
- Country fill color: user-defined
- Route color: user-defined

---

### 5.3 Journal Entries

**Entry fields:**

| Field | Type | Required |
|-------|------|----------|
| Title | Plain text (120 chars) | Yes |
| Location | Mapbox geocoded point (lat/lng + place name) | Yes |
| Content | Rich text (Tiptap) | No |
| Trip | Select from user's trips | No |
| Visit date | Date picker | No |
| Rating | 1–5 stars | No |
| Tags | Multi-select from user's tags or create new | No |
| Pin category | Select from user's categories | No |
| Visibility | Public / Private toggle | Yes |

**Rich text toolbar:** bold, italic, headings (H2/H3), bullet list, numbered list, blockquote, horizontal rule, links.

**Entry page (`/entry/[id]`):**
- Full content view
- Map inset showing pin location
- Author card + follow button
- Tags listed as chips
- Breadcrumb: Profile → Trip → Entry
- Edit / Delete (owner only)
- Share button (copies link; only works for public entries)

---

### 5.4 Trip Collections

**Trip fields:** name, description, cover color (used for route line and trip card), public/private toggle.

**Trip page (`/@username/trip/[slug]`):**
- Trip map (pins + route for this trip only)
- Entry list in chronological order
- Country count for the trip
- Public/private badge

**Trip management:**
- Create/edit/delete trips
- Drag-to-reorder entries within a trip (affects display order only)
- Duplicate trip (copies metadata, not entries)

---

### 5.5 Pin Categories

Users define custom pin categories to semantically color-code their map.

**Category fields:** name (e.g., "Restaurant", "Hike", "Hotel"), color (hex), icon (selection from a curated icon set — ~30 options like fork/knife, mountain, bed, camera, etc.).

Default system categories (pre-seeded per user on sign-up): `Place`, `Food`, `Stay`, `Activity`.

Categories are filterable on the map via a legend toggle panel.

---

### 5.6 Social — Feed & Follow System

**Following:**
- Follow/unfollow any public user
- Follower/following counts on profile
- Notification on new follower (in-app only, MVP)

**Home feed (`/feed`):**
- Chronological feed of public entries from followed users
- Entry card: author avatar + name, entry title, location name, rating, tags, snippet of text, pin-on-mini-map thumbnail
- Infinite scroll
- "Explore" tab on the same page for non-followed public entries (recency-sorted, global)

**Explore page (`/explore`):**
- Global map showing all public entry pins (clustered)
- Click cluster → zooms in; click single pin → entry preview card
- Filter by tag (global tags leaderboard)
- Filter by country

**User search:** search bar in nav → results show user cards with follow button.

---

### 5.7 Personalization Summary

| Feature | Where |
|---------|-------|
| Map base style | Profile settings → Map theme |
| Pin accent color | Profile settings → Map theme |
| Country fill color | Profile settings → Map theme |
| Route color | Trip settings (per trip) |
| Custom pin categories | Settings → Pin Categories |
| Profile bio & avatar | Settings → Profile |
| Entry visibility default | Settings → Privacy |

---

## 6. Data Model (Supabase / PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
profiles (
  id uuid PK references auth.users,
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  default_entry_visibility text DEFAULT 'private', -- 'public' | 'private'
  map_theme jsonb DEFAULT '{}',  -- { baseStyle, pinColor, fillColor }
  created_at timestamptz
)

-- Trips
trips (
  id uuid PK,
  user_id uuid FK → profiles,
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#3B82F6',
  is_public boolean DEFAULT false,
  created_at timestamptz
)

-- Pin categories
pin_categories (
  id uuid PK,
  user_id uuid FK → profiles,
  name text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz
)

-- Entries
entries (
  id uuid PK,
  user_id uuid FK → profiles,
  trip_id uuid FK → trips NULLABLE,
  category_id uuid FK → pin_categories NULLABLE,
  title text NOT NULL,
  content jsonb,           -- Tiptap JSON doc
  location_name text,
  lat numeric(9,6) NOT NULL,
  lng numeric(9,6) NOT NULL,
  country_code char(2),    -- ISO 3166-1 alpha-2, derived on save
  visit_date date,
  rating smallint CHECK (rating BETWEEN 1 AND 5),
  is_public boolean DEFAULT false,
  display_order integer,   -- within trip
  created_at timestamptz,
  updated_at timestamptz
)

-- Tags
tags (
  id uuid PK,
  user_id uuid FK → profiles,
  name text NOT NULL,
  UNIQUE (user_id, name)
)

entry_tags (
  entry_id uuid FK → entries,
  tag_id uuid FK → tags,
  PRIMARY KEY (entry_id, tag_id)
)

-- Trip routes (ordered waypoints for drawn paths)
trip_routes (
  id uuid PK,
  trip_id uuid FK → trips,
  waypoints jsonb NOT NULL,  -- [{lat, lng}, ...]
  color text,
  created_at timestamptz
)

-- Social
follows (
  follower_id uuid FK → profiles,
  following_id uuid FK → profiles,
  created_at timestamptz,
  PRIMARY KEY (follower_id, following_id)
)
```

**Row Level Security policies (key ones):**
- `entries`: SELECT allowed if `is_public = true` OR `auth.uid() = user_id`
- `entries`: INSERT/UPDATE/DELETE only if `auth.uid() = user_id`
- `profiles`: SELECT public; UPDATE only own row
- `trips`: SELECT if `is_public = true` OR owner; mutate only owner

---

## 7. Pages & Routes

```
/                        → Landing page (logged out) or feed (logged in)
/login                   → Sign in
/signup                  → Sign up
/feed                    → Home feed + Explore tab (auth required)
/explore                 → Public global map + entry discovery
/@[username]             → User profile page
/@[username]/trip/[slug] → Trip page
/entry/[id]              → Single entry page
/new                     → New entry form (auth required)
/entry/[id]/edit         → Edit entry (owner only)
/settings                → Profile, privacy, map theme, pin categories
/settings/categories     → Pin category management
```

---

## 8. MVP Scope vs. Future

### MVP (v1.0)
- [x] Auth (email + Google OAuth)
- [x] Profile page with stats
- [x] Interactive map with pins + countries fill
- [x] Journal entries (rich text, rating, tags, visibility toggle)
- [x] Trip collections
- [x] Follow system + home feed + explore page
- [x] Custom pin categories
- [x] Map theme customization (base style + accent colors)
- [x] Mobile-responsive layout

### Post-MVP (v1.x backlog)
- [ ] Route drawing between trip pins
- [ ] Photo/video attachments on entries
- [ ] In-app notifications (follows, comments)
- [ ] Comments on public entries
- [ ] Entry reactions (like/heart)
- [ ] Trip export (PDF travel journal, GPX route file)
- [ ] AI writing assistant for journal entries
- [ ] Embeddable map widget (share a trip map on any site)
- [ ] Native mobile apps (React Native / Expo)

---

## 9. Design Principles

1. **Map first** — the map should always be visible or one tap away; it is the identity of the product.
2. **Privacy by default** — entries start private; users consciously opt in to public.
3. **Personalization = ownership** — color, icons, and themes make the map feel like *yours*, not a generic travel tool.
4. **Social without pressure** — social features enhance but never gate the core journaling loop.
5. **Fast and light** — Mapbox tiles + Supabase edge functions should keep the map snappy even on mobile.

---

## 10. Open Questions

| # | Question | Impact |
|---|----------|--------|
| 1 | Should the explore map show all public pins by default, or require a search/filter first? (performance vs. discovery) | Map load performance |
| 2 | Should trip visibility and entry visibility be independent, or should a private trip force all its entries private? | Privacy UX |
| 3 | Should users be able to reorder their trips on their profile? | Profile UX |
| 4 | Is a username required at sign-up, or auto-generated and editable later? | Onboarding friction |
