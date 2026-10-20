import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing credentials');
}

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('menu_categories').select('*');
  console.log("Categories:", data);
  if (error) console.log("Error:", error);
}

check();
