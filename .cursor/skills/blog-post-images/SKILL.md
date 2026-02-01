---
name: blog-post-images
description: Process and optimize images for blog posts using ImageMagick, and add them to posts with proper components. Use when adding images, screenshots, or hero images to blog posts, or when processing image files for the blog.
---

# Blog Post Image Processing

Process and optimize images for blog posts with ImageMagick, then add them using the appropriate Astro components.

## When to Use

Apply this skill when:

- Adding hero images to blog posts
- Adding screenshots or UI images to posts
- Processing images for blog content
- Optimizing existing images

## Image Component Selection

**CRITICAL**: Choose the right component for the image type:

| Component            | Use For                           | Interactive            |
| -------------------- | --------------------------------- | ---------------------- |
| `AutoOptimizedImage` | Hero images only                  | No                     |
| `ImageLightbox`      | Screenshots, UI details, diagrams | Yes (click to enlarge) |

**ImageLightbox is STRONGLY PREFERRED** for screenshots and UI images. Users need to click and examine details closely.

### When to Use Each Component

**AutoOptimizedImage** - ONLY for hero images:

- Full-width display at top of post
- No user interaction needed
- Sets the visual tone for the article

**ImageLightbox** - For everything else (PREFERRED):

- Screenshots showing UI, code, or terminal output
- Diagrams that need examination
- Images with text or details users need to read
- Any image where users might want to zoom in

## Image Processing Workflow

### Step 1: Convert to JPEG

Use ImageMagick to convert PNG to optimized JPEG (85% quality):

```bash
magick input.png -quality 85 output.jpg
```

**Why this matters**:

- Reduces file size significantly
- 85% quality balances size vs visual quality
- Astro handles further optimization automatically

### Step 2: Create Image Directory

For new posts, create the image directory:

```bash
mkdir -p src/assets/images/blog/[slug]/
```

### Step 3: Move Image to Directory

Move the processed image:

```bash
mv output.jpg src/assets/images/blog/[slug]/filename.jpg
```

Use descriptive filenames:

- `hero.jpg` - for hero images
- `workflow-screenshot.jpg` - descriptive names for other images
- `dashboard-before.jpg`, `dashboard-after.jpg` - for comparison shots

### Step 4: Add Import Statement

Add to the MDX file's import section:

```mdx
import ImageLightbox from '../../components/general/ImageLightbox.astro';
import screenshotImage from '../../assets/images/blog/[slug]/filename.jpg';
```

**Import both components if needed**:

- `AutoOptimizedImage` - if adding hero image
- `ImageLightbox` - if adding screenshots (most common)

### Step 5: Add to Post

**For hero images** (top of post only):

```mdx
<AutoOptimizedImage src={heroImage} alt="Descriptive alt text for accessibility and SEO" loading="eager" />
```

**For screenshots and UI images** (PREFERRED):

```mdx
<ImageLightbox src={screenshotImage} alt="Descriptive alt text explaining what the screenshot shows" />
```

Note: ImageLightbox doesn't need `loading` prop.

### Step 6: Format with Prettier

Always format the MDX file after adding images:

```bash
npx prettier --write src/content/blog/[slug].mdx
```

### Step 7: Clean Up

Delete original files if still present:

```bash
rm input.png  # if original PNG still exists
```

## Alt Text Guidelines

Write descriptive alt text that:

- Explains what the image shows
- Includes relevant keywords naturally
- Helps users understand context
- Supports both accessibility and SEO

**Examples**:

- ✅ "Cursor interface showing the agent learning git-branch-conventions and git-commit-conventions skills"
- ✅ "Dashboard displaying solar panel energy production and crypto mining metrics"
- ❌ "Screenshot" (too vague)
- ❌ "Image showing the thing" (not descriptive)

## Complete Workflow Example

```bash
# 1. Convert PNG to JPEG (85% quality)
magick screenshot.png -quality 85 workflow-screenshot.jpg

# 2. Ensure directory exists
mkdir -p src/assets/images/blog/agent-skills-teaching-ai-coding-assistant/

# 3. Move processed image
mv workflow-screenshot.jpg src/assets/images/blog/agent-skills-teaching-ai-coding-assistant/

# 4. Add to MDX file (use StrReplace tool):
#    - Add import: ImageLightbox component and image
#    - Add component usage in appropriate location

# 5. Format with Prettier
npx prettier --write src/content/blog/agent-skills-teaching-ai-coding-assistant.mdx

# 6. Clean up
rm screenshot.png
```

## Important Notes

**Astro handles optimization automatically**:

- Generates responsive sizes (400px, 600px, 800px, 1024px)
- Converts to modern formats (AVIF, WebP, JPG)
- Creates responsive srcsets

**Never manually create multiple image sizes** - ImageMagick preprocessing + Astro optimization is the complete pipeline.

## Troubleshooting

**ImageMagick not found**:

- Check installation: `magick --version`
- Install if needed: `brew install imagemagick` (macOS)

**Image not displaying**:

- Verify file exists at expected path
- Check import path matches actual file location
- Ensure slug in path matches post slug
- Run Astro dev server to see build errors

**Wrong component used**:

- Hero images → `AutoOptimizedImage` with `loading="eager"`
- Everything else → `ImageLightbox` (no loading prop needed)

## Quick Reference

| Task                | Command                                            |
| ------------------- | -------------------------------------------------- |
| Convert PNG to JPEG | `magick input.png -quality 85 output.jpg`          |
| Create directory    | `mkdir -p src/assets/images/blog/[slug]/`          |
| Move image          | `mv output.jpg src/assets/images/blog/[slug]/`     |
| Format MDX          | `npx prettier --write src/content/blog/[slug].mdx` |
