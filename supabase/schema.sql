-- Grounded backend schema. Paste into Supabase > SQL Editor > Run.
create extension if not exists pgcrypto;

-- ---------- Tables ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  major text not null default '',
  age text not null default '',
  bio text not null default '',
  interests text[] not null default '{}',
  onboarded boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('club','business')),
  category text not null,
  description text not null default '',
  email text not null default '',
  owner_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  time text not null,
  location text not null,
  description text not null default '',
  cost text not null default 'Free',
  registration_link text,
  category text not null,
  org_id uuid not null references public.organizations(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  popular_majors text[] not null default '{}',
  submitted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.saved_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  primary key (user_id, event_id)
);

create table public.follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  primary key (user_id, org_id)
);

-- ---------- Helpers ----------
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- Create a profile row automatically when someone signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Follower counts across ALL users (individual rows stay private).
create or replace view public.event_follower_counts as
  select event_id, count(*)::int as n from public.saved_events group by event_id;
create or replace view public.org_follower_counts as
  select org_id, count(*)::int as n from public.follows group by org_id;
grant select on public.event_follower_counts, public.org_follower_counts to authenticated;

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.events enable row level security;
alter table public.saved_events enable row level security;
alter table public.follows enable row level security;

-- profiles: see/edit only your own (admins can read all). Nobody can self-promote to admin.
create policy "profiles read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (name, email, major, age, bio, interests, onboarded) on public.profiles to authenticated;

-- organizations: everyone signed in can read; only admins change them.
create policy "orgs read" on public.organizations for select to authenticated using (true);
create policy "orgs admin write" on public.organizations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- events: approved events are public to members; submitters see their own; admins see all.
create policy "events read" on public.events for select to authenticated
  using (status = 'approved' or submitted_by = auth.uid() or public.is_admin());
create policy "events submit" on public.events for insert to authenticated
  with check (submitted_by = auth.uid() and status = 'pending');
create policy "events admin update" on public.events for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "events admin delete" on public.events for delete to authenticated
  using (public.is_admin());

-- follows / saved events: each user manages only their own rows.
create policy "saved own" on public.saved_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "follows own" on public.follows for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Live updates ----------
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.organizations;
