
create extension if not exists pgcrypto;

-- Player profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  mobile text not null,
  country text not null,
  email text not null,
  created_at timestamptz default now()
);

-- Admin accounts. Only insert admin IDs manually.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Game sessions
create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null default 0,
  coins integer not null default 0,
  started_at timestamptz default now(),
  completed_at timestamptz default now()
);

-- Player stories
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  story text not null,
  related_to_someone boolean not null default false,
  tagged_name text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

-- Basic visit events
create table public.visit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  created_at timestamptz default now()
);

-- Enable row-level security
alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.game_sessions enable row level security;
alter table public.stories enable row level security;
alter table public.visit_events enable row level security;

-- Admin helper
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

-- Profiles
create policy "Players read own profile"
on public.profiles for select
using (id = (select auth.uid()) or public.is_admin());

create policy "Players insert own profile"
on public.profiles for insert
with check (id = (select auth.uid()));

create policy "Players update own profile"
on public.profiles for update
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Admin accounts: never allow client-side self-registration
create policy "Admins read admin list"
on public.admin_users for select
using (user_id = (select auth.uid()));

-- Game sessions
create policy "Players read own sessions"
on public.game_sessions for select
using (user_id = (select auth.uid()) or public.is_admin());

create policy "Players create own sessions"
on public.game_sessions for insert
with check (user_id = (select auth.uid()));

-- Stories
create policy "Read approved stories or own stories"
on public.stories for select
using (
  status = 'approved'
  or user_id = (select auth.uid())
  or public.is_admin()
);

create policy "Players submit own stories"
on public.stories for insert
with check (
  user_id = (select auth.uid())
  and status = 'pending'
);

create policy "Admins update stories"
on public.stories for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins delete stories"
on public.stories for delete
using (public.is_admin());

-- Visit events
create policy "Players log own visits"
on public.visit_events for insert
with check (user_id = (select auth.uid()));

create policy "Admins read visits"
on public.visit_events for select
using (public.is_admin());

create index profiles_created_at_idx
on public.profiles(created_at desc);

create index stories_status_idx
on public.stories(status);

create index sessions_user_idx
on public.game_sessions(user_id);

create index visits_created_at_idx
on public.visit_events(created_at desc);
