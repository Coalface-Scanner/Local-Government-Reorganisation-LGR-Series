#!/usr/bin/env node
/**
 * Image Optimization Script
 * ============================================================
 * Converts PNG/JPG images in /public to WebP format alongside originals.
 * Uses the sharp library (already in devDependencies).
 *
 * Usage: node scripts/optimize-images.js
 *
 * Options:
 *   --quality <n>   WebP quality (default: 80)
 *   --dry-run       Show what would be converted without writing files
 *
 * The original files are kept for fallback. WebP files are created
 * alongside with the same basename (e.g. banner.png → banner.webp).
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { resolve, extname, join, relative } from 'path';

const PUBLIC_DIR = resolve(process.cwd(), 'public');
const QUALITY = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--quality') || '80', 10);
const DRY_RUN = process.argv.includes('--dry-run');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

async function findImages(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip seo-kit, .well-known, materials
      if (['seo-kit', '.well-known', 'materials', 'Key Facts'].includes(entry.name)) continue;
      results.push(...await findImages(fullPath));
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertToWebP(imagePath) {
  const webpPath = imagePath.replace(/\.(png|jpe?g)$/i, '.webp');
  const relPath = relative(PUBLIC_DIR, imagePath);

  if (DRY_RUN) {
    console.log(`  [dry-run] Would convert: ${relPath}`);
    return;
  }

  try {
    const info = await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const origStats = await stat(imagePath);
    const savings = ((1 - info.size / origStats.size) * 100).toFixed(1);
    console.log(`  ✅ ${relPath} → .webp (${savings}% smaller)`);
  } catch (err) {
    console.warn(`  ⚠️  Failed: ${relPath} — ${err.message}`);
  }
}

async function main() {
  console.log(`\n🖼️  Image Optimization (WebP, quality=${QUALITY})`);
  if (DRY_RUN) console.log('  [DRY RUN — no files will be written]\n');

  const images = await findImages(PUBLIC_DIR);
  console.log(`  Found ${images.length} images in /public\n`);

  let converted = 0;
  for (const img of images) {
    await convertToWebP(img);
    converted++;
  }

  console.log(`\n✅ Processed ${converted} images\n`);
}

main().catch(console.error);
