begin;

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  target_calories integer not null check (target_calories between 1000 and 6000),
  generated_by text not null default 'rules' check (generated_by in ('rules', 'ai')),
  days jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

create index if not exists meal_plans_user_week_idx
  on public.meal_plans(user_id, week_start desc);
create index if not exists shopping_lists_user_week_idx
  on public.shopping_lists(user_id, week_start desc);

alter table public.meal_plans enable row level security;
alter table public.shopping_lists enable row level security;

drop policy if exists "Usuarios gestionan sus menus" on public.meal_plans;
create policy "Usuarios gestionan sus menus"
on public.meal_plans for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan sus listas de compra" on public.shopping_lists;
create policy "Usuarios gestionan sus listas de compra"
on public.shopping_lists for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

commit;
