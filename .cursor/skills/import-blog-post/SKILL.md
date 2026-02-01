---
name: import-blog-post
description: Import blog posts into the site with slug generation, frontmatter setup, image processing via ImageMagick, and MDX structure. Supports both importing finished text and collaborative writing workflows. Use when the user wants to import a blog post, add an article, publish content, or mentions blog posts or MDX files.
---

# Import Blog Post

## Quick Start

Determine the workflow path:

1. **Have finished/near-finished text to import?** → Follow **Import Workflow** (Phases 1-7)
2. **Want to write/refine content first?** → Follow **Writing Workflow**, then Import

Most commonly, the user arrives with finished text and needs technical setup.

## Import Workflow (Primary)

### Phase 1: Slug Generation

**User behavior**: Always provides a simple/dummy filename (e.g., `cursor-new-features.mdx`)

**Your task**:
1. Read the blog post title from the content
2. Generate a proper slug from the title:
   - Example: "Cursor 6 Months Later: From Tool to Thinking Partner" → `cursor-from-tool-to-thinking-partner.mdx`
   - Capture main concepts from the title
   - Remove special characters (colons, quotes, etc.)
   - Use hyphens between words
   - Keep it concise but descriptive
3. Create the MDX file in `src/content/blog/[slug].mdx`

**Examples**:
- "Agent Hooks: Amazon's Take on Reactive Development" → `agent-hooks-reactive-development.mdx`
- "Mining Ethereum Classic with Sunshine" → `solar-powered-crypto-mining-etc-surplus-energy.mdx`

### Phase 2: Frontmatter Setup

Create complete frontmatter with all required fields:

```yaml
---
title: 'SEO-optimized title (under 60 chars)'
description: 'Meta description (120-160 chars with keywords)'
publishDate: 2026-02-01
tags: ['tag1', 'tag2', 'tag3']
heroImagePath: 'slug/hero.jpg'
draft: false
---
```

**SEO Considerations**:

- **Title**: Under 60 characters, include primary keywords naturally, make it compelling
- **Description**: 120-160 characters, include keywords, write compelling copy that encourages clicks
- **Tags**: 3-7 relevant tags, maintain consistency with existing posts in `src/content/blog/`
- **PublishDate**: Use YYYY-MM-DD format, typically today's date for new posts
- **heroImagePath**: Always `slug/hero.jpg` (relative to `src/assets/images/blog/`)
- **draft**: Set to `false` for immediate publication, `true` for work-in-progress

### Phase 3: Component Imports

Add standard imports after frontmatter (adjust `../../` based on file depth):

```mdx
import AutoOptimizedImage from '../../components/general/AutoOptimizedImage.astro';
import ImageLightbox from '../../components/general/ImageLightbox.astro';
import heroImage from '../../assets/images/blog/slug/hero.jpg';
```

**Decision logic**:
- **Always import**: `AutoOptimizedImage` (for hero image)
- **Conditionally import**: `ImageLightbox` (only if post includes screenshots or zoomable images)
- **Optional imports**: `MermaidDiagram` for diagrams, other components as needed

### Phase 4: Image Processing Workflow

**CRITICAL**: Use ImageMagick for preprocessing, let Astro handle optimization.

**Step-by-step**:

1. **Convert PNG to JPEG** using ImageMagick (85% quality):
   ```bash
   magick input.png -quality 85 hero.jpg
   ```

2. **Create image directory** for the post:
   ```bash
   mkdir -p src/assets/images/blog/[slug]/
   ```

3. **Move processed image** into the directory:
   ```bash
   mv hero.jpg src/assets/images/blog/[slug]/
   ```

4. **Astro handles the rest automatically**:
   - Generates responsive sizes: 400px, 600px, 800px, 1024px
   - Converts to modern formats: AVIF, WebP, JPG
   - Creates responsive srcsets for optimal loading

**IMPORTANT**: Never manually create multiple image sizes. Astro's image optimization does this automatically.

**Component selection**:
- `<AutoOptimizedImage>` - **ONLY for hero images** (full-width display, no interaction)
- `<ImageLightbox>` - **For screenshots and UI details** (click-to-enlarge overlay for examining details)

### Phase 5: Hero Image Placement

Add immediately after imports and frontmatter:

```mdx
<AutoOptimizedImage
    src={heroImage}
    alt="Descriptive alt text for accessibility and SEO"
    loading="eager"
/>
```

**Alt text guidelines**:
- Describe what the image shows
- Include relevant keywords naturally
- Keep it concise but descriptive
- Consider both accessibility and SEO

### Phase 6: Content Structure

**Writing style** (see Writing Workflow section for detailed style guide):
- First person for personal experiences
- Conversational and approachable tone
- Include specific details and concrete examples
- Avoid AI slop phrases (see style guide)

**Structure**:
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- Include code examples with proper syntax highlighting
- Add internal links to related posts using relative URLs: `/blog/post-slug/`
- Never use absolute URLs like `https://luca-becker.me`

**Additional images** (if needed):

