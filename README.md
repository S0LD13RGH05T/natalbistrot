# Bistrot de Ville - Campos do Jordão

Cópia idêntica e completa da experiência gastronômica do **Bistrot de Ville - Campos do Jordão** (https://www.bistrotdeville.com/campos).

## Funcionalidades
- **Hero & Apresentação**: Fotos originais em alta resolução do Chateau nas montanhas, horários e links diretos.
- **Cardápio Completo & Sucessos**: Integração interativa com fotos, opções, seleções e pedidos via WhatsApp.
- **Carta de Vinhos & Sobremesas**: Seleção de vinhos finos franceses e sobremesas artesanais.
- **Ambientes & Galeria de Fotos**: Galeria completa dos ambientes internos e externos, lareira e jardim com araucárias.
- **Avaliações do Google**: Feedback em tempo real com nota 4.9.
- **Feed do Instagram**: Integração com widget do Instagram.
- **Reservas Online**: Sistema de reservas integrado direcionado ao WhatsApp da unidade de Campos do Jordão.

## Execução Local
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Para gerar a build de produção:
   ```bash
   npm run build
   ```

## Deploy no Vercel
O projeto já inclui o `vercel.json` configurado com reescrita SPA (`rewrites`) e cache otimizado para assets e favicons.
Ao conectar o repositório no Vercel, o framework Vite será detectado automaticamente.
