create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  code text,
  name text not null,
  description text,
  price jsonb not null default '0'::jsonb,
  category text not null,
  image text,
  is_promoted boolean not null default false,
  promotional_price jsonb,
  promotion_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_items_name_not_blank check (length(trim(name)) > 0),
  constraint menu_items_category_not_blank check (length(trim(category)) > 0)
);

alter table public.menu_items
  add column if not exists code text,
  add column if not exists description text,
  add column if not exists image text,
  add column if not exists is_promoted boolean not null default false,
  add column if not exists promotional_price jsonb,
  add column if not exists promotion_label text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists menu_items_category_idx on public.menu_items (category);
create index if not exists menu_items_created_at_idx on public.menu_items (created_at desc);
create index if not exists menu_items_is_promoted_idx on public.menu_items (is_promoted) where is_promoted = true;
create index if not exists menu_items_name_lower_idx on public.menu_items (lower(name));

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_date date not null,
  titular1 text not null,
  titular2 text,
  people integer not null,
  time text not null,
  type text not null default 'Reserva Normal',
  status text not null default 'Aguardando',
  phone text,
  email text,
  code text,
  total_spent numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_people_positive check (people > 0),
  constraint reservations_status_valid check (status in ('Aguardando', 'Confirmado', 'Cancelado')),
  constraint reservations_titular1_not_blank check (length(trim(titular1)) > 0)
);

alter table public.reservations
  add column if not exists titular2 text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists code text,
  add column if not exists total_spent numeric(10,2),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists reservations_date_idx on public.reservations (reservation_date);
create index if not exists reservations_status_idx on public.reservations (status);
create index if not exists reservations_code_idx on public.reservations (code);
create index if not exists reservations_created_at_idx on public.reservations (created_at desc);

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
on public.menu_items for select
to anon, authenticated
using (true);

drop policy if exists "Public can manage menu items" on public.menu_items;
create policy "Public can manage menu items"
on public.menu_items for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can read reservations" on public.reservations;
create policy "Public can read reservations"
on public.reservations for select
to anon, authenticated
using (true);

drop policy if exists "Public can create reservations" on public.reservations;
create policy "Public can create reservations"
on public.reservations for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update reservations" on public.reservations;
create policy "Public can update reservations"
on public.reservations for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete reservations" on public.reservations;
create policy "Public can delete reservations"
on public.reservations for delete
to anon, authenticated
using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  null
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read menu images" on storage.objects;
create policy "Public can read menu images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Public can upload menu images" on storage.objects;
create policy "Public can upload menu images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Public can update menu images" on storage.objects;
create policy "Public can update menu images"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Public can delete menu images" on storage.objects;
create policy "Public can delete menu images"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'menu-images');
