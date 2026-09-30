#!/usr/bin/env bash
set -euo pipefail
BASE="https://espaco-muni.mateus-tavarescosta0.chatgpt.site/assets"
DEST="dist/assets"
mkdir -p "$DEST"
files=(
  "encontro-muni.jpg"
  "higgsfield-movement.webp"
  "higgsfield-nutrition.webp"
  "higgsfield-objects.webp"
  "marca-muni.png"
  "movimento-muni.jpg"
  "muni-digital.jpg"
  "muni-film-poster.jpg"
  "muni-scroll-film.mp4"
  "nutricao-editorial.jpg"
  "pattern-unit.png"
  "portal-comecar.jpg"
  "portal-conectar.jpg"
  "portal-mover.jpg"
  "portal-nutrir.jpg"
  "ritual-muni.jpg"
)
for file in "${files[@]}"; do
  echo "Baixando $file"
  curl -fL --retry 3 "$BASE/$file" -o "$DEST/$file"
done
echo "Assets baixados em $DEST"
