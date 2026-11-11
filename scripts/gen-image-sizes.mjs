/**
 * Emit smaller cuts of every photograph in /public/img, for `srcset`.
 *
 *   npm run images
 *
 * The originals are 1000–2200px wide and were being sent whole into card slots
 * a few hundred pixels across. For each `name.webp` this writes `name-480.webp`,
 * `name-800.webp` and `name-1200.webp` beside it — only the widths meaningfully
 * narrower than the source. `src/lib/img.ts` builds the srcset from whichever
 * of those files exist, so nothing else needs to know the list.
 *
 * Idempotent: a cut is skipped when it is newer than its source. Re-run after
 * adding or replacing a photo (and after scripts/recolor-plates.mjs).
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../public/img/', import.meta.url));
// Keep in step with WIDTHS in src/lib/img.ts.
const WIDTHS = [480, 800, 1200];
const VARIANT = new RegExp(`-(${WIDTHS.join('|')})\\.webp$`);
// A cut within a quarter of the source's width saves too little to be worth a
// second file — the original covers that slot.
const MIN_GAIN = 1.25;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.webp') && !VARIANT.test(e.name)) yield p;
  }
}

const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0);

let made = 0;
let skipped = 0;
for await (const src of walk(ROOT)) {
  const { width } = await sharp(src).metadata();
  const srcTime = await mtime(src);
  for (const w of WIDTHS) {
    if (!width || width < w * MIN_GAIN) continue;
    const out = src.replace(/\.webp$/, `-${w}.webp`);
    if ((await mtime(out)) > srcTime) {
      skipped++;
      continue;
    }
    await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(out);
    made++;
  }
}
console.log(`images: ${made} written, ${skipped} up to date`);
