import { createClient } from '@supabase/supabase-js';
import { menuData } from './src/data/menu';
import 'dotenv/config';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(url, key);

const mockReservations = [
  { reservation_date: '2026-05-26', titular1: 'Mateus Lima', titular2: 'Ana Costa', people: 8, time: '21:00', type: 'Aniversário', status: 'Confirmado' },
  { reservation_date: '2026-05-26', titular1: 'João Silva', titular2: null, people: 2, time: '20:30', type: 'Jantar Romântico', status: 'Aguardando' },
  { reservation_date: '2026-05-15', titular1: 'Carlos Mendes', titular2: null, people: 10, time: '19:00', type: 'Confraternização', status: 'Confirmado' }
];

async function seed() {
  console.log("Seeding menu items...");
  for (const item of menuData) {
    const { id, ...data } = item;
    await supabase.from('menu_items').insert([{ ...data }]);
  }

  console.log("Seeding reservations...");
  for (const res of mockReservations) {
    await supabase.from('reservations').insert([res]);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
