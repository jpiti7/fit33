begin;

alter table public.workouts
add column if not exists client_id uuid;

create unique index if not exists workouts_user_client_id_unique
on public.workouts(user_id, client_id)
where client_id is not null;

commit;
