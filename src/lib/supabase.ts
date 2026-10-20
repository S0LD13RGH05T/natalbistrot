import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://oyyvsnyvdefnphwnlpja.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXZzbnl2ZGVmbnBod25scGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Nzc5ODQsImV4cCI6MjA5NDM1Mzk4NH0.GEICjjUETpwudZNYeFkU5lS3p96lFs2hgBItH7Y4zPE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Supabase nao configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente de build.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
