// Photo optimizer for the Wahaj Khan Photography site.
//
// Usage (from the tools/ folder):
//   npm install            (first time only)
//   npm run optimize
//
// Drop the ORIGINAL photos (JPG / PNG / TIFF / HEIC-converted, any size) into
// the `photos-source/` folder at the project root, then run the command.
// For every photo it writes two web-ready WebP files:
//   photos/<name>.webp         full size for the lightbox (max 2000 px, ~300-500 KB)
//   photos/thumbs/<name>.webp  grid thumbnail           (max  900 px, ~60-150 KB)
// Originals are never modified. Photos already converted are skipped unless --force.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'photos-source');
const OUT = path.join(root, 'photos');
const THUMBS = path.join(OUT, 'thumbs');
const force = process.argv.includes('--force');
const EXT = /\.(jpe?g|png|tiff?|webp|avif)$/i;

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(THUMBS, { recursive: true });

const slug = s => s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const kb = f => Math.round(fs.statSync(f).size / 1024) + ' KB';

const files = fs.readdirSync(SRC).filter(f => EXT.test(f)).sort();
if (!files.length) {
  console.log(`No photos found in ${SRC}\nCopy the original photos there and run again.`);
  process.exit(0);
}

let done = 0, skipped = 0;
for (const f of files) {
  const name = slug(f);
  const full = path.join(OUT, name + '.webp');
  const thumb = path.join(THUMBS, name + '.webp');
  if (!force && fs.existsSync(full) && fs.existsSync(thumb)) { skipped++; continue; }
  const img = () => sharp(path.join(SRC, f), { failOn: 'none' }).rotate(); // respect camera orientation
  await img().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(full);
  await img().resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(thumb);
  const m = await sharp(full).metadata();
  console.log(`${f}  ->  ${name}.webp  ${m.width}x${m.height}  full ${kb(full)}  thumb ${kb(thumb)}`);
  done++;
}
console.log(`\nDone. ${done} optimized, ${skipped} skipped.`);
