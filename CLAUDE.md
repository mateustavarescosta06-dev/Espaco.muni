# Orientações para editar a MUNI

## Estrutura

Este é um site estático em HTML, CSS e JavaScript puro. `dist/` contém o código-fonte efetivo e todos os assets usados pelo site. Não há build nem dependências npm. Não migre para React, Next ou outro framework sem pedido explícito. Veja `README.md` para executar localmente e conhecer as páginas.

## Direção visual aprovada

- Boutique de saúde: nutrição + treinamento, presencial em Jundiaí e online.
- Paleta e tipografia já definidas nas variáveis de `dist/style.css`.
- Priorize frases curtas, fotografia editorial, textura e espaços de respiro.
- Use o logotipo real de `dist/assets/marca-muni.png`. Não substitua a marca por um ícone genérico.
- Estética: wellness premium + editorial de moda + movimento + comida. Títulos em Cormorant Garamond com itálico de destaque; textos e rótulos em DM Sans; botões retos em caixa alta com espaçamento; cantos retos; tom pedra (#858077) nos botões principais.
- Abertura da home: o filme fica fixo ao fundo ao longo de três telas de rolagem e avança com ela. As informações entram em caixas claras que rolam por cima (Mover, Nutrir, Integrar), alternando lados no desktop para não cobrir o assunto. No desktop, o enquadramento acompanha o assunto do vídeo vertical (panorâmica em `film.js`); no celular, o vídeo ocupa a tela inteira.
- Não sobreponha vários blocos de texto ou logos sobre o assunto principal do filme.

## Interações

`site.js` controla menu, cabeçalho, revelações na rolagem, manifesto, trilho de etapas, paleta, galerias, escolhas de contato, fundo com marca repetida e o botão "Pausar animações" (preferência guardada no navegador). `film.js` controla o filme de 12 segundos com a rolagem normal do documento: mapa rolagem→tempo por capítulo (`stops`), enquadramento por tempo (`framing`) e leve inércia. Preserve avanço e retorno, reprodução manual, pular filme, poster e suporte a `prefers-reduced-motion`.

Não capture a roda do mouse nem bloqueie o gesto de rolar. Preserve navegação por teclado, foco visível, textos alternativos e `playsinline`/`muted` do vídeo. Evite aumentar muito o arquivo de vídeo; a versão atual tem aproximadamente 3,3 MB (H.264, 720×1280, keyframe a cada 8 quadros para a rolagem responder bem).

## Assets

Os arquivos visuais originais estão em `dist/assets/`, inclusive o vídeo `muni-scroll-film.mp4`. `scripts/download-assets.sh` e `.github/workflows/sync-muni-assets.yml` existem apenas como mecanismos de recuperação/sincronização com a versão publicada; para edições normais, trabalhe diretamente nos arquivos locais do repositório.

## Conteúdo e publicação

Não invente nomes de profissionais, registros, preços, resultados, depoimentos ou serviços. As imagens editoriais e o filme gerados são peças de campanha, não registros documentais de pacientes ou do espaço físico. Os contatos atuais vêm do Instagram `@espaco.muni` e de `https://linktr.ee/espaco.muni`.

O GitHub não publica automaticamente no endereço atual do ChatGPT Sites. Preserve `.openai/hosting.json` e explique essa separação se a tarefa envolver publicação. Nunca inclua tokens, arquivos `.env` reais ou credenciais no repositório.

Antes de editar, atualize a branch a partir da versão mais recente. Prefira mudanças focadas em uma branch e um pull request; não faça force push na `main` nem sobrescreva alterações feitas por outra ferramenta.

## Antes de entregar

Execute `node --check dist/site.js` e `node --check dist/film.js`. Confira as páginas e assets afetados. Para mudanças de layout, confira desktop e celular, principalmente a separação da abertura e os controles do filme. Informe o que foi alterado e o que foi efetivamente verificado.
