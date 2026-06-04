-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  bio text check (char_length(bio) <= 280),
  avatar_url text,
  default_entry_visibility text not null default 'private' check (default_entry_visibility in ('public', 'private')),
  map_theme jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- TRIPS
-- ─────────────────────────────────────────
create table public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  name text not null,
  description text,
  slug text not null,
  color text not null default '#3B82F6',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- ─────────────────────────────────────────
-- PIN CATEGORIES
-- ─────────────────────────────────────────
create table public.pin_categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  name text not null,
  color text not null,
  icon text not null,
  created_at timestamptz not null default now()
);

-- Seed default categories for new users
create or replace function public.seed_default_categories()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.pin_categories (user_id, name, color, icon) values
    (new.id, 'Place',    '#6366F1', 'map-pin'),
    (new.id, 'Food',     '#F59E0B', 'utensils'),
    (new.id, 'Stay',     '#10B981', 'bed'),
    (new.id, 'Activity', '#EF4444', 'zap');
  return new;
end;
$$;

create trigger on_profile_created_seed_categories
  after insert on public.profiles
  for each row execute procedure public.seed_default_categories();

-- ─────────────────────────────────────────
-- ENTRIES
-- ─────────────────────────────────────────
create table public.entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  trip_id uuid references public.trips on delete set null,
  category_id uuid references public.pin_categories on delete set null,
  title text not null,
  content jsonb,
  location_name text,
  lat numeric(9,6) not null,
  lng numeric(9,6) not null,
  country_code char(2),
  visit_date date,
  rating smallint check (rating between 1 and 5),
  is_public boolean not null default false,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger entries_set_updated_at
  before update on public.entries
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────
-- TAGS
-- ─────────────────────────────────────────
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  name text not null,
  unique (user_id, name)
);

create table public.entry_tags (
  entry_id uuid not null references public.entries on delete cascade,
  tag_id uuid not null references public.tags on delete cascade,
  primary key (entry_id, tag_id)
);

-- ─────────────────────────────────────────
-- FOLLOWS
-- ─────────────────────────────────────────
create table public.follows (
  follower_id uuid not null references public.profiles on delete cascade,
  following_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ─────────────────────────────────────────
-- TRIP ROUTES
-- ─────────────────────────────────────────
create table public.trip_routes (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references public.trips on delete cascade,
  waypoints jsonb not null default '[]',
  color text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
create index entries_user_id_idx on public.entries (user_id);
create index entries_trip_id_idx on public.entries (trip_id);
create index entries_is_public_idx on public.entries (is_public) where is_public = true;
create index entries_country_code_idx on public.entries (country_code);
create index follows_following_id_idx on public.follows (following_id);
create index trips_user_id_idx on public.trips (user_id);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.pin_categories enable row level security;
alter table public.entries enable row level security;
alter table public.tags enable row level security;
alter table public.entry_tags enable row level security;
alter table public.follows enable row level security;
alter table public.trip_routes enable row level security;

-- profiles
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- trips
create policy "Public trips are readable" on public.trips for select using (is_public = true or auth.uid() = user_id);
create policy "Users manage own trips" on public.trips for all using (auth.uid() = user_id);

-- pin_categories
create policy "Users manage own categories" on public.pin_categories for all using (auth.uid() = user_id);

-- entries
create policy "Public entries are readable" on public.entries for select using (is_public = true or auth.uid() = user_id);
create policy "Users manage own entries" on public.entries for all using (auth.uid() = user_id);

-- tags
create policy "Users manage own tags" on public.tags for all using (auth.uid() = user_id);

-- entry_tags
create policy "Entry tags readable with entry" on public.entry_tags for select using (
  exists (select 1 from public.entries e where e.id = entry_id and (e.is_public = true or e.user_id = auth.uid()))
);
create policy "Users manage own entry tags" on public.entry_tags for all using (
  exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
);

-- follows
create policy "Follows are publicly readable" on public.follows for select using (true);
create policy "Users manage own follows" on public.follows for all using (auth.uid() = follower_id);

-- trip_routes
create policy "Trip routes readable with trip" on public.trip_routes for select using (
  exists (select 1 from public.trips t where t.id = trip_id and (t.is_public = true or t.user_id = auth.uid()))
);
create policy "Users manage own trip routes" on public.trip_routes for all using (
  exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
);
