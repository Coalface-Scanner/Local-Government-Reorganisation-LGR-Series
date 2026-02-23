/**
 * Crop top and bottom from the masthead logo to remove transparent/empty space.
 * Usage: node scripts/crop-banner-logo.js [percent-each-side]
 * Default: 10 (crops 10% from top and 10% from bottom).
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const percent = Math.min(25, Math.max(0, parseInt(process.argv[2], 10) || 10));
const inputPath = path.join(__dirname, '..', 'public', 'LGR-Banner-Masthead.png');
const outputPath = inputPath;

async function main() {
  const meta = await sharp(inputPath).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) {
    console.error('Could not read image dimensions');
    process.exit(1);
  }
  const cropTop = Math.round(h * (percent / 100));
  const cropBottom = Math.round(h * (percent / 100));
  const left = 0;
  const top = cropTop;
  const width = w;
  const height = h - cropTop - cropBottom;
  if (height <= 0) {
    console.error('Crop would remove entire image');
    process.exit(1);
  }
  const buffer = await sharp(inputPath)
    .extract({ left, top, width, height })
    .toBuffer();
  const fs = await import('fs');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Cropped ${percent}% from top and bottom. New height: ${height}px (was ${h}px).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
