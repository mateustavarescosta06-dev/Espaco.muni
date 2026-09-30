# Espaço MUNI

Código completo e editável do site do Espaço MUNI — nutrição e treinamento em Jundiaí e online.

Site publicado atualmente: `https://espaco-muni.mateus-tavarescosta0.chatgpt.site`

## Rodar localmente

Não há dependências nem etapa de compilação. Com Python 3 instalado:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Sirva sempre a pasta `dist` como raiz, pois as rotas internas começam com `/`.

## Estrutura

- `dist/index.html`: início. Abertura com a assinatura MUNI animada, proposta de valor, pilares (Nutrir / Mover / Integrar), filme controlado pela rolagem, "Como funciona", manifesto, formatos (Jundiaí e online), paleta e galeria, escolha de caminho.
- `dist/nutricao/index.html` e `dist/treinamento/index.html`: abertura, cuidado na prática, imagens editoriais e convite para nutrição + treinamento.
- `dist/universo/index.html`: universo da marca, manifesto, galeria e paleta interativa.
- `dist/contato/index.html`: canais oficiais e seleção de interesse/formato. Aceita `?interesse=nutricao|treinamento|integrado` e `?formato=presencial|online`.
- `dist/style.css`: tokens da marca, componentes e regras responsivas compartilhados.
- `dist/site.js`: menu, cabeçalho, revelações na rolagem, assinatura interativa, pilares, manifesto, trilho de etapas, paleta, galerias, escolhas de contato, fundo vivo e o botão "Pausar animações".
- `dist/film.js`: controle do filme pela rolagem e reprodução manual.
- `dist/assets/`: logotipo, imagens e vídeo. Os arquivos estão incluídos no repositório.

`dist` é o código-fonte efetivo deste projeto, apesar do nome. O repositório inclui os assets originais exportados da versão publicada, inclusive `muni-scroll-film.mp4`.

## Editar pelo Claude Code ou Codex

Leia `CLAUDE.md` antes de editar. Trabalhe em uma branch, preserve a identidade MUNI e confira celular + desktop.

Sugestão de pedido:

> Leia CLAUDE.md, preserve a identidade da MUNI, execute o site e faça a alteração solicitada. Confira o comportamento em celular e computador antes de entregar.

## Identidade

Paleta principal: `#F1FFBB`, `#BAC976`, `#606060`, `#CFCFCF`, `#858077`, com fundo `#FAFBF5` e texto `#41443C`. Tipografia: DM Sans e Cormorant Garamond. Estética boutique, frases curtas, imagens grandes e bastante respiro.

## Assets

Os assets estão versionados em `dist/assets/`. O arquivo `scripts/download-assets.sh` e o workflow `.github/workflows/sync-muni-assets.yml` permitem recuperar novamente os arquivos da versão publicada se necessário. Consulte `ASSETS.md`.

## Publicação

O endereço atual do ChatGPT Sites **não fica sincronizado automaticamente com o GitHub**. Alterações neste repositório não mudam a URL publicada até que sejam publicadas novamente no Sites ou que se configure uma hospedagem ligada ao GitHub servindo a pasta `dist`.

## Verificações rápidas

```sh
node --check dist/site.js
node --check dist/film.js
```

Confira também as cinco páginas, menu mobile, controles das campanhas e do vídeo, rolagem nos dois sentidos, imagens e `prefers-reduced-motion`.
