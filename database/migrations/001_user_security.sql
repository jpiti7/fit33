    begin;

-- 1. Añadir propietario a las tablas principales
alter table public.weight_logs
add column if not exists user_id uuid
references auth.users(id)
on delete cascade;

alter table public.workouts
add column if not exists user_id uuid
references auth.users(id)
on delete cascade;

-- 2. Asociar los registros antiguos a tu cuenta
update public.weight_logs
set user_id = '44277c22-bddd-4f4e-9557-bab088dd14e0'
where user_id is null;

update public.workouts
set user_id = '44277c22-bddd-4f4e-9557-bab088dd14e0'
where user_id is null;

-- 3. Evitar nuevos registros sin propietario
alter table public.weight_logs
alter column user_id set not null;

alter table public.workouts
alter column user_id set not null;

-- 4. Índices para acelerar las consultas por usuario
create index if not exists weight_logs_user_id_idx
on public.weight_logs(user_id);

create index if not exists workouts_user_id_idx
on public.workouts(user_id);

create index if not exists exercises_workout_id_idx
on public.exercises(workout_id);

create index if not exists sets_exercise_id_idx
on public.sets(exercise_id);

-- 5. Activar RLS
alter table public.weight_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.sets enable row level security;

-- 6. Eliminar políticas temporales de desarrollo
drop policy if exists "Permitir registros durante desarrollo"
on public.weight_logs;

drop policy if exists "Permitir lectura durante desarrollo"
on public.weight_logs;

drop policy if exists "dev_workouts"
on public.workouts;

drop policy if exists "dev_exercises"
on public.exercises;

drop policy if exists "dev_sets"
on public.sets;

-- Por si se crearon con otros nombres
drop policy if exists "weight_logs_select"
on public.weight_logs;

drop policy if exists "weight_logs_insert"
on public.weight_logs;

drop policy if exists "weight_logs_update"
on public.weight_logs;

drop policy if exists "weight_logs_delete"
on public.weight_logs;

-- 7. Políticas de peso
create policy "Usuarios leen sus pesos"
on public.weight_logs
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Usuarios crean sus pesos"
on public.weight_logs
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Usuarios actualizan sus pesos"
on public.weight_logs
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Usuarios eliminan sus pesos"
on public.weight_logs
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- 8. Políticas de entrenamientos
create policy "Usuarios leen sus entrenamientos"
on public.workouts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Usuarios crean sus entrenamientos"
on public.workouts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Usuarios actualizan sus entrenamientos"
on public.workouts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Usuarios eliminan sus entrenamientos"
on public.workouts
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- 9. Los ejercicios se protegen mediante el entrenamiento padre
create policy "Usuarios leen sus ejercicios"
on public.exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = exercises.workout_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios crean sus ejercicios"
on public.exercises
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = exercises.workout_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios actualizan sus ejercicios"
on public.exercises
for update
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = exercises.workout_id
      and workouts.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = exercises.workout_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios eliminan sus ejercicios"
on public.exercises
for delete
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = exercises.workout_id
      and workouts.user_id = (select auth.uid())
  )
);

-- 10. Las series se protegen mediante ejercicio y entrenamiento
create policy "Usuarios leen sus series"
on public.sets
for select
to authenticated
using (
  exists (
    select 1
    from public.exercises
    join public.workouts
      on workouts.id = exercises.workout_id
    where exercises.id = sets.exercise_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios crean sus series"
on public.sets
for insert
to authenticated
with check (
  exists (
    select 1
    from public.exercises
    join public.workouts
      on workouts.id = exercises.workout_id
    where exercises.id = sets.exercise_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios actualizan sus series"
on public.sets
for update
to authenticated
using (
  exists (
    select 1
    from public.exercises
    join public.workouts
      on workouts.id = exercises.workout_id
    where exercises.id = sets.exercise_id
      and workouts.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.exercises
    join public.workouts
      on workouts.id = exercises.workout_id
    where exercises.id = sets.exercise_id
      and workouts.user_id = (select auth.uid())
  )
);

create policy "Usuarios eliminan sus series"
on public.sets
for delete
to authenticated
using (
  exists (
    select 1
    from public.exercises
    join public.workouts
      on workouts.id = exercises.workout_id
    where exercises.id = sets.exercise_id
      and workouts.user_id = (select auth.uid())
  )
);

commit;