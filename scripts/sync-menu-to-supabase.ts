import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { menuData, normalizeMenuKey, type MenuItem } from '../src/data/menu.ts';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env antes de sincronizar.');
}

const supabase = createClient(url, key);

const toRow = (item: MenuItem) => ({
  code: item.code ?? null,
  name: item.name,
  description: item.description ?? null,
  price: item.price,
  category: item.category,
  image: item.image ?? null,
  is_promoted: item.isPromoted ?? false,
  promotional_price: item.promotionalPrice ?? null,
  promotion_label: item.promotionLabel ?? null,
});

const { data: existingItems, error: fetchError } = await supabase
  .from('menu_items')
  .select('id, name');

if (fetchError) {
  throw fetchError;
}

const existingByName = new Set(
  (existingItems ?? []).map(item => normalizeMenuKey(item.name))
);

let inserted = 0;
let skipped = 0;

for (const item of menuData) {
  const key = normalizeMenuKey(item.name);

  if (existingByName.has(key)) {
    skipped += 1;
    continue;
  }

  const { error } = await supabase
    .from('menu_items')
    .insert([toRow(item)]);

  if (error) {
    console.error(`Erro ao inserir "${item.name}":`, error.message);
    continue;
  }

  existingByName.add(key);
  inserted += 1;
}

console.log(`Sincronizacao concluida. Inseridos: ${inserted}. Ja existentes/preservados: ${skipped}.`);
