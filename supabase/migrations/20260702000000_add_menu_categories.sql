-- Create menu_categories table
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default 'sao_paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_categories_name_not_blank check (length(trim(name)) > 0),
  constraint menu_categories_name_unit_unique unique (name, unit)
);

-- Trigger for updated_at
drop trigger if exists set_menu_categories_updated_at on public.menu_categories;
create trigger set_menu_categories_updated_at
before update on public.menu_categories
for each row execute function public.set_updated_at();

-- RLS Policies
alter table public.menu_categories enable row level security;

drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
on public.menu_categories for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage menu categories" on public.menu_categories;
create policy "Authenticated users can manage menu categories"
on public.menu_categories for all
to anon, authenticated
using (true)
with check (true);
