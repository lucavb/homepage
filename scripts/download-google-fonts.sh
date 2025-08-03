#!/bin/bash

# Download optimized Google Fonts in WOFF2 format
# This replaces the current TTF files with much smaller, optimized versions

echo "📦 Downloading optimized Google Fonts..."

# Create optimized fonts directory
mkdir -p public/assets/fonts/optimized

# Google Fonts API URLs for WOFF2 format
# Using specific User-Agent to get WOFF2 files
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

echo "🔤 Downloading Inter fonts..."

# Inter Regular (400)
curl -A "$USER_AGENT" "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap" > temp_inter_400.css
INTER_400_URL=$(grep -o 'https://fonts.gstatic.com/s/inter/[^)]*' temp_inter_400.css | head -1)
curl -o public/assets/fonts/optimized/Inter-Regular.woff2 "$INTER_400_URL"

# Inter SemiBold (600)
curl -A "$USER_AGENT" "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap" > temp_inter_600.css
INTER_600_URL=$(grep -o 'https://fonts.gstatic.com/s/inter/[^)]*' temp_inter_600.css | head -1)
curl -o public/assets/fonts/optimized/Inter-SemiBold.woff2 "$INTER_600_URL"

echo "🎨 Downloading Outfit fonts..."

# Outfit SemiBold (600)
curl -A "$USER_AGENT" "https://fonts.googleapis.com/css2?family=Outfit:wght@600&display=swap" > temp_outfit_600.css
OUTFIT_600_URL=$(grep -o 'https://fonts.gstatic.com/s/outfit/[^)]*' temp_outfit_600.css | head -1)
curl -o public/assets/fonts/optimized/Outfit-SemiBold.woff2 "$OUTFIT_600_URL"

# Outfit Bold (700)
curl -A "$USER_AGENT" "https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap" > temp_outfit_700.css
OUTFIT_700_URL=$(grep -o 'https://fonts.gstatic.com/s/outfit/[^)]*' temp_outfit_700.css | head -1)
curl -o public/assets/fonts/optimized/Outfit-Bold.woff2 "$OUTFIT_700_URL"

# Clean up temporary files
rm temp_*.css

echo "✅ Font download complete!"
echo "📊 Comparing file sizes:"

echo "📈 OLD TTF fonts:"
du -sh public/assets/fonts/Inter/Inter-Regular.ttf public/assets/fonts/Inter/Inter-SemiBold.ttf
du -sh public/assets/fonts/Outfit/Outfit-SemiBold.ttf public/assets/fonts/Outfit/Outfit-Bold.ttf

echo "📉 NEW WOFF2 fonts:"
du -sh public/assets/fonts/optimized/*.woff2

echo "🎯 Next steps:"
echo "1. Update src/styles/fonts.css to use the new WOFF2 files"
echo "2. Update src/layouts/Layout.astro font preloads"
echo "3. Test the fonts are loading correctly" 