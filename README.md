# site E-book profissional - miguelquintino

Landing page profissional da coleção de e-books **DigitalQuintino — Leituras para viver melhor**.

## Incluído

- Landing page editorial responsiva para desktop e celular.
- Coleção com os e-books DigitalQuintino.
- Integração dos dois e-books selecionados no GitHub:
  - **As 7 Leis Espirituais do Sucesso** — checkout Hotmart `T107544097M`.
  - **Quebrando o Hábito de Ser Você Mesmo** — checkout Hotmart `U107546962B`.
- E-book **Sai do Caixão** — checkout Hotmart `S107541237F`.
- CTAs de compra e atendimento pelo WhatsApp.
- Botão flutuante do WhatsApp.
- Rastreamento de page view, cliques em Hotmart, WhatsApp e CTAs por `dataLayer`, Google Analytics/gtag e Plausible quando configurados.
- Layout mobile refinado com safe-area para dispositivos com notch.

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
- `client/public/original-app.js` — bundle da experiência da landing page.
- `client/public/original-style.css` — estilos editoriais da página.
- `client/public/mobile-conversion-enhancements.css` — responsividade e WhatsApp flutuante.
- `client/public/conversion-tracking.js` — eventos de conversão.
- `client/public/*-cover.svg` — capas editoriais locais dos novos e-books.

## Assets

As imagens da coleção original são servidas pelos caminhos de storage do WebDev usados pelo projeto publicado. Em uma nova implantação, substitua esses caminhos por assets próprios ou faça upload dos arquivos para o storage da plataforma escolhida.

## Observação

Antes de comercializar ou redistribuir qualquer e-book, confirme que você possui os direitos, licenças e autorizações necessários para os materiais e imagens utilizados.
