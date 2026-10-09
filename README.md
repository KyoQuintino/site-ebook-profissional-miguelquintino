# site E-book profissional - miguelquintino

Landing page profissional da coleção de e-books **DigitalQuintino — Leituras para viver melhor**.

## Incluído

- Landing page editorial responsiva para desktop e celular.
- Coleção com os e-books DigitalQuintino.
- Catálogo responsivo com 24 e-books, busca, filtros por categoria e visualização rápida.
- Capas originais em WebP servidas como arquivos locais, sem dependência do storage do WebDev.
- CTAs de compra Hotmart e atendimento pelo WhatsApp, além do botão flutuante.
- Captura de contatos conectada à integração Make já configurada no projeto.
- Rastreamento de page view e cliques comerciais por `dataLayer`, Google Analytics/gtag e Plausible quando configurados.
- Rotas preparadas para o subdiretório do GitHub Pages e fallback SPA em `404.html`.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS 4
- Lucide React
- pnpm

## Desenvolvimento local

```bash
pnpm install
pnpm run dev
```

## Build de produção

```bash
pnpm run build
```

## Estrutura principal

- `client/index.html` — entrada HTML, fontes e scripts de tracking.
- `client/src/pages/Home.tsx` — página, catálogo e interações da coleção.
- `client/src/lib/catalog.ts` — dados, capas e links de compra dos 24 e-books.
- `client/public/assets/*.webp` — capas originais fornecidas no pacote.
- `client/public/conversion-tracking.js` — eventos de conversão.
- `client/public/lead-capture.js` — envio de contatos pela integração existente.
- `.github/workflows/deploy-pages.yml` — build e publicação no GitHub Pages.

## Assets

As 24 capas do pacote estão versionadas em `client/public/assets/`. O caminho dos assets é configurado com `import.meta.env.BASE_URL`, para funcionar tanto localmente quanto no subdiretório do GitHub Pages.

## Observação

Antes de comercializar ou redistribuir qualquer e-book, confirme que você possui os direitos, licenças e autorizações necessários para os materiais e imagens utilizados.
