# Orientações para editar a MUNI

## Estrutura

Este é um site estático em HTML, CSS e JavaScript puro. `dist/` contém o código-fonte efetivo e todos os assets usados pelo site. Não há build nem dependências npm. Não migre para React, Next ou outro framework sem pedido explícito. Veja `README.md` para executar localmente e conhecer as páginas.

## Direção visual aprovada

- Boutique de saúde: nutrição + treinamento, presencial em Jundiaí e online.
- Paleta e tipografia já definidas nas variáveis de `dist/style.css`.
- Priorize frases curtas, fotografia editorial, textura e espaços de respiro.
- Use o logotipo real de `dist/assets/marca-muni.png`. Não substitua a marca por um ícone genérico.
- Estética: wellness premium + editorial de moda + movimento + comida. Títulos em Cormorant Garamond com itálico de destaque; textos e rótulos em DM Sans; botões retos em caixa alta com espaçamento; cantos retos; tom pedra (#858077) nos botões principais.
- Abertura da home: o filme fica fixo ao fundo ao longo de três telas de rolagem, tocando sozinho em loop (sem som). As informações entram em caixas claras que rolam por cima (Mover, Nutrir, Integrar), alternando lados no desktop para não cobrir o assunto. No desktop, o enquadramento acompanha o assunto do vídeo vertical (panorâmica em `film.js`); no celular, o vídeo ocupa a tela inteira.
- Fundos: o padrão da marca (`assets/padrao-muni.svg`, MU/NI + "ESPAÇO INTEGRADO DE SAÚDE") preenche seções via `.pattern-bg`, recolorido por `--pattern-color` e `--pattern-opacity`, em deriva lenta.
- Cores da marca aparecem em movimento (`.color-flow`), nunca como paleta exposta com códigos.
- Lanterna (`[data-spotlight]` + `.spot-layer`): o cursor acende o padrão MU/NI no fundo; no celular a luz passeia sozinha. Usada em "Como funciona" (faixa escura, traço ondulado, etapa em foco e contador) e em "Perto. Mesmo de longe." (cartões que inclinam com o cursor, `[data-tilt]`).
- Não sobreponha vários blocos de texto ou logos sobre o assunto principal do filme.

## Interações

`site.js` controla menu, cabeçalho, revelações na rolagem, lanterna, cartões inclináveis, etapas do "Como funciona", galerias, lista de caminhos (foto que acompanha o cursor), escolhas de contato e o botão "Pausar animações" (preferência guardada no navegador, avisada ao filme pelo evento `muni:motion`). `film.js` toca o filme de 12 segundos em loop quando visível, com enquadramento por tempo (`framing`) e capítulos. Preserve o botão de pausar, pular filme, poster, pausa fora da tela e suporte a `prefers-reduced-motion` (sem autoplay).

Não capture a roda do mouse nem bloqueie o gesto de rolar. Preserve navegação por teclado, foco visível, textos alternativos e `playsinline`/`muted` do vídeo. Evite aumentar muito o arquivo de vídeo; a versão atual tem aproximadamente 3,4 MB (H.264, 720×1280, sem áudio).

## Assets

Os arquivos visuais originais estão em `dist/assets/`, inclusive o vídeo `muni-scroll-film.mp4`. `scripts/download-assets.sh` e `.github/workflows/sync-muni-assets.yml` existem apenas como mecanismos de recuperação/sincronização com a versão publicada; para edições normais, trabalhe diretamente nos arquivos locais do repositório.

## Conteúdo e publicação

Não invente nomes de profissionais, registros, preços, resultados, depoimentos ou serviços. Fatos confirmados pela MUNI (posts oficiais e o próprio cliente): Bia cuida da nutrição e Bruno do treino (use só os primeiros nomes); treino personalizado no app, com acompanhamento e ajustes; avaliação física completa (adipometria, circunferências, bioimpedância, avaliação postural) só no presencial. Endereço: Rua do Retiro, 424, Sala 114, Vila Virgínia, Jundiaí – SP. Atendimento seg a sex 8h–20h e sáb 8h–14h; agendamento e confirmação de consultas seg a sex 8h–18h.

Narrativa central: emagrecer com saúde não é só comer menos nem treinar mais. Na nutrição, déficit calórico com saciedade e adesão (o melhor plano é o que você consegue seguir sem ser um fardo). No treino, não é só queimar caloria: preservar massa muscular e perder peso com qualidade. Escolhas que você consegue manter. As imagens editoriais e o filme gerados são peças de campanha, não registros documentais de pacientes ou do espaço físico. Os contatos atuais vêm do Instagram `@espaco.muni` e de `https://linktr.ee/espaco.muni`.

O GitHub não publica automaticamente no endereço atual do ChatGPT Sites. Preserve `.openai/hosting.json` e explique essa separação se a tarefa envolver publicação. Nunca inclua tokens, arquivos `.env` reais ou credenciais no repositório.

Antes de editar, atualize a branch a partir da versão mais recente. Prefira mudanças focadas em uma branch e um pull request; não faça force push na `main` nem sobrescreva alterações feitas por outra ferramenta.

## Antes de entregar

Execute `node --check dist/site.js` e `node --check dist/film.js`. Confira as páginas e assets afetados. Para mudanças de layout, confira desktop e celular, principalmente a separação da abertura e os controles do filme. Informe o que foi alterado e o que foi efetivamente verificado.
