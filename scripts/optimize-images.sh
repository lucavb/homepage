#!/bin/bash

# Image optimization script using ImageMagick
# This script converts images to WebP and AVIF formats for better performance

echo "🖼️  Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick is not installed. Please install it first:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Find all images in public/assets
find public/assets -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    echo "📸 Processing: $img"
    
    # Get filename without extension
    base="${img%.*}"
    
    # Convert to WebP (90% quality for good balance)
    magick "$img" -quality 90 "${base}.webp"
    echo "   ✅ Created ${base}.webp"
    
    # Convert to AVIF (85% quality, more aggressive compression)
    magick "$img" -quality 85 "${base}.avif"
    echo "   ✅ Created ${base}.avif"
    
    # Create responsive sizes (400, 600, 800, 1024px width)
    for size in 400 600 800 1024; do
        # Only create if original is larger
        width=$(magick identify -format "%w" "$img")
        if [ "$width" -gt "$size" ]; then
            # WebP responsive
            magick "$img" -resize "${size}x${size}>" -quality 90 "${base}-${size}.webp"
            
            # AVIF responsive  
            magick "$img" -resize "${size}x${size}>" -quality 85 "${base}-${size}.avif"
            
            # Original format responsive
            ext="${img##*.}"
            magick "$img" -resize "${size}x${size}>" -quality 85 "${base}-${size}.${ext}"
            
            echo "   📏 Created ${size}px variants"
        fi
    done
    
    echo ""
done

echo "🎉 Image optimization complete!"
echo ""
echo "💡 Next steps:"
echo "1. Replace <img> tags with the OptimizedImage component"
echo "2. Update image paths to use the new responsive variants"
echo "3. Test your site to ensure images load correctly" 