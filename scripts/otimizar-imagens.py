"""Gera versões WebP das fotos e troca as referências no site.

Para cada foto em dist/assets (jpg, png ou webp), cria <nome>-1200.webp e
<nome>-640.webp. Depois reescreve as <img> das páginas com srcset e ajusta
as referências em style.css e site.js. Pode ser executado de novo sem problema.
Requer Pillow (pip install pillow). Uso: python3 scripts/otimizar-imagens.py
"""
import re
from pathlib import Path
from PIL import Image

DIST = Path(__file__).resolve().parent.parent / 'dist'
ASSETS = DIST / 'assets'
SKIP = {'marca-muni.png', 'muni-film-poster.jpg', 'pattern-unit.png', 'og-muni.jpg',
        'apple-touch-icon.png', 'favicon-32.png', 'icon-512.png'}
SIZES = (1200, 640)
SRC = re.compile(r'^(?!.*-(?:1200|640)\.webp$).+\.(?:jpe?g|png|webp)$', re.I)


def variants():
    done = {}
    for f in sorted(ASSETS.iterdir()):
        if f.name in SKIP or not SRC.match(f.name):
            continue
        stem = f.stem
        with Image.open(f) as im:
            im = im.convert('RGB')
            for w in SIZES:
                out = ASSETS / f'{stem}-{w}.webp'
                if not out.exists() or out.stat().st_mtime < f.stat().st_mtime:
                    scaled = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                    scaled.save(out, 'WEBP', quality=78, method=6)
        done[f.name] = stem
    return done


def rewrite(names):
    pat = '|'.join(re.escape(n) for n in names)
    img = re.compile(r'(<img\b[^>]*?\s)src="/assets/(' + pat + r')"')
    for page in DIST.rglob('*.html'):
        html = page.read_text(encoding='utf-8')
        html = img.sub(lambda m: (f'{m.group(1)}src="/assets/{names[m.group(2)]}-1200.webp" '
                                  f'srcset="/assets/{names[m.group(2)]}-640.webp 640w, /assets/{names[m.group(2)]}-1200.webp 1200w" '
                                  f'sizes="(max-width: 760px) 100vw, 50vw"'), html)
        page.write_text(html, encoding='utf-8')
    for name in ('style.css', 'site.js'):
        path = DIST / name
        text = path.read_text(encoding='utf-8')
        for original, stem in names.items():
            text = re.sub(r"(?<![\w-])" + re.escape(original) + r"(?![\w-])", f'{stem}-1200.webp', text)
        path.write_text(text, encoding='utf-8')


if __name__ == '__main__':
    names = variants()
    rewrite(names)
    print(f'{len(names)} fotos otimizadas')
