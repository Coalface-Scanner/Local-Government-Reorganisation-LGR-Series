# Image Optimization Guide

## Critical Performance Issue

The `/polling_station.png` file is currently **1,881 KiB (1.8 MB)**, which is causing significant performance issues:
- **LCP (Largest Contentful Paint): 6.1s** (target: < 2.5s)
- **Performance Score: 68** (should be > 90)

## Immediate Action Required

### 1. Optimize `polling_station.png`

**Option A: Compress the existing PNG (Recommended)**
- Use an online tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- Target size: **< 200 KiB** (90% reduction)
- Since it's used at 23% opacity as a background, quality can be reduced significantly

**Option B: Convert to WebP**
- Convert to WebP format for better compression
- Use [Squoosh](https://squoosh.app/) or similar tool
- Target size: **< 150 KiB**
- Update code to use `.webp` extension with fallback

**Option C: Use a smaller placeholder first**
- Create a very small, low-quality version (< 50 KiB) for initial load
- Load the full version progressively after page is interactive

### 2. Optimize `rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg`

Currently **135.9 KiB** - should be optimized to:
- **Target: < 100 KiB**
- Use JPEG compression at 80-85% quality
- Or convert to WebP format

### 3. Additional Image Optimizations

- Use WebP format for all images where possible (with PNG/JPG fallbacks)
- Implement responsive images with `srcset` for different screen sizes
- Consider using a CDN image optimization service (like Cloudinary, Imgix, or Netlify Image CDN)

## Code Changes Already Applied

✅ **Delayed background image loading**: Background image now loads 1 second after page load, and only when in viewport (with 500ms additional delay)

✅ **Fetch priority set to "low"**: Background image won't block critical content

✅ **Intersection Observer**: Image only loads when section is near viewport

## Expected Improvements After Optimization

- **LCP**: Should improve from 6.1s to < 2.5s
- **Performance Score**: Should improve from 68 to 85+
- **Total Payload**: Should reduce from 2,747 KiB to < 1,000 KiB

## Tools for Image Optimization

1. **Online Tools:**
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
   - [Squoosh](https://squoosh.app/) - Google's image compression tool
   - [ImageOptim](https://imageoptim.com/) - Mac app for image optimization

2. **Command Line:**
   - `sharp-cli` - Image processing
   - `imagemin` - Image minification

3. **Netlify Plugins:**
   - Cloudinary plugin (automatically optimizes images)
   - Netlify Image CDN (responsive images)

## Next Steps

1. **Immediate**: Optimize `polling_station.png` using TinyPNG or Squoosh
2. **Short-term**: Convert images to WebP format with fallbacks
3. **Long-term**: Set up Cloudinary or Netlify Image CDN for automatic optimization
