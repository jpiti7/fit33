begin;

alter table public.workouts
add column if not exists started_at timestamptz default now();

alter table public.workouts
add column if not exists finished_at timestamptz;

alter table public.workouts
add column if not exists notes text;

alter table public.exercises
alter column workout_id set not null;

alter table public.exercises
add column if not exists muscle_group text;

alter table public.sets
alter column exercise_id set not null;

alter table public.sets
add column if not exists completed boolean default false;

alter table public.sets
add column if not exists created_at timestamptz default now();

alter table public.sets
add constraint sets_weight_non_negative
check (weight is null or weight >= 0);

alter table public.sets
add constraint sets_reps_positive
check (reps is null or reps > 0);

alter table public.sets
add constraint sets_rir_range
check (rir is null or rir between 0 and 5);

create unique index if not exists exercises_workout_order_unique
on public.exercises(workout_id, exercise_order);

create unique index if not exists sets_exercise_number_unique
on public.sets(exercise_id, set_number);

commit;