```mdx
import screenshotImage from '../../assets/images/blog/slug/screenshot.jpg';

<ImageLightbox
    src={screenshotImage}
    alt="Descriptive alt text explaining what the screenshot shows"
/>
```

Process additional images the same way as hero images (ImageMagick conversion, place in slug directory).

### Phase 7: Pre-Publication Checklist

Before marking `draft: false`, verify:

**File Structure**:
- [ ] Slug properly generated from title (not the dummy filename)
- [ ] MDX file created in `src/content/blog/[slug].mdx`
- [ ] Image directory created: `src/assets/images/blog/[slug]/`

**Frontmatter**:
- [ ] All required fields complete
- [ ] Title under 60 characters
- [ ] Description 120-160 characters with keywords
- [ ] 3-7 relevant tags selected
- [ ] heroImagePath matches slug: `slug/hero.jpg`
- [ ] publishDate in YYYY-MM-DD format

**Images**:
- [ ] Hero image processed via ImageMagick (PNG → JPEG at 85% quality)
- [ ] Hero image placed in correct directory
- [ ] Component imports use correct slug in paths
- [ ] Hero image displays with AutoOptimizedImage
- [ ] Screenshots (if any) use ImageLightbox component
- [ ] All images have descriptive alt text

**Content**:
- [ ] Internal links use relative URLs (no https://luca-becker.me)
- [ ] Code examples tested and properly formatted
- [ ] Proper heading hierarchy (H2, H3 - never skip levels)
- [ ] Writing style follows voice guidelines (if refined collaboratively)

## Writing/Refinement Workflow (Optional)

Use this workflow when the user wants to collaboratively write or refine content before importing.

### Writing Style Reference

**Primary reference**: `src/content/blog/solar-powered-crypto-mining-etc-surplus-energy.mdx`

This post exemplifies the user's preferred voice - refined to avoid AI slop phrases.

### Voice Characteristics

**Use these patterns**:

- **Personal and specific**: "This past week has been unusually sunny in Munich for January"
- **Conversational**: "After the fifth day or so... I finally decided to do something about it"
- **Honest about motivations**: "I know this won't make me rich... but I don't care"
- **Self-aware humor**: "Why This Actually Makes Sense (Sort Of)", "Like a kid watching numbers go up"
- **Genuine enthusiasm**: "I genuinely enjoy looking at dashboards" (without hype)
- **Concrete details**: Tool names, version numbers, exact numbers ("€0.31 EUR per kWh", "RTX 3060", "Rigel v1.23.1")
- **Real problems**: "It segfaulted immediately"

**AVOID these AI slop indicators**:

- Corporate buzzwords: "leverage", "streamline", "cutting-edge", "robust", "ecosystem"
- Vague superlatives: "incredible", "amazing", "game-changing", "revolutionary"
- Generic phrases: "best practices", "industry standard", "state-of-the-art", "seamless integration"
- Overly formal language: "utilize" instead of "use", "commence" instead of "start"
- Marketing speak: Empty enthusiasm without specifics
- Hedge words: "quite", "rather", "fairly" (unless natural to conversation)

### Collaborative Writing Approach

When helping with content:

1. **Focus on specifics**: Ask for concrete details, numbers, tools, versions
2. **Encourage honesty**: What actually happened? What failed? What was surprising?
3. **Natural language**: Write how the user would speak, not how marketing copy sounds
4. **Personal experience**: Include first-person observations and reactions
5. **Real structure**: Straightforward section headers, not clickbait or formula
6. **Show the work**: Include problems encountered and solutions found

### After Writing is Complete

Once content is refined and ready:
1. Proceed to **Import Workflow** starting at Phase 1 (Slug Generation)
2. All technical setup steps remain identical
3. The writing workflow doesn't change the import mechanics

## Reference Examples

**Pattern matching**: Check existing posts in `src/content/blog/` for:
- Frontmatter structure
- Component usage
- Tag conventions
- Internal linking patterns

**Key posts for reference**:
- `src/content/blog/solar-powered-crypto-mining-etc-surplus-energy.mdx` - Writing style
- `src/content/blog/cursor-from-tool-to-thinking-partner.mdx` - Structure example
- Other 26 posts in directory for tag and pattern consistency

**TypeScript interfaces**: See `src/types/index.ts` for `IBlogPost` interface definition.

## Troubleshooting

**Image processing fails**:
- Ensure ImageMagick is installed: `magick --version`
- Check input file exists and is readable
- Verify output directory exists before moving files

**Slug conflicts**:
- Check `src/content/blog/` for existing similar slugs
- Add distinguishing words if needed
- Keep slugs descriptive but concise

**Import paths wrong**:
- All blog posts are at `src/content/blog/[slug].mdx`
- Use `../../` to go up from blog post to src root
- Verify paths match actual file locations

**Images not displaying**:
- Verify image exists at `src/assets/images/blog/[slug]/hero.jpg`
- Check import path matches slug
- Ensure hero image import comes before usage
- Run Astro dev server to see build errors
