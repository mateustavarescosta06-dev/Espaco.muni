# Espaço MUNI

Site do Espaço MUNI — nutrição e treinamento em Jundiaí e online. Esta versão inclui o filme vertical de 12 segundos controlado pela rolagem.

## Rodar localmente

Não há dependências nem etapa de compilação. Com Python 3 instalado:

```sh
python3 -m http.server 8000 --directory dist
```

Abra http://localhost:8000. Sirva sempre a pasta `dist` como raiz, pois os links de páginas e arquivos começam com `/`.

## Arquivos e páginas

- `dist/index.html`: início, campanhas, filme interativo e caminhos de atendimento.
- `dist/nutricao/index.html`: nutrição.
- `dist/treinamento/index.html`: treinamento.
- `dist/universo/index.html`: universo da marca.
- `dist/contato/index.html`: seleção de interesse e canais de contato.
- `dist/style.css`: estilos e regras responsivas compartilhados.
- `dist/site.js`: navegação, campanhas, galeria, escolhas de contato e fundo interativo.
- `dist/film.js`: controle do filme pela rolagem e reprodução manual.
- `dist/assets/`: logotipo, imagens e vídeo. Os arquivos estão incluídos no repositório.

`dist` é o código-fonte editável deste projeto, apesar do nome. Não apague essa pasta como se fosse um resultado descartável de build.

## Editar pelo Claude Code ou Codex

Conecte este repositório à ferramenta e peça alterações em uma branch. Consulte `CLAUDE.md` antes de editar. Revise e incorpore as mudanças na `main` pelo GitHub. Comece sempre a partir da versão mais recente para evitar sobrescrever o trabalho feito na outra ferramenta.

Sugestão de pedido: “Leia CLAUDE.md e preserve a identidade da MUNI. Execute o site, faça a alteração solicitada e confira o comportamento em celular e computador.”

## Identidade

Paleta: `#F1FFBB`, `#BAC976`, `#606060`, `#CFCFCF`, `#858077`, com fundo `#FAFBF5` e texto `#41443C`. Tipografia: DM Sans e Cormorant Garamond, carregadas pelo Google Fonts. Estética boutique, frases curtas, imagens grandes e espaço para leitura.

## Publicação

Site atual: https://espaco-muni.mateus-tavarescosta0.chatgpt.site

O acesso ao site segue a configuração da hospedagem. Este repositório é uma cópia completa da versão publicada em 30/09/2026, incluindo o filme. A publicação existente no Sites **não está sincronizada automaticamente com o GitHub**. Alterações neste repositório precisam ser levadas ao Sites e publicadas, ou é necessário configurar uma hospedagem vinculada ao GitHub que sirva `dist` na raiz. A configuração existente está em `.openai/hosting.json`; não contém credenciais.

Não há backend, formulário de envio, agenda ou integração de pagamento. As escolhas da página de contato não são enviadas automaticamente: os botões levam aos canais oficiais da MUNI.

## Verificações rápidas

```sh
node --check dist/site.js
node --check dist/film.js
```

Confira também links das cinco páginas, menu mobile, controles das campanhas e do vídeo, rolagem em ambos os sentidos, imagens e preferência de movimento reduzido.
