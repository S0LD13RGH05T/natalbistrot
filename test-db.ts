import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('menu_items').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
