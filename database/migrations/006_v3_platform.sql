begin;

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Atleta',
  target_weight numeric(5,2),
  target_calories integer not null default 2300 check (target_calories between 1000 and 6000),
  target_protein integer not null default 180 check (target_protein between 40 and 400),
  target_carbs integer not null default 220 check (target_carbs between 40 and 800),
  target_fat integer not null default 70 check (target_fat between 20 and 250),
  target_water_ml integer not null default 3000 check (target_water_ml between 500 and 10000),
  weekly_workouts integer not null default 4 check (weekly_workouts between 1 and 7),
  preferred_training_time text,
  allergies text[] not null default '{}',
  disliked_foods text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.hydration_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consumed_on date not null default current_date,
  amount_ml integer not null check (amount_ml between 1 and 5000),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  plan jsonb not null default '[]'::jsonb,
  generated_by text not null default 'rules' check (generated_by in ('rules', 'ai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 5000),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workout_reminders boolean not null default true,
  weight_reminders boolean not null default true,
  nutrition_reminders boolean not null default false,
  coach_summary boolean not null default true,
  reminder_time time not null default '20:00',
  updated_at timestamptz not null default now()
);

create index if not exists hydration_user_date_idx
  on public.hydration_logs(user_id, consumed_on desc);
create index if not exists coach_messages_user_created_idx
  on public.coach_messages(user_id, created_at desc);
create index if not exists workout_plans_user_week_idx
  on public.workout_plans(user_id, week_start desc);

alter table public.user_preferences enable row level security;
alter table public.hydration_logs enable row level security;
alter table public.workout_plans enable row level security;
alter table public.coach_messages enable row level security;
alter table public.notification_preferences enable row level security;

drop policy if exists "Usuarios gestionan sus preferencias" on public.user_preferences;
create policy "Usuarios gestionan sus preferencias"
on public.user_preferences for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan su hidratacion" on public.hydration_logs;
create policy "Usuarios gestionan su hidratacion"
on public.hydration_logs for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan sus planes" on public.workout_plans;
create policy "Usuarios gestionan sus planes"
on public.workout_plans for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan su chat" on public.coach_messages;
create policy "Usuarios gestionan su chat"
on public.coach_messages for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan sus notificaciones" on public.notification_preferences;
create policy "Usuarios gestionan sus notificaciones"
on public.notification_preferences for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

commit;
