begin;

create table if not exists public.recovery_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recorded_on date not null default current_date,
  sleep_hours numeric(4,1) not null check (sleep_hours between 0 and 14),
  sleep_quality smallint not null check (sleep_quality between 1 and 5),
  soreness smallint not null check (soreness between 1 and 5),
  stress smallint not null check (stress between 1 and 5),
  energy smallint not null check (energy between 1 and 5),
  resting_heart_rate smallint check (resting_heart_rate between 30 and 220),
  notes text check (notes is null or char_length(notes) <= 500),
  score smallint not null check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, recorded_on)
);

create index if not exists recovery_user_date_idx
  on public.recovery_checkins(user_id, recorded_on desc);

alter table public.recovery_checkins enable row level security;

drop policy if exists "Usuarios gestionan su recuperacion" on public.recovery_checkins;
create policy "Usuarios gestionan su recuperacion"
on public.recovery_checkins for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

commit;
