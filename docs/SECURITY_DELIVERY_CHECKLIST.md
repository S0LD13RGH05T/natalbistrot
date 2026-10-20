# Bistrot de Ville - Checklist de seguranca

## O que ja foi corrigido no codigo

- O login admin nao usa mais senha fixa no front-end.
- `/admin/dashboard` agora exige sessao do Supabase Auth.
- O logout do painel encerra a sessao no Supabase.
- A pagina publica de reservas nao precisa mais ler nomes, telefones e emails; ela usa apenas ocupacao agregada.
- A hero mobile usa a arte vertical dedicada em `public/hero_mobile_bistrot.jpeg`.

## O que precisa ser aplicado no Supabase

Rode a migration `supabase/migrations/20260606090000_harden_public_access.sql` no SQL Editor do Supabase.

Ela deixa:

- `menu_items`: leitura publica, escrita apenas para usuario autenticado.
- `reservations`: criacao publica, leitura/update/delete apenas para usuario autenticado.
- `get_public_reservation_occupancy`: funcao publica que mostra somente data e total de pessoas.
- `menu-images`: leitura publica, upload/update/delete apenas para usuario autenticado.
- As acoes administrativas exigem usuario logado no Supabase Auth.

## Usuario admin

No Supabase:

1. Copie a `service_role key` em `Project Settings > API`.
2. Coloque somente no `.env` local:

```env
SUPABASE_SERVICE_ROLE_KEY=cole_aqui
ADMIN_EMAIL=email_do_dono@dominio.com
ADMIN_PASSWORD=uma_senha_forte_com_12_ou_mais_caracteres
```

3. Rode:

```bash
npm run admin:create
```

4. Passe o email e a senha inicial para o dono por um canal seguro.
5. Remova/nao use a senha antiga de teste, porque credenciais fracas existiram em commits antigos.

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` em variaveis `VITE_*`, no navegador, no Cloudflare Pages/Workers publico ou no Git.

## Chaves e vazamento

- `.env` esta ignorado pelo Git.
- `.env.example` nao contem segredo.
- A chave `anon/publishable` pode ficar no front-end, mas nao deve ter permissao de escrita sensivel sem auth.
- Nunca commitar `service_role`, senha Postgres, access token do Supabase ou token de WhatsApp.

## Recomendacao final para entrega

- Rotacionar senha/admin criado antes dos testes.
- Rodar a migration de seguranca.
- Testar: login admin, editar cardapio, subir imagem, criar reserva publica e confirmar reserva no dashboard.
