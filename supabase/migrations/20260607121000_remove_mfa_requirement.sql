drop policy if exists "Authenticated can manage menu items" on public.menu_items;
create policy "Authenticated can manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can read reservations" on public.reservations;
create policy "Authenticated can read reservations"
on public.reservations for select
to authenticated
using (true);

drop policy if exists "Authenticated can update reservations" on public.reservations;
create policy "Authenticated can update reservations"
on public.reservations for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete reservations" on public.reservations;
create policy "Authenticated can delete reservations"
on public.reservations for delete
to authenticated
using (true);

drop policy if exists "Authenticated can upload menu images" on storage.objects;
create policy "Authenticated can upload menu images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated can update menu images" on storage.objects;
create policy "Authenticated can update menu images"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated can delete menu images" on storage.objects;
create policy "Authenticated can delete menu images"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-images');
