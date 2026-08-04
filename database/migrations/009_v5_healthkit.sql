create table if not exists public.health_daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recorded_on date not null,
  steps integer not null default 0 check (steps >= 0),
  active_energy_kcal numeric(10,2) not null default 0 check (active_energy_kcal >= 0),
  resting_heart_rate numeric(8,2),
  sleep_minutes integer not null default 0 check (sleep_minutes >= 0),
  body_mass_kg numeric(7,2),
  workout_minutes integer not null default 0 check (workout_minutes >= 0),
  workout_count integer not null default 0 check (workout_count >= 0),
  source text not null default 'apple-health',
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, recorded_on, source)
);

alter table public.health_daily_snapshots enable row level security;

drop policy if exists "health snapshots select own" on public.health_daily_snapshots;
create policy "health snapshots select own" on public.health_daily_snapshots
for select using (auth.uid() = user_id);

drop policy if exists "health snapshots insert own" on public.health_daily_snapshots;
create policy "health snapshots insert own" on public.health_daily_snapshots
for insert with check (auth.uid() = user_id);

drop policy if exists "health snapshots update own" on public.health_daily_snapshots;
create policy "health snapshots update own" on public.health_daily_snapshots
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists health_daily_snapshots_user_date_idx
on public.health_daily_snapshots (user_id, recorded_on desc);
