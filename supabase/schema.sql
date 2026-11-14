-- Vườn Chữ: accounts, cloud saves and the public leaderboard.
-- Run once in Supabase → SQL Editor. Safe to run again.

create table if not exists public.saves (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  state     jsonb not null,
  device    text,
  saved_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  name       text,
  lvl        int  default 1,
  xp         int  default 0,
  words      int  default 0,
  look       jsonb,
  track      text,
  level      text,
  updated_at timestamptz default now()
);

alter table public.saves    enable row level security;
alter table public.profiles enable row level security;

-- each player can only read and write their own save
drop policy if exists "own save read"   on public.saves;
drop policy if exists "own save insert" on public.saves;
drop policy if exists "own save update" on public.saves;
create policy "own save read"   on public.saves for select using (auth.uid() = user_id);
create policy "own save insert" on public.saves for insert with check (auth.uid() = user_id);
create policy "own save update" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- everyone can see the leaderboard; only the owner can change their row
drop policy if exists "profiles readable"  on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "profiles readable"  on public.profiles for select using (true);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = user_id);
create policy "own profile update" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update on public.saves    to authenticated;
grant select                 on public.profiles to anon, authenticated;
grant insert, update         on public.profiles to authenticated;
