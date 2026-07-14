#!/usr/bin/env bash

# Deterministically rebuild the social-preview PNG from the real hero portrait.
# Run from anywhere: ./scripts/generate-og-image.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSET_DIR="$ROOT_DIR/public/assets/images"
HERO_IMAGE="$ASSET_DIR/hero/800.jpg"
SOURCE_SVG="$ASSET_DIR/og-image.svg"
PORTRAIT_FRAME="$ASSET_DIR/og-portrait.png"
OUTPUT_PNG="$ASSET_DIR/og-image.png"

if ! command -v magick >/dev/null 2>&1; then
    echo "ImageMagick is required. Install it with: brew install imagemagick" >&2
    exit 1
fi

if [[ ! -f "$HERO_IMAGE" || ! -f "$SOURCE_SVG" ]]; then
    echo "Missing hero portrait or OG SVG source." >&2
    exit 1
fi

# The portrait is an arched 400×445 crop, centered at x=760 / y=75 in the
# 1200×630 composition. Keep these values aligned with the SVG layout.
magick "$HERO_IMAGE" \
    -resize '400x445^' \
    -gravity north \
    -extent 400x445 \
    \( -size 400x445 xc:none -fill white -draw 'circle 200,200 200,0 rectangle 0,200 400,445' \) \
    -alpha off \
    -compose CopyOpacity \
    -composite \
    "$PORTRAIT_FRAME"

python3 - "$SOURCE_SVG" "$PORTRAIT_FRAME" <<'PYTHON'
import base64
import pathlib
import re
import sys

svg_path = pathlib.Path(sys.argv[1])
portrait_path = pathlib.Path(sys.argv[2])
embedded_portrait = base64.b64encode(portrait_path.read_bytes()).decode()
svg = svg_path.read_text()

svg = re.sub(
    r'  <image href="data:image/[^\\n]*\\n',
    (
        '  <image href="data:image/png;base64,'
        + embedded_portrait
        + '" x="760" y="75" width="400" height="445" preserveAspectRatio="none"/>\\n'
    ),
    svg,
    count=1,
)

svg_path.write_text(svg)
PYTHON

magick "$SOURCE_SVG" -background none -resize '1200x630!' -strip -quality 92 "$OUTPUT_PNG"

echo "Generated $OUTPUT_PNG"
