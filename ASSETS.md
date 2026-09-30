# Assets do site

Os assets originais do export do Espaço MUNI estão versionados em `dist/assets/`.

Arquivos:

- `encontro-muni.jpg`
- `equipe-muni.jpg` (Bia e Bruno em frente à parede da MUNI, 1122×1402)
- `encontro-muni-recorte.jpg` (recorte sem os selos de carrossel da foto original; é o usado no site)
- `higgsfield-movement.webp`
- `higgsfield-nutrition.webp`
- `higgsfield-objects.webp`
- `marca-muni.png`
- `movimento-muni.jpg`
- `muni-digital.jpg` (substituída em 30/09/2026 por versão em alta, 1122×1402)
- `muni-film-poster.jpg`
- `muni-scroll-film.mp4`
- `nutricao-editorial.jpg`
- `pattern-unit.png`
- `padrao-muni.svg` (padrão vetorial MU/NI usado nos fundos, aplicado como máscara e recolorido em CSS)
- `portal-comecar.jpg`
- `portal-conectar.jpg`
- `portal-mover.jpg`
- `portal-nutrir.jpg`
- `ritual-muni.jpg` (substituída em 30/09/2026 por versão em alta, 1122×1402)

A cópia atual foi recuperada diretamente da versão publicada em `https://espaco-muni.mateus-tavarescosta0.chatgpt.site` e commitada pelo workflow `Sync MUNI assets`.

Se algum arquivo precisar ser restaurado a partir da publicação atual, use:

```sh
bash scripts/download-assets.sh
```

O workflow `.github/workflows/sync-muni-assets.yml` também pode ser executado manualmente no GitHub Actions para refazer essa sincronização. Em edições normais, altere diretamente os arquivos em `dist/assets/`.

## Filme

A cópia do `muni-scroll-film.mp4` recuperada da publicação estava truncada (3 MB exatos, sem o índice `moov`) e não tocava. Em 30/09/2026 o arquivo foi substituído a partir do vídeo original de 12 segundos, recomprimido para web (H.264, 720×1280, sem áudio, `faststart`, cerca de 3,4 MB). O `muni-film-poster.jpg` foi regenerado a partir do quadro de 1s, onde a abertura começa.

Atenção: rodar `scripts/download-assets.sh` ou o workflow de sincronização baixa de novo os arquivos publicados. Isso pode trazer de volta a cópia truncada do vídeo e substituir `muni-digital.jpg` e `ritual-muni.jpg` pelas versões antigas, de menor resolução.
