create or replace function public.get_public_reservation_occupancy()
returns table (reservation_date date, total_people integer)
language sql
security definer
set search_path = public
as $$
  select
    r.reservation_date,
    coalesce(sum(r.people), 0)::integer as total_people
  from public.reservations r
  where r.status <> 'Cancelado'
  group by r.reservation_date
  order by r.reservation_date;
$$;

revoke all on function public.get_public_reservation_occupancy() from public;
grant execute on function public.get_public_reservation_occupancy() to anon, authenticated;

alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Public can manage menu items" on public.menu_items;
drop policy if exists "Authenticated can manage menu items" on public.menu_items;
create policy "Authenticated can manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read reservations" on public.reservations;
drop policy if exists "Authenticated can read reservations" on public.reservations;
create policy "Authenticated can read reservations"
on public.reservations for select
to authenticated
using (true);

drop policy if exists "Public can update reservations" on public.reservations;
drop policy if exists "Authenticated can update reservations" on public.reservations;
create policy "Authenticated can update reservations"
on public.reservations for update
to authenticated
using (true)
with check (true);

drop policy if exists "Public can delete reservations" on public.reservations;
drop policy if exists "Authenticated can delete reservations" on public.reservations;
create policy "Authenticated can delete reservations"
on public.reservations for delete
to authenticated
using (true);

drop policy if exists "Public can upload menu images" on storage.objects;
drop policy if exists "Authenticated can upload menu images" on storage.objects;
create policy "Authenticated can upload menu images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Public can update menu images" on storage.objects;
drop policy if exists "Authenticated can update menu images" on storage.objects;
create policy "Authenticated can update menu images"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Public can delete menu images" on storage.objects;
drop policy if exists "Authenticated can delete menu images" on storage.objects;
create policy "Authenticated can delete menu images"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-images');
