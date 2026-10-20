-- Migration: Add unit support for multi-branch operation (São Paulo and Campos do Jordão)
-- Add unit column to public.menu_items
alter table public.menu_items
  add column if not exists unit text not null default 'sao_paulo';

-- Add unit column to public.reservations
alter table public.reservations
  add column if not exists unit text not null default 'sao_paulo';

-- Create indexes for unit-based queries
create index if not exists menu_items_unit_idx on public.menu_items (unit);
create index if not exists reservations_unit_idx on public.reservations (unit);

-- Recreate RPC get_public_reservation_occupancy to accept unit parameter
create or replace function public.get_public_reservation_occupancy(unit_param text)
returns table (reservation_date date, total_people integer)
language sql
security definer
set search_path = public
as $$
  select
    r.reservation_date,
    coalesce(sum(r.people), 0)::integer as total_people
  from public.reservations r
  where r.status <> 'Cancelado' and r.unit = unit_param
  group by r.reservation_date
  order by r.reservation_date;
$$;

-- Ensure execute permissions are granted to public/anon/authenticated roles
revoke all on function public.get_public_reservation_occupancy(text) from public;
grant execute on function public.get_public_reservation_occupancy(text) to anon, authenticated;
