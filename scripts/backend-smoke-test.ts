import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env antes de testar.');
}

const supabase = createClient(url, key);
const suffix = Date.now();

const menuInsert = await supabase
  .from('menu_items')
  .insert([{
    name: `Teste Backend ${suffix}`,
    description: 'Item temporario de validacao automatica.',
    price: 10.9,
    category: 'Teste',
    image: 'https://example.com/menu-test.jpg',
    is_promoted: false,
  }])
  .select()
  .single();

if (menuInsert.error) throw menuInsert.error;

const menuId = menuInsert.data.id;

const menuUpdate = await supabase
  .from('menu_items')
  .update({
    price: 8.9,
    is_promoted: true,
    promotional_price: 7.9,
    promotion_label: 'Smoke Test',
    image: 'https://example.com/menu-test-updated.jpg',
  })
  .eq('id', menuId)
  .select()
  .single();

if (menuUpdate.error) throw menuUpdate.error;

if (
  Number(menuUpdate.data.price) !== 8.9 ||
  menuUpdate.data.is_promoted !== true ||
  Number(menuUpdate.data.promotional_price) !== 7.9 ||
  menuUpdate.data.image !== 'https://example.com/menu-test-updated.jpg'
) {
  throw new Error('Atualizacao de cardapio nao persistiu os campos esperados.');
}

const menuDelete = await supabase
  .from('menu_items')
  .delete()
  .eq('id', menuId);

if (menuDelete.error) throw menuDelete.error;

const reservationInsert = await supabase
  .from('reservations')
  .insert([{
    reservation_date: '2026-06-06',
    titular1: `Teste Reserva ${suffix}`,
    titular2: null,
    people: 2,
    time: '19:00',
    type: 'Reserva Normal',
    status: 'Aguardando',
    phone: '(11) 99999-9999',
    email: 'teste@example.com',
    code: `#T${String(suffix).slice(-4)}`,
  }])
  .select()
  .single();

if (reservationInsert.error) throw reservationInsert.error;

const reservationId = reservationInsert.data.id;

const reservationUpdate = await supabase
  .from('reservations')
  .update({ status: 'Confirmado' })
  .eq('id', reservationId)
  .select()
  .single();

if (reservationUpdate.error) throw reservationUpdate.error;

if (reservationUpdate.data.status !== 'Confirmado') {
  throw new Error('Atualizacao de reserva nao persistiu o status esperado.');
}

const reservationDelete = await supabase
  .from('reservations')
  .delete()
  .eq('id', reservationId);

if (reservationDelete.error) throw reservationDelete.error;

console.log('Backend OK: cardapio e reservas criam, atualizam e apagam no Supabase.');
