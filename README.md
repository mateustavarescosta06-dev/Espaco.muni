# Espaço MUNI

Código editável do site do Espaço MUNI — nutrição e treinamento em Jundiaí e online. A versão publicada atualmente está em:

https://espaco-muni.mateus-tavarescosta0.chatgpt.site

## Rodar localmente

Não há dependências nem etapa de compilação. Com Python 3 instalado:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Sirva sempre a pasta `dist` como raiz, pois as rotas internas começam com `/`.

## Estrutura

- `dist/index.html`: início, campanhas, filme interativo e caminhos de atendimento.
- `dist/nutricao/index.html`: nutrição.
- `dist/treinamento/index.html`: treinamento.
- `dist/universo/index.html`: universo da marca.
- `dist/contato/index.html`: seleção de interesse e canais de contato.
- `dist/style.css`: estilos e responsividade.
- `dist/site.js`: navegação, campanhas, galeria, contato e fundo interativo.
- `dist/film.js`: filme controlado pela rolagem e reprodução manual.
- `.openai/hosting.json`: configuração do projeto publicado no ChatGPT Sites.
- `CLAUDE.md`: orientações para Claude Code/Codex.

`dist` é o código-fonte editável deste projeto, apesar do nome.

## Assets

O pacote exportado do ChatGPT Sites contém os binários originais (imagens e vídeo), mas o conector usado para sincronizar este repositório não consegue anexar arquivos binários grandes. Por isso, esta versão do código referencia diretamente os assets da publicação atual em `chatgpt.site`.

Isso mantém o site visualmente funcional e deixa HTML/CSS/JS totalmente editáveis pelo Claude. Para baixar uma cópia local dos assets, rode:

```sh
bash scripts/download-assets.sh
```

Depois disso, se quiser tornar o repositório 100% autônomo, substitua as URLs absolutas por `/assets/...` e versione `dist/assets/`. Veja `ASSETS.md`.

## Editar pelo Claude Code ou Codex

Leia `CLAUDE.md` antes de editar. Trabalhe em uma branch, preserve a identidade MUNI e confira celular + desktop.

Sugestão de pedido:

> Leia CLAUDE.md, preserve a identidade da MUNI, execute o site e faça a alteração solicitada. Confira o comportamento em celular e computador antes de entregar.

## Identidade

Paleta principal: `#F1FFBB`, `#BAC976`, `#606060`, `#CFCFCF`, `#858077`, com fundo `#FAFBF5` e texto `#41443C`. Tipografia: DM Sans e Cormorant Garamond. Estética boutique, frases curtas, imagens grandes e bastante respiro.

## Publicação

O site atual no ChatGPT Sites **não fica sincronizado automaticamente com o GitHub**. Alterações neste repositório não mudam a URL publicada até que sejam publicadas novamente ou que se configure uma hospedagem ligada ao GitHub.

## Verificações rápidas

```sh
node --check dist/site.js
node --check dist/film.js
```

Confira também as cinco páginas, menu mobile, controles das campanhas e do vídeo, rolagem nos dois sentidos, imagens e `prefers-reduced-motion`.
