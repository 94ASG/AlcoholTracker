-- AlcoholTracker Supabase schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query)

-- People (each person who tracks drinks)
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Du',
  avatar text not null default '👤',
  created_at timestamptz not null default now()
);

-- Drinks (one row per drink, linked to a person)
create table if not exists public.drinks (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  date text not null,          -- YYYY-MM-DD
  name text not null,
  icon text,
  volume numeric,
  abv numeric,
  alcohol numeric,             -- pure alcohol in liters
  beer_liters numeric,
  timestamp timestamptz not null default now()
);

create index if not exists drinks_person_id_idx on public.drinks(person_id);
create index if not exists drinks_date_idx on public.drinks(date);

-- Enable Row Level Security and allow all access for the anon role.
-- This is a no-login friends tracker, so the public publishable key can read/write.
-- (The publishable key maps to the anon role; RLS still applies.)
alter table public.people enable row level security;
alter table public.drinks enable row level security;

create policy "people all" on public.people
  for all using (true) with check (true);

create policy "drinks all" on public.drinks
  for all using (true) with check (true);

-- Enable realtime so changes appear instantly across devices
alter publication supabase_realtime add table public.people;
alter publication supabase_realtime add table public.drinks;
