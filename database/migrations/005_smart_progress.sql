begin;

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  taken_at date not null default current_date,
  weight numeric(5,2),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists progress_photos_user_taken_idx
  on public.progress_photos(user_id, taken_at desc);

alter table public.progress_photos enable row level security;

drop policy if exists "Usuarios leen sus fotos" on public.progress_photos;
drop policy if exists "Usuarios crean sus fotos" on public.progress_photos;
drop policy if exists "Usuarios actualizan sus fotos" on public.progress_photos;
drop policy if exists "Usuarios eliminan sus fotos" on public.progress_photos;

create policy "Usuarios leen sus fotos"
on public.progress_photos for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Usuarios crean sus fotos"
on public.progress_photos for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Usuarios actualizan sus fotos"
on public.progress_photos for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Usuarios eliminan sus fotos"
on public.progress_photos for delete to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'progress-photos',
  'progress-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Usuarios ven sus archivos de progreso" on storage.objects;
drop policy if exists "Usuarios suben sus archivos de progreso" on storage.objects;
drop policy if exists "Usuarios eliminan sus archivos de progreso" on storage.objects;

create policy "Usuarios ven sus archivos de progreso"
on storage.objects for select to authenticated
using (
  bucket_id = 'progress-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Usuarios suben sus archivos de progreso"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'progress-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Usuarios eliminan sus archivos de progreso"
on storage.objects for delete to authenticated
using (
  bucket_id = 'progress-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
