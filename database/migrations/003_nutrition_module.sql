begin;

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  serving_size_g numeric(7,2) not null default 100 check (serving_size_g > 0),
  calories_per_100g numeric(8,2) not null default 0 check (calories_per_100g >= 0),
  protein_per_100g numeric(7,2) not null default 0 check (protein_per_100g >= 0),
  carbs_per_100g numeric(7,2) not null default 0 check (carbs_per_100g >= 0),
  fat_per_100g numeric(7,2) not null default 0 check (fat_per_100g >= 0),
  fiber_per_100g numeric(7,2) not null default 0 check (fiber_per_100g >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_id uuid references public.foods(id) on delete set null,
  consumed_on date not null default current_date,
  meal_type text not null check (meal_type in ('Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena', 'Otro')),
  food_name text not null,
  grams numeric(7,2) not null check (grams > 0),
  calories numeric(8,2) not null check (calories >= 0),
  protein numeric(7,2) not null default 0 check (protein >= 0),
  carbs numeric(7,2) not null default 0 check (carbs >= 0),
  fat numeric(7,2) not null default 0 check (fat >= 0),
  fiber numeric(7,2) not null default 0 check (fiber >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.meal_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_type text not null check (meal_type in ('Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena', 'Otro')),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foods_user_id_idx on public.foods(user_id);
create index if not exists foods_name_idx on public.foods(lower(name));
create index if not exists nutrition_logs_user_date_idx on public.nutrition_logs(user_id, consumed_on desc);
create index if not exists nutrition_logs_user_meal_idx on public.nutrition_logs(user_id, meal_type);
create index if not exists meal_templates_user_id_idx on public.meal_templates(user_id);

alter table public.foods enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.meal_templates enable row level security;

drop policy if exists "Usuarios leen alimentos disponibles" on public.foods;
drop policy if exists "Usuarios crean sus alimentos" on public.foods;
drop policy if exists "Usuarios actualizan sus alimentos" on public.foods;
drop policy if exists "Usuarios eliminan sus alimentos" on public.foods;

create policy "Usuarios leen alimentos disponibles"
on public.foods for select to authenticated
using (user_id is null or user_id = (select auth.uid()));

create policy "Usuarios crean sus alimentos"
on public.foods for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "Usuarios actualizan sus alimentos"
on public.foods for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Usuarios eliminan sus alimentos"
on public.foods for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Usuarios leen sus registros nutricionales" on public.nutrition_logs;
drop policy if exists "Usuarios crean sus registros nutricionales" on public.nutrition_logs;
drop policy if exists "Usuarios actualizan sus registros nutricionales" on public.nutrition_logs;
drop policy if exists "Usuarios eliminan sus registros nutricionales" on public.nutrition_logs;

create policy "Usuarios leen sus registros nutricionales"
on public.nutrition_logs for select to authenticated
using (user_id = (select auth.uid()));

create policy "Usuarios crean sus registros nutricionales"
on public.nutrition_logs for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "Usuarios actualizan sus registros nutricionales"
on public.nutrition_logs for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Usuarios eliminan sus registros nutricionales"
on public.nutrition_logs for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Usuarios gestionan sus plantillas" on public.meal_templates;
create policy "Usuarios gestionan sus plantillas"
on public.meal_templates for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

commit;
