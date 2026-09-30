# Assets do site

Os assets originais do export do Espaço MUNI estão versionados em `dist/assets/`.

Arquivos:

- `encontro-muni.jpg`
- `higgsfield-movement.webp`
- `higgsfield-nutrition.webp`
- `higgsfield-objects.webp`
- `marca-muni.png`
- `movimento-muni.jpg`
- `muni-digital.jpg`
- `muni-film-poster.jpg`
- `muni-scroll-film.mp4`
- `nutricao-editorial.jpg`
- `pattern-unit.png`
- `portal-comecar.jpg`
- `portal-conectar.jpg`
- `portal-mover.jpg`
- `portal-nutrir.jpg`
- `ritual-muni.jpg`

A cópia atual foi recuperada diretamente da versão publicada em `https://espaco-muni.mateus-tavarescosta0.chatgpt.site` e commitada pelo workflow `Sync MUNI assets`.

Se algum arquivo precisar ser restaurado a partir da publicação atual, use:

```sh
bash scripts/download-assets.sh
```

O workflow `.github/workflows/sync-muni-assets.yml` também pode ser executado manualmente no GitHub Actions para refazer essa sincronização. Em edições normais, altere diretamente os arquivos em `dist/assets/`.
