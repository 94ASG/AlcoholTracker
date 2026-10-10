-- ==========================================
-- AlcoholTracker 2.0: Party Schema Migration
-- ==========================================

-- Alte Tabellen entfernen falls vorhanden
drop table if exists public.reactions cascade;
drop table if exists public.push_subscriptions cascade;
drop table if exists public.drinks cascade;
drop table if exists public.party_members cascade;
drop table if exists public.parties cascade;
drop table if exists public.people cascade;
drop table if exists public.profiles cascade;

-- 1. Profiles (lokal auf Geräten identifiziert)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 30),
  emoji text not null default '😎',
  color text not null default '#C6FF3D',
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Ends-at Berechnungsfunktion: 10h ODER nächster Morgen 10:00 Uhr Berlin Zeit (das Frühere)
create or replace function public.calculate_party_ends_at(p_created_at timestamptz)
returns timestamptz as $$
declare
  v_berlin_time timestamp;
  v_berlin_date date;
  v_next_morning timestamptz;
  v_ten_hours timestamptz;
begin
  v_berlin_time := p_created_at at time zone 'Europe/Berlin';
  v_berlin_date := v_berlin_time::date;
  
  -- Wenn Party vor 10:00 Uhr morgens gestartet wurde (z.B. 02:00 Uhr nachts),
  -- ist der nächste 10:00 Uhr Punkt heute um 10:00 Uhr
  if extract(hour from v_berlin_time) < 10 then
    v_next_morning := (v_berlin_date + time '10:00:00') at time zone 'Europe/Berlin';
  else
    v_next_morning := (v_berlin_date + interval '1 day' + time '10:00:00') at time zone 'Europe/Berlin';
  end if;
  
  v_ten_hours := p_created_at + interval '10 hours';
  
  if v_next_morning < v_ten_hours then
    return v_next_morning;
  else
    return v_ten_hours;
  end if;
end;
$$ language plpgsql immutable;

-- 3. Parties
create table public.parties (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 50),
  emoji text not null default '🎉',
  host_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  ends_at timestamptz not null default now(),
  ended_at timestamptz,
  wrapped_notified_at timestamptz
);

-- Trigger für automatische Berechnung von ends_at
create or replace function public.set_party_ends_at()
returns trigger as $$
begin
  if new.ends_at is null or new.ends_at = new.created_at or new.ends_at = now() then
    new.ends_at := public.calculate_party_ends_at(coalesce(new.created_at, now()));
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_set_party_ends_at
before insert on public.parties
for each row execute function public.set_party_ends_at();

-- 4. Party Members
create table public.party_members (
  party_id uuid not null references public.parties(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (party_id, profile_id)
);

-- 5. Drinks
create table public.drinks (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.parties(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  logged_by uuid references public.profiles(id) on delete set null,
  round_id uuid,
  drink_key text not null,
  name text not null,
  icon text not null default '🍺',
  category text not null default 'beer',
  volume_ml numeric not null,
  abv numeric not null,
  alcohol_g numeric not null,
  beer_liters numeric default 0,
  created_at timestamptz not null default now()
);

create index drinks_party_id_idx on public.drinks(party_id);
create index drinks_profile_id_idx on public.drinks(profile_id);
create index drinks_party_created_idx on public.drinks(party_id, created_at desc);

-- 6. Reactions auf Drinks
create table public.reactions (
  drink_id uuid not null references public.drinks(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key (drink_id, profile_id, emoji)
);

create index reactions_drink_id_idx on public.reactions(drink_id);

-- 7. Web Push Subscriptions
create table public.push_subscriptions (
  endpoint text primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- 8. RPC: Push Subscription registrieren (Security Definer, schützt Endpoints)
create or replace function public.register_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_profile_id uuid
) returns void security definer as $$
begin
  insert into public.push_subscriptions (endpoint, p256dh, auth, profile_id)
  values (p_endpoint, p_p256dh, p_auth, p_profile_id)
  on conflict (endpoint) do update set
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    profile_id = excluded.profile_id,
    created_at = now();
end;
$$ language plpgsql;

-- 9. RPC: Party vorzeitig beenden (nur durch den Host erlaubt)
create or replace function public.end_party(
  p_party_id uuid,
  p_requester_id uuid
) returns boolean as $$
declare
  v_host_id uuid;
begin
  select host_id into v_host_id from public.parties where id = p_party_id;
  if v_host_id is null or v_host_id = p_requester_id then
    update public.parties set ended_at = now() where id = p_party_id and ended_at is null;
    return true;
  end if;
  return false;
end;
$$ language plpgsql;

-- 10. Row Level Security
alter table public.profiles enable row level security;
alter table public.parties enable row level security;
alter table public.party_members enable row level security;
alter table public.drinks enable row level security;
alter table public.reactions enable row level security;
alter table public.push_subscriptions enable row level security;

-- Da die App ohne Passwort-Login für Freunde funktioniert, offene Anon-Policies:
create policy "profiles all" on public.profiles for all using (true) with check (true);
create policy "parties all" on public.parties for all using (true) with check (true);
create policy "party_members all" on public.party_members for all using (true) with check (true);
create policy "drinks all" on public.drinks for all using (true) with check (true);
create policy "reactions all" on public.reactions for all using (true) with check (true);

-- Push Subscriptions dürfen vom Client NICHT ausgelesen werden (Datenschutz):
create policy "push_subscriptions insert" on public.push_subscriptions for insert with check (true);

-- 11. Realtime aktivieren
alter publication supabase_realtime add table public.parties;
alter publication supabase_realtime add table public.party_members;
alter publication supabase_realtime add table public.drinks;
alter publication supabase_realtime add table public.reactions;
