import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  throw new Error('Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env local.');
}

if (!email || !password) {
  throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env local.');
}

if (password.length < 12) {
  throw new Error('Use uma senha com pelo menos 12 caracteres.');
}

const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    role: 'admin',
    app: 'bistrot-de-ville',
  },
});

if (!createError) {
  console.log(`Admin criado: ${created.user?.email}`);
  console.log('Login pronto. O painel exige apenas sessao autenticada no Supabase.');
  process.exit(0);
}

if (!createError.message.toLowerCase().includes('already')) {
  throw createError;
}

const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
if (listError) throw listError;

const existing = (users.users as any[]).find(user => user.email?.toLowerCase() === email.toLowerCase());
if (!existing) throw createError;

const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
  password,
  email_confirm: true,
  user_metadata: {
    ...(existing.user_metadata || {}),
    role: 'admin',
    app: 'bistrot-de-ville',
  },
});

if (updateError) throw updateError;

console.log(`Admin atualizado: ${email}`);
console.log('Login pronto. O painel exige apenas sessao autenticada no Supabase.');